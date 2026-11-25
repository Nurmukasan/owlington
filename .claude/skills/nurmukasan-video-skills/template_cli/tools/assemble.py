import json,subprocess,re,os
W='/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t5'; A=W+'/audio'
lines={k:t for k,v,t in json.load(open(A+'/lines.json'))}
lines['n09']=json.load(open(A+'/dl/n09c.json'))[0]['text']
lines['h01']=json.load(open(A+'/dl/h01.json'))[0]['text']
SPEED={'n':1.25}
ORDER=[('h01',.12),('n02',.18),('n03',.15),('t01',.2),('n04',.15),('n05',.15),('n06',.12),('x01',.2),('n07',.12),('n08',.9),('m01',.15),('n09',.15),('j01',.12),('n10',.2),('mum',.12),('n11',.15),('n12',.15),('n13',.1),('inv',.12),('ex1',.12),('t02',.2),('n14',.12),('j02',.15),('n15',.6)]
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
os.makedirs(A+'/fin',exist_ok=True)
t=0.0; tl=[]; parts=[]
for k,gap in ORDER:
    raw=A+'/raw/'+('n09c' if k=='n09' else k)+'.mp3'
    sp=1.25 if k[0] in 'nh' else 1.06
    out=A+f'/fin/{k}.wav'
    af=f"silenceremove=start_periods=1:start_threshold=-60dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,areverse,atempo={sp},aresample=48000"
    if k=='mum': af+=",atrim=0:2.3,afade=t=out:st=2.1:d=0.2"
    subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-af',af,'-ac','1',out],check=True)
    d=dur(out)
    # stt segments (on 1.22/1.06 processed audio) -> rescale
    s2=json.load(open(A+'/s2t/'+('n09c' if k=='n09' else k)+'.json'))[0]['result_json']
    segs=[]
    for m in re.finditer(r'(\d\d):(\d\d):(\d\d\.\d+) --> (\d\d):(\d\d):(\d\d\.\d+)\n(.+?)(?:\n\n|$)',s2['vtt'],re.S):
        a=int(m[1])*3600+int(m[2])*60+float(m[3]); b=int(m[4])*3600+int(m[5])*60+float(m[6]); segs.append([a,b,m[7].strip()])
    tot_s2=max(b for a,b,_ in segs) if segs else d
    sc=d/max(tot_s2,0.1) if segs else 1
    clean=re.sub(r'\[[^\]]*\]','',lines[k]).replace('́','').strip()
    clean=re.sub(r'\s+',' ',clean)
    words=clean.split(' ')
    # distribute words over segments by char share
    wl=[len(w)+1 for w in words]; total=sum(wl)
    segl=[len(s[2])+1 for s in segs] or [1]; st=sum(segl)
    # cumulative char -> time via piecewise mapping on segments
    cum=0; wt=[]
    for w,l in zip(words,wl):
        frac=cum/total; target=frac*st; acc=0; ts=0
        for (a,b,tx),L in zip(segs,segl):
            if acc+L>=target: ts=(a+(b-a)*(target-acc)/L)*sc; break
            acc+=L
        wt.append([w,round(t+ts,3)]); cum+=l
    if k=='mum': wt=[x for x in wt][:4]
    tl.append({'k':k,'start':round(t,3),'end':round(t+d,3),'words':wt,'text':clean})
    parts.append((out,t)); t+=d+gap
END=round(t+0.2,3)
# mix
inputs=[];flt=[]
for i,(f,st0) in enumerate(parts):
    inputs+=['-i',f]; flt.append(f'[{i}:a]adelay={int(st0*1000)}|{int(st0*1000)}[a{i}]')
flt.append(''.join(f'[a{i}]' for i in range(len(parts)))+f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur={END}[o]')
subprocess.run(['ffmpeg','-v','error','-y',*inputs,'-filter_complex',';'.join(flt),'-map','[o]','-t',str(END),'-ar','48000','-ac','1',A+'/voice.wav'],check=True)
json.dump({'END':END,'lines':tl},open(W+'/timeline.json','w'),ensure_ascii=False,indent=1)
for x in tl: print(f"{x['k']:4} {x['start']:7.2f} {x['end']:7.2f}  {x['text'][:60]}")
print('END',END)
