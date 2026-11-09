# Callsign - Devpost text (draft)

Fill the bracketed parts after the build.

## Title
Callsign: your AI fleet calls you, you answer hands-free

## Tagline
When one of my coding machines needs me, it calls me by name in my Specs. I answer out loud and keep training.

## What it does
I run four AI coding sessions on three machines, and each has a name: Steph (Windows) and Ana (WSL) on my PC, Meli on my Mac, Alina on my Ubuntu Server. When a session needs a decision, it stops and waits for me. If I'm working out, that means stopping, walking to the desk, typing and walking back.

Callsign brings the question to me. A chime and a spoken call ("Meli calling Joy") play, and a card appears about 60 cm ahead, just below eye level, with the question. I answer by voice (in the preview, a Speak button stands in), or with one pinch: Yes, No or Later. The card says "Sent to Meli" and gets out of the way. A row of four callsigns shows which machine is working and which needs me, and pinching one shows what that machine is doing.

## Why glasses
Hands stay on the workout and eyes stay up. A phone has to be picked up, unlocked and typed on. The glasses bring the question to where I am and take a spoken answer.

## How I built it
- Planned with the `plan-lens` skill; the brief is in `devpost/design-brief.md`.
- Built in Lens Studio 5.23.2 with Snap's CLAD agents, using Spectacles Interaction Kit and UI Kit.
- Each machine calls in its own voice: Ava (Steph), Emily (Ana), Natasha (Meli), Amy (Alina, Piper on the Ubuntu Server). Lens Studio text-to-speech is deprecated, so the calls are pre-made clips.
- LEAF tests for each done criterion: 6 of 6 pass in the Lens Studio preview (LEAF 2.0.2).

## What's real and what's sample
- Sample: the questions and machine status are hard-coded; the Speak button stands in for speech-to-text in the preview.
- Real next step: a small relay that my sessions post to, so the Lens shows live questions.

## What I learned
[2-3 lines after the build: e.g. placing UI for an additive display, designing for "show only when needed".]

## Pre-existing code disclosure
None beyond Lens Studio templates and packages (SPECS Base Template, Spectacles Interaction Kit, UI Kit), the hackathon's plan-lens skill and AI tools (CLAD, Claude Code). [Confirm after the build.]
