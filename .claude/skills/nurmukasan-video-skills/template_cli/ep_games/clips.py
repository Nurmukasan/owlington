import subprocess,sys,os
from concurrent.futures import ThreadPoolExecutor
W='/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t6'
ids={}
for l in open(W+'/ids.tsv'): p=l.split('\t'); ids[p[0]]=p[1]
SUF=" Keep the exact chunky retro pixel-art style, colours and character designs of the start frame; the owl stays a simple blocky pixel owl; every object keeps its shape; no morphing, no extra limbs, no new objects, no text, smooth natural motion."
C={
'c01':('hook',4,"Fast dramatic push-in towards Timur's face; he leans closer to the screen, eyes narrow with excitement, the RGB lights pulse and the monitor light flickers on his face."),
'c02':('room',4,"Slow dolly forward with a slight arc around the room towards Timur; he turns his head to the camera and smiles, holding the controller."),
'c03':('smug',3,"Slow push-in; Timur rubs his hands together and grins wider like a villain with a plan, one eyebrow goes up."),
'c04':('day1',4,"Handheld camera shake; Timur panics, mashing the keyboard and mouse, looking left and right in confusion, the question marks bob above his head."),
'c05':('brain',4,"Slow orbit around the glowing brain; yellow sparkles travel from the orange almond-shaped region to the cyan seahorse-shaped region and pulse brighter; the tiny controller and heart orbit."),
'c06':('curious',4,"Slow push-in on Timur's face; his eyes widen and shine, he leans even closer to the TV, the TV light flickers in warm colours."),
'c07':('call',4,"Camera orbits from the side to the front of Timur as he speaks into the headset mic and points at the monitor confidently, nodding."),
'c08':('win',3,"Quick low-angle swoop up; Timur throws both fists up and shouts with joy, the fireworks on the monitor burst, the owl flaps its wings."),
'c09':('stream',4,"Gentle sideways drift along the bed; Timur laughs and kicks his feet in the air while watching the tablet."),
'c10':('essay',3,"Slow push-in from above towards the empty sheet; Timur taps the pen nervously, a sweat drop runs down, his eyes dart around."),
'c11':('hall',5,"Smooth dolly forward down the aisle between the rows of candidates towards the front of the bright exam hall, candidates writing, daylight through the windows."),
'c12':('speak',4,"Slow orbit around the table; the examiner nods and writes a note while Timur talks and gestures confidently. Only these two people; no animals, no extra objects."),
'c13':('owl',3,"Slow push-in on the owl; the owl winks one eye and tilts its head."),
}
only=sys.argv[1:]
def run(k):
    if not only and os.path.exists(f'{W}/clips/{k}.mp4'): return k+' exists'
    s,d,p=C[k]
    a=['python3',W+'/tools/gen.py',k,'kling3_0',W+'/clips','--','--prompt',p+SUF,'--start-image',ids[s],'--mode','pro','--sound','off','--aspect_ratio','9:16','--duration',str(d)]
    r=subprocess.run(a,capture_output=True,text=True,stdin=subprocess.DEVNULL); return (r.stdout+r.stderr)[-200:]
with ThreadPoolExecutor(7) as ex:
    for out in ex.map(run, only or list(C)): print(out.strip(), flush=True)
