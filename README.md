# Callsign

I run four AI coding sessions on three machines and each one has a name. Steph and Ana are on my PC, Steph on Windows and Ana on WSL. Meli is on my Mac and Alina is on my Ubuntu Server.

When one of them needs me, it stops and waits for an answer. If I'm working out, I have to stop, walk to the desk, type the answer and walk back. That happens many times a day, so I built this Lens for Snap Specs.

Video, 2:34: https://youtu.be/cusl_jVHmCY

## How it works

Nothing shows until a machine needs me. Then I hear a chime and the machine calls me by name, like "Meli calling Joy", and a card shows me the question. I answer out loud, or I pinch Yes, No or Later. In the Lens Studio preview there's no mic, so the Speak button stands in for my voice.

Below the card there's a row with all four callsigns, so I can see who is working and who needs me. I can pinch any of them to see what that machine is doing.

Each machine calls in its own voice, so I know who it is before I look. I made the clips with Microsoft Edge neural voices (Ava, Emily, Natasha) and Piper (Amy), because text-to-speech in Lens Studio is deprecated.

The questions are sample data for now, in `Assets/Scripts/CallsignFleetData.ts`. Next I'm building a small relay that my sessions post to, so the Lens shows the real questions.

## Run it

Open `specs-lens.esproj` in Lens Studio 5.23.2 and press Preview. Meli calls first.

## How I built it

I planned it with the `plan-lens` skill (the brief is in `devpost/design-brief.md`) and built it with Snap's CLAD agents in Lens Studio, using Spectacles Interaction Kit 2.0.0 and UI Kit. Every done criterion in the brief has a LEAF test, and all 6 pass in the preview (LEAF 2.0.2).

I made it for the Learn AR with SPECS hackathon. The Devpost text is in `devpost/submission.md`.
