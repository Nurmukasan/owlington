import json,subprocess,sys,os
from concurrent.futures import ThreadPoolExecutor
W='/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t5'
exec(open(W+'/tools/shots.py').read().split("json.dump")[0])
only=sys.argv[1:]
def run(k):
    if not only and os.path.exists(f'{W}/st/{k}.png'): return k+' exists'
    p,refs=S[k]; prompt=p+' '+STYLE
    a=['python3',W+'/tools/gen.py',k,'gpt_image_2_6',W+'/st','--','--prompt',prompt,'--aspect_ratio','9:16','--quality','high','--resolution','2k']
    for r in refs: a+=['--image-references',r]
    r=subprocess.run(a,capture_output=True,text=True,stdin=subprocess.DEVNULL); return (r.stdout+r.stderr)[-200:]
with ThreadPoolExecutor(8) as ex:
    for out in ex.map(run, only or list(S)): print(out.strip())
