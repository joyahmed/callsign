---
status: approved
---

# Design brief: Fleet Calling Joy

<!-- Filled in by plan-lens from the learner's interview. Use the learner's words. Mark any value they didn't choose as (default). -->

## The one spatial moment
Joy is mid-workout with the glasses on all day. His Claude sessions run on four machines (Ana, Steph, Meli, Alina). Instead of leaving the workout to read a question and type an answer at the desk, a voice in the glasses says **"Meli calling Joy"** and the question appears, for example **"Meli · trove: Push phase 16 to main now?"** It should feel like Joy's own personal assistant for his fleet. Joy speaks his answer, the session goes back to work, and he keeps training.

## Why it belongs on glasses
- Uses: **leaves your body free** (hands stay on the workout, eyes stay up). Also **draws in the world**: the question comes to where he is, not to a desk.
- Why it's better than the phone or laptop version: "you guyz ask me questions, i have to leave my workout and come back and type. instead i could jst speak on the glasses." A phone has to be picked up, unlocked and typed on. The glasses bring the question to him and take a spoken answer.

## Product or overlay
- Type: **product.** The fleet ping card is the experience. Name: **Fleet Calling Joy**. The fleet row always reads Ana | Steph | Meli | Alina.
- What the real version would sense: live questions from Joy's machines and Claude sessions, and his voice.
- Stand-in for the preview:
  - **Sample fleet data** hard-coded in the Lens: a queue of 4 questions, one per machine (default):
    1. "Meli calling Joy" · trove: "Push phase 16 to main now?"
    2. "Ana calling Joy" · devgo: "Tag v1.2.4?"
    3. "Alina calling Joy" · sunstone: "Restart the server now?"
    4. "Steph calling Joy" · specs-lens: "Start the build from the brief?"
  - **Voice stand-in:** a big **Speak** button. Pinching it shows a sample spoken answer on the card, as if Joy had said it (for example "Yes, push it"). On real glasses, speech-to-text does this job.
  - **Sample machine views:** for swapping, each machine (Ana, Steph, Meli, Alina) has a hard-coded view: its name, OS (Ana = Ubuntu/WSL, Steph = Windows, Meli = Mac, Alina = server) (default), 2 to 3 running sessions with a project name and a status line like "devgo · running tests 18/26" (default).
  - The first ping arrives on its own about 5 seconds after the Lens starts (default). Each next ping arrives about 4 seconds after the previous one is answered (default).

## Where things live
- Where the user is looking during the main task: straight ahead, at his workout, standing or seated.
- **Ping card:** about 60 cm in front of his eyes, about 15 cm below eye level (default). Joy first said "1 feet"; the brief uses 60 cm because closer text strains the eyes. About 26 x 16 cm (default). Lazily follows his head so it stays in view while he moves (default).
- **Fleet dot:** a small light dot (about 3 cm) about 30 cm below the card spot, the only thing visible when nothing needs Joy (default). Pinching it, or saying "open screen", opens the fleet row so Joy can swap machines without waiting for a call.
- **Fleet row:** a thin row of four small machine tags (Ana, Steph, Meli, Alina) just under the ping card, each showing its state: working, done or needs Joy (default). About 26 x 4 cm (default).

## Hands and input
- **Answer by voice:** the big **Speak** button on the card (pinch).
- **Quick answers:** three big buttons on the card, **Yes**, **No** and **Later** (default), for answers that don't need words.
- **Swap machines:** pinch a machine tag in the fleet row. The card swaps to that machine's view. Pinch another tag to swap again. The active tag is highlighted.
- Targets are big (at least 4 cm) and highlight when aimed at.
- Voice and the button that does the same job: speaking the answer = pinching **Speak**; saying "open screen" = pinching the fleet dot.

## When things show
- **Ping card:** shows with the question when a machine needs Joy. After he answers it shows "Sent to Meli" for about 2 seconds, then fades away (default). Nothing shows when no machine needs him.
- **Fleet row:** shows while a ping card or a machine view is open, then fades with it (default).
- **Machine view:** shows when Joy pinches a machine tag. Hides after about 8 seconds without a pinch, or at once when a new call arrives, which takes over the card (default). The machine that asked changes from "needs Joy" to "working" once the answer is sent.
- If something needs attention out of view: a short chime, then a spoken call, **"<Machine> calling Joy"**, plays when a ping arrives, because Joy is probably not looking. Use Lens Studio text-to-speech if it works in the preview; otherwise a pre-made voice clip per machine (default). The card's title line reads "<Machine> calling Joy".

## Done criteria
Each one can be checked in Lens Studio's preview.
1. About 5 seconds after start, a chime and the spoken call "Meli calling Joy" play, and a ping card appears about 60 cm ahead, a little below eye level, titled "Meli calling Joy" with the question "trove: Push phase 16 to main now?"
2. Pinching **Speak** shows the sample answer "Yes, push it" on the card, then "Sent to Meli", and the card fades within about 2 seconds.
3. Pinching **Yes**, **No** or **Later** on a ping answers it the same way, and shows that answer in the "Sent" line.
4. While the card is open, the fleet row shows Ana, Steph, Meli and Alina. The machine that asked shows "needs Joy", and switches to "working" after the answer is sent.
5. With the card open, pinching the Steph tag swaps the card to Steph's view (its sessions and status lines), and pinching the Alina tag swaps it to Alina's view.
6. After the first ping is answered, the next one arrives with "Ana calling Joy". Turning or walking in the preview keeps the open card in view.

## Out of scope
- A real connection to Joy's machines or Claude sessions (sample data only).
- Real voice in the preview (the Speak button stands in).
- Phone features: calls, messages, email, music, search. Joy chose the fleet as the main thing.
- Typing or a keyboard.
- Full monitor or screen mirroring of the real machines. The machine view is a small status card, not a monitor.

## Risks and open questions
- Real speech-to-text works on the glasses, but may not in the preview. The demo relies on the Speak button. Feel unproven.
- Comfort during real exercise (sweat, movement, reading while out of breath) can only be judged on real glasses. Feel unproven.
- A head-following card can feel busy while moving. Check it in the preview and pin it in place if it does.
- Don't name or show any film or comic AI assistant character in the Lens or the video (third-party trademarks are not allowed). Describe it as Joy's personal assistant.
- A later version would need a real link from the machines to the Lens (for example a small relay the sessions post to). Not part of this build.

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
