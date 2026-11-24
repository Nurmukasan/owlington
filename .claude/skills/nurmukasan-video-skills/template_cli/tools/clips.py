import subprocess,sys,os,csv
from concurrent.futures import ThreadPoolExecutor
W='/tmp/claude-0/-home-user-owlington/0f1eceec-4fac-5e07-bae6-c2375df6edc3/scratchpad/t5'
ids={l.split('\t')[0]:l.split('\t')[1] for l in open(W+'/ids.tsv')}
SUF=" Keep the exact crisp pixel-art style, colours and character designs of the start frame; the owl stays a simple blocky pixel owl; no morphing, no extra limbs, no text, smooth natural motion."
C={
'c01':('grid','eyes',4,"The four panels slam together into the centre with a bright white flash and transform into the single close-up face; fast dramatic push-in; coloured light streaks of blue, pink, yellow and green swirl into his hoodie; he opens his eyes."),
'c02':('board_low',None,4,"Low-angle camera cranes up and slightly orbits around Timur as he presses the big planner onto the cork board with his palm and nods with determination."),
'c03':('read_top',None,4,"Top-down camera slowly rotates; Timur's hand drags the yellow highlighter along a line of text, steam rises from the coffee, sunlight shifts gently."),
'c04':('bus',None,4,"Camera slides sideways along the bus window as the city passes by with soft reflections; Timur nods to the audio in his headphones and looks up thoughtfully."),
'c05':('redpen',None,3,"The red pen draws a circle around the messy paragraph and then an arrow; slow push-in."),
'c06':('talk_room',None,5,"Timur walks across the rug talking out loud and gesturing with both hands, turning to the laptop and back; the camera follows him in a smooth tracking move."),
'c07':('asleep',None,4,"The owl tugs the small blanket over sleeping Timur's shoulders with its beak, Timur breathes slowly; gentle slow drift-in, the lamp light glows softly."),
'c08':('dawn',None,3,"Golden sunrise light sweeps across the room as Timur stretches his arms up; the camera slides sideways."),
'c09':('hall_wide',None,5,"Smooth dolly forward down the aisle between the rows of candidates toward the front of the bright exam hall, daylight through the windows, candidates writing."),
'c10':('speak_room',None,4,"Slow gentle orbit around the table; the examiner nods and writes a note while Timur talks and gestures confidently. Only these two people and the furniture; there is NO owl, no animal and no figurine anywhere."),
'c11':('celebrate',None,3,"Timur jumps with both fists up shouting with joy, papers fly, a burst of colourful confetti; quick swoop of the camera."),
'c12':('owl_close',None,3,"Slow push-in on the owl; the owl winks one eye and tilts its head."),
'c13':('shock',None,3,"Timur grabs his head in shock staring at the laptop, quick push-in with a small camera shake."),
'c14':('write_night',None,4,"Timur writes quickly, crosses out a line, then keeps writing; slow sideways move, lamp light."),
}
only=sys.argv[1:]
def run(k):
    if not only and os.path.exists(f'{W}/clips/{k}.mp4'): return k+' exists'
    s,e,d,p=C[k]
    a=['python3',W+'/tools/gen.py',k,'kling3_0',W+'/clips','--','--prompt',p+SUF,'--start-image',ids[s],'--mode','pro','--sound','off','--aspect_ratio','9:16','--duration',str(d)]
    if e: a+=['--end-image',ids[e]]
    r=subprocess.run(a,capture_output=True,text=True,stdin=subprocess.DEVNULL); return (r.stdout+r.stderr)[-250:]
with ThreadPoolExecutor(7) as ex:
    for out in ex.map(run, only or list(C)): print(out.strip(), flush=True)
