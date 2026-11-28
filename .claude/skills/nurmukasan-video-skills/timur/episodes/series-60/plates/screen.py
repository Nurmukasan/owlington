# The shows on the laptop screen of the classic screen plate (tv*.png — the same frontal laptop as the sitcom shots):
# each AI still (4:3) is fitted into the screen area, put on the screen's pixel grid, with its subtitle drawn in the
# Press Start style of the sitcom subtitles. The keyboard, desk and popcorn of the plate stay as they are.
# usage (plates dir, after dump.sh rendered tv): python3 screen.py  -> out/scr_<name>.png
#        python3 screen.py video <in.mp4> <out.mp4> [start] [end]  (a clip on the same screen, 720x1280, 24 fps)
import sys, os, subprocess
from PIL import Image, ImageDraw, ImageFont
BOX = (40, 500, 1400, 1540)            # the screen area of tv*.png (2x px): art x 4-140, y 50-154
G = 4                                  # screen pixel grid (2x px)
FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts', 'PressStart2P-Regular.ttf')

def fit(img):
    w, h = BOX[2] - BOX[0], BOX[3] - BOX[1]; iw, ih = img.size; s = max(w / iw, h / ih)
    img = img.resize((round(iw * s), round(ih * s)), Image.LANCZOS)
    l, t = (img.width - w) // 2, (img.height - h) // 2
    img = img.crop((l, t, l + w, t + h))
    return img.resize((w // G, h // G), Image.BILINEAR).resize((w, h), Image.NEAREST)

def subtitle(img, text):
    if not text: return img
    d = ImageDraw.Draw(img); W, H = img.size; lines = text.split('\n'); size = 44
    while max(ImageFont.truetype(FONT, size).getlength(l) for l in lines) > W * 0.9: size -= 2
    f = ImageFont.truetype(FONT, size); lh = int(size * 1.4); y = H - 40 - lh * len(lines)
    for ln in lines:
        d.text(((W - d.textlength(ln, font=f)) / 2, y), ln, font=f, fill='white', stroke_width=7, stroke_fill='#140c1c'); y += lh
    return img

def compose(base, show, sub=''):
    im = base.copy(); im.paste(subtitle(fit(show), sub), BOX[:2]); return im

SHOTS = {'scr_sher': ('sherlock', "You've been in Afghanistan,\nI perceive."), 'scr_sher_1': ('sherlock', "I'm gonna..."),
         'scr_sher_2': ('sherlock', 'No way!'), 'scr_sher_3': ('sherlock', 'Elementary!'), 'scr_bb': ('bb', ''), 'scr_got': ('got', '')}

if __name__ == '__main__':
    base = Image.open('out/tv.png').convert('RGB')
    if len(sys.argv) > 1 and sys.argv[1] == 'video':
        src, dst = sys.argv[2], sys.argv[3]; a = sys.argv[4] if len(sys.argv) > 4 else '0'; b = sys.argv[5] if len(sys.argv) > 5 else '99'
        tmp = dst + '.frames'; os.makedirs(tmp, exist_ok=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', a, '-to', b, '-i', src, '-r', '24', f'{tmp}/f%04d.png'], check=True)
        for f in sorted(x for x in os.listdir(tmp) if x.startswith('f')):
            compose(base, Image.open(f'{tmp}/{f}').convert('RGB')).resize((720, 1280), Image.LANCZOS).save(f'{tmp}/o{f[1:]}')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '24', '-i', f'{tmp}/o%04d.png', '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', dst], check=True)
        print('video', dst)
    else:
        for k, (src, sub) in SHOTS.items():
            compose(base, Image.open(f'../shows/{src}.png').convert('RGB'), sub).save(f'out/{k}.png'); print('ok', k)
