import json,subprocess,os
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
T6='/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t6'
def flood(n,seed,th=200):
    a=np.array(Image.open(f'{T6}/st/{n}.png').convert('RGB')).astype(int)
    m=(a.min(2)>th)&((a.max(2)-a.min(2))<30)
    M=Image.new('L',(a.shape[1],a.shape[0])); M.putdata(list((m*255).astype('uint8').ravel()))
    ImageDraw.floodfill(M,(int(seed[0]),int(seed[1])),128); return np.array(M)==128
def alpha(n,rect=None):
    q=np.array(Image.open(f'{T6}/ui/masks/{n}.png'))>0
    if rect: x0,y0,x1,y1=rect; r=np.zeros_like(q); r[y0:y1,x0:x1]=True; q&=r
    return q
MASKS={'mock_pov':flood('mock_pov',(745,1180)),'tv_story':flood('tv_story',(447,1520)),'res_pov':flood('res_pov',(760,1626)),
       'settings':alpha('settings',(560,1100,1080,1480)),'mock45':alpha('mock45')}
def bbox(q): ys,xs=np.where(q); return int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1
jobs=[];plan=[]
for src,fn,outs in [('mock_pov','mock0',[0]),('mock45','mock45',[0]),('tv_story','sub',[0]),('settings','settings',[0,1,2,3]),('res_pov','result',[0,1,2,3,4,5])]:
    x0,y0,x1,y1=bbox(MASKS[src]); print(src,(x0,y0,x1,y1))
    for n in outs: name=f'{src}_u{n}'; jobs.append([name,fn,x1-x0,y1-y0,n]); plan.append((src,name,(x0,y0,x1,y1)))
subprocess.run(['node',T6+'/ui/shots.js',T6,json.dumps(jobs)],check=True,env={**os.environ,'NODE_PATH':subprocess.check_output(['npm','root','-g'],text=True).strip()})
for src,name,(x0,y0,x1,y1) in plan:
    im=Image.open(f'{T6}/st/{src}.png').convert('RGB'); q=MASKS[src]
    M=Image.fromarray((q*255).astype('uint8')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    u=Image.open(f'{T6}/ui/{name}.png').convert('RGB').resize((x1-x0,y1-y0),Image.LANCZOS)
    L=Image.new('RGB',im.size); L.paste(u,(x0,y0)); im.paste(L,(0,0),M); im.save(f'{T6}/st/{name}.png')
print('ok')
