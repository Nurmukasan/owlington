import json,subprocess
T5='/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t5'
tl=json.load(open(T5+'/timeline.json')); L={l['k']:l for l in tl['lines']}
a,b=L['n07']['start']-0.3,L['m01']['start']
ov=[t for w,t in L['n14']['words'] if 'общий' in w.lower()][0]-0.1
E=tl['END']
vol=f"if(between(t,{a:.2f},{b:.2f}),0.35,if(gt(t,{ov:.2f}),1.6,1))"
fc=(f"[2:a]atrim=0:{E},asetpts=PTS-STARTPTS,volume=0.16,volume='{vol}':eval=frame,afade=t=out:st={E-1.5:.2f}:d=1.5[m];"
    f"[0:a]asplit=2[v][vk];[m][vk]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[md];"
    f"[1:a]volume=0.38[s];[v][s][md]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-15.5:TP=-1.2:LRA=11[aout]")
subprocess.run(['ffmpeg','-v','error','-y','-i',T5+'/audio/voice.wav','-i',T5+'/audio/sfx.wav','-i',T5+'/audio/music.mp3','-filter_complex',fc,'-map','[aout]','-ar','48000','-ac','2',T5+'/audio/mix.wav'],check=True)
print('mix ok')
