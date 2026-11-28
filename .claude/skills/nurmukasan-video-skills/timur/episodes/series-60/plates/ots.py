# Over-the-shoulder laptop shots: the show plays ON the laptop screen in perspective (not pasted flat on top).
# The lid is turned a little towards Timur (left), so its right edge is further away and shorter; the show image
# (with its subtitles, drawn before the warp) is projected onto that screen quad, pixelated to the plate grid,
# then the bezel/keyboard and Timur's back (occluding the lower-left corner) go on top.
# usage (plates dir, after dump.sh rendered ots_room + ots_back): python3 ots.py   -> out/ots_<name>.png
#        python3 ots.py video <in.mp4> <out.mp4>  (every frame of a clip projected the same way)
import sys, os, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = 2                     # plates are rendered at 2x (1440x2560)
Q = [(460, 940), (1280, 1020), (1264, 1560), (460, 1620)]          # screen quad TL TR BR BL (2x px)
BEZ = [(436, 912), (1306, 996), (1290, 1590), (436, 1650)]          # lid outline
BASE = [(436, 1650), (1290, 1590), (1350, 1770), (392, 1830)]       # keyboard deck down to the front edge on the desk
FONT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'fonts', 'PressStart2P-Regular.ttf')
G = 4                     # screen pixel grid (2x px) — finer than the world grid (10) so the show stays readable

def coeffs(dst, src):
    """perspective coefficients mapping output (dst quad) -> input (src rect) for Image.transform"""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; B += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()

def subtitle(img, text):
    if not text: return img
    img = img.copy(); d = ImageDraw.Draw(img); W, H = img.size
    f = ImageFont.truetype(FONT, int(H * 0.052))
    lines = text.split('\n'); lh = int(H * 0.075); y = H - int(H * 0.06) - lh * len(lines)
    for ln in lines:
        w = d.textlength(ln, font=f); x = (W - w) / 2
        d.text((x, y), ln, font=f, fill='white', stroke_width=max(3, int(H * 0.009)), stroke_fill='#140c1c'); y += lh
    return img

def project(show, size=(1440, 2560)):
    """the show image (RGB) warped into the screen quad on a transparent layer, on a pixel grid of G"""
    W, H = show.size
    small = [(x / G, y / G) for x, y in Q]
    out = show.transform((size[0] // G, size[1] // G), Image.PERSPECTIVE, coeffs(small, [(0, 0), (W, 0), (W, H), (0, H)]), Image.BILINEAR)
    mask = Image.new('L', out.size, 0); ImageDraw.Draw(mask).polygon(small, fill=255)
    layer = Image.new('RGBA', out.size, (0, 0, 0, 0)); layer.paste(out, (0, 0), mask)
    # screen light: slightly brighter centre, a soft diagonal glare
    g = Image.new('RGBA', out.size, (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    x0, y0 = Q[0][0] / G, Q[0][1] / G
    gd.polygon([(x0 + 40, y0), (x0 + 90, y0), (x0 + 40, y0 + 130), (x0 - 10, y0 + 130)], fill=(255, 255, 255, 18))
    g.putalpha(Image.fromarray(np.minimum(np.array(g.getchannel('A')), np.array(mask))))
    layer = Image.alpha_composite(layer, g)
    return layer.resize(size, Image.NEAREST)

def body(size=(1440, 2560)):
    """lid bezel, hinge and keyboard deck on the world pixel grid (10 px at 2x)"""
    k = 10; w, h = size[0] // k, size[1] // k
    L = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    sc = lambda P: [(x / k, y / k) for x, y in P]
    d.polygon(sc(BASE), fill='#8d8b9c', outline='#140c1c')
    for r in range(1, 5):          # key rows following the perspective of the deck
        t = r / 5.5
        a = (BASE[0][0] + (BASE[3][0] - BASE[0][0]) * t, BASE[0][1] + (BASE[3][1] - BASE[0][1]) * t)
        b = (BASE[1][0] + (BASE[2][0] - BASE[1][0]) * t, BASE[1][1] + (BASE[2][1] - BASE[1][1]) * t)
        d.line(sc([a, b]), fill='#605f71', width=1)
    d.polygon(sc(BEZ), fill='#1a1424', outline='#140c1c')
    d.line(sc([BEZ[3], BEZ[2]]), fill='#3a3850', width=1)
    hole = Image.new('L', (w, h), 0); ImageDraw.Draw(hole).polygon(sc(Q), fill=255)
    a = np.array(L); a[np.array(hole) > 0] = 0
    return Image.fromarray(a).resize(size, Image.NEAREST)

def key(back):
    """Timur's back plate was rendered on magenta: make it transparent"""
    a = np.array(back.convert('RGBA')); m = (a[..., 0] > 240) & (a[..., 1] < 20) & (a[..., 2] > 240); a[m, 3] = 0
    return Image.fromarray(a)

def compose(room, back, show, glow=True):
    im = room.convert('RGBA')
    if glow:   # the screen lights the wall and desk a little
        gl = Image.new('RGBA', im.size, (0, 0, 0, 0)); ImageDraw.Draw(gl).polygon(Q, fill=(140, 180, 255, 70))
        im = Image.alpha_composite(im, gl.filter(ImageFilter.GaussianBlur(120)))
    im = Image.alpha_composite(im, body(im.size))
    im = Image.alpha_composite(im, project(show, im.size))
    im = Image.alpha_composite(im, back)
    return im.convert('RGB')

SITCOM_BOX = (40, 500, 1400, 1540)      # the screen area of the code-drawn sitcom plates (tv*.png, 2x)
def sitcom(name): return Image.open(f'out/{name}.png').convert('RGB').crop(SITCOM_BOX)
def still(name): return Image.open(f'../shows/{name}.png').convert('RGB')

NATIVE = 'О боже! Ты съел мой сэндвич?\nМОЙ сэндвич?!'
SHOTS = {
    'ots_sit': (lambda: sitcom('tv_laugh'), ''), 'ots_sit_b': (lambda: sitcom('tv'), ''),
    'ots_sit_talk': (lambda: sitcom('tv_talk'), NATIVE), 'ots_sit_talk2': (lambda: sitcom('tv_talk2'), NATIVE),
    'ots_sit_quiet': (lambda: sitcom('tv'), NATIVE),
    'ots_sher': (lambda: still('sherlock'), "You've been in Afghanistan,\nI perceive."),
    'ots_sher_1': (lambda: still('sherlock'), "I'm gonna..."), 'ots_sher_2': (lambda: still('sherlock'), 'No way!'),
    'ots_sher_3': (lambda: still('sherlock'), 'Elementary!'),
    'ots_bb': (lambda: still('bb'), ''), 'ots_got': (lambda: still('got'), ''),
}

if __name__ == '__main__':
    room = Image.open('out/ots_room.png'); back = key(Image.open('out/ots_back.png'))
    if len(sys.argv) > 1 and sys.argv[1] == 'video':
        src, dst = sys.argv[2], sys.argv[3]; tmp = dst + '.frames'; os.makedirs(tmp, exist_ok=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-r', '24', f'{tmp}/f%04d.png'], check=True)
        r720, b720 = room, back
        for f in sorted(os.listdir(tmp)):
            if f.startswith('f'): compose(r720, b720, Image.open(f'{tmp}/{f}').convert('RGB')).resize((720, 1280), Image.NEAREST).save(f'{tmp}/o{f[1:]}')
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-framerate', '24', '-i', f'{tmp}/o%04d.png', '-c:v', 'libx264', '-crf', '14', '-pix_fmt', 'yuv420p', dst], check=True)
        print('video', dst)
    else:
        for k, (fn, sub) in SHOTS.items():
            compose(room, back, subtitle(fn(), sub)).save(f'out/{k}.png'); print('ok', k)
