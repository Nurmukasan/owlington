#!/usr/bin/env python3
"""gen.py NAME MODEL OUTDIR -- [higgsfield generate create args...]
Runs a generation with --wait --json, downloads the result to OUTDIR/NAME.<ext>, logs id."""
import sys, json, subprocess, urllib.request, os, time
name, model, outdir = sys.argv[1:4]
args = sys.argv[5:] if sys.argv[4] == '--' else sys.argv[4:]
W = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for attempt in range(3):
    p = subprocess.run(['higgsfield','generate','create',model,*args,'--wait','--wait-timeout','25m','--json'],capture_output=True,text=True,stdin=subprocess.DEVNULL)
    try:
        d = json.loads(p.stdout); job = d[0] if isinstance(d,list) else d
        if job.get('status') == 'completed' and job.get('result_url'): break
    except Exception: job = None
    print(f'[{name}] attempt {attempt} failed: {p.stdout[-300:]} {p.stderr[-300:]}', file=sys.stderr); time.sleep(5)
else:
    sys.exit(1)
url = job['result_url']; ext = url.rsplit('.',1)[-1].split('?')[0]
os.makedirs(outdir, exist_ok=True)
dst = os.path.join(outdir, f'{name}.{ext}')
urllib.request.urlretrieve(url, dst)
json.dump(job, open(os.path.join(W,'jobs',f'{name}.json'),'w'))
with open(os.path.join(W,'ids.tsv'),'a') as f: f.write(f'{name}\t{job["id"]}\t{url}\n')
print(f'{name}\t{job["id"]}\t{dst}')
