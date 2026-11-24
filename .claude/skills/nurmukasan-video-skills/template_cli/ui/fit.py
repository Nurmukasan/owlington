# crisp UI fitted exactly into the screen area of a still (no pixelation, no effects)
import json,subprocess,os
from PIL import Image, ImageFilter
import numpy as np
T5='/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t5'
def screen_mask(im, box, kind):
    a=np.array(im.convert('RGB')).astype(int); x0,y0,x1,y1=box; sub=a[y0:y1,x0:x1]
    m=((sub.min(2)>150)&((sub.max(2)-sub.min(2))<35)) if kind=='grey' else (sub.min(2)>200)
    from PIL import ImageDraw
    M0=Image.fromarray((m*255).astype('uint8')).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    w,h=M0.size; ImageDraw.floodfill(M0,(w//2,h//2),128)          # keep only the screen region around the centre
    M=Image.fromarray(((np.array(M0)==128)*255).astype('uint8')).filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    ys,xs=np.where(np.array(M)>0); return M,(int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1)
def fit(src, box, ui, out, kind):
    im=Image.open(f'{T5}/st/{src}.png').convert('RGB'); x0,y0,_,_=box
    M,(a,b,c,d)=screen_mask(im,box,kind)
    u=Image.open(f'{T5}/ui/{ui}.png').convert('RGB').resize((c-a,d-b),Image.LANCZOS)
    layer=Image.new('RGB',M.size); layer.paste(u,(a,b))
    im.paste(layer,(x0,y0),M.filter(ImageFilter.GaussianBlur(0.8)))
    im.save(f'{T5}/st/{out}.png'); return (x0+a,y0+b,x0+c,y0+d)
LAP=(600,1200,1215,1600); PH=(500,640,1015,1640)
im=Image.open(f'{T5}/st/ots_laptop.png'); _,lb=screen_mask(im,LAP,'grey')
im2=Image.open(f'{T5}/st/phone_pov.png'); _,pb=screen_mask(im2,PH,'white')
LW,LH=lb[2]-lb[0],lb[3]-lb[1]; PW,PHh=pb[2]-pb[0],pb[3]-pb[1]; print('laptop screen',lb,'phone screen',pb)
jobs=[['mail','mail',LW,LH,0],['mock','mock',LW,LH,0]]+[[f'ph{n}','phone',PW,PHh,n] for n in range(5)]
subprocess.run(['node',T5+'/ui/shots.js',T5,json.dumps(jobs)],check=True,env={**os.environ,'NODE_PATH':subprocess.check_output(['npm','root','-g'],text=True).strip()})
fit('ots_laptop',LAP,'mail','ots_mail','grey'); fit('ots_laptop',LAP,'mock','ots_mock','grey')
for n in range(5): fit('phone_pov',PH,f'ph{n}',f'phone_r{n}','white')
print('ok')
