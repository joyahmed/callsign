// CallsignMain.ts - orchestrator for Callsign.
// Owns: fleet state (machine states, question queue), timers, audio cues, head-follow of CallsignAnchor.
// Expects @inputs: cameraObject, anchor, pingCard, fleetRow, fleetDot, chime + 4 call clips.
// Must not: author UI (UI modules do that). Logs one "[Callsign] ..." line per state change (for LEAF).

import {CallsignPingCardUI} from "./CallsignPingCardUI"
import {CallsignFleetRowUI} from "./CallsignFleetRowUI"
import {CallsignFleetDotUI} from "./CallsignFleetDotUI"
import {MACHINES, MACHINE_ORDER, QUESTIONS, FleetQuestion} from "./CallsignFleetData"

interface Timer {
  at: number
  fn: () => void
  tag: string
}

@component
export class CallsignMain extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">CallsignMain - fleet calls Joy</span>')
  @ui.separator
  @ui.group_start("References")
  @input
  @hint("Main camera SceneObject (head pose)")
  cameraObject: SceneObject
  @input
  @hint("Head-following anchor that holds the card, fleet row and dot")
  anchor: SceneObject
  @input
  @hint("Ping card UI")
  pingCard: CallsignPingCardUI
  @input
  @hint("Fleet row UI")
  fleetRow: CallsignFleetRowUI
  @input
  @hint("Fleet dot UI")
  fleetDot: CallsignFleetDotUI
  @input
  @hint("Chime played before each call")
  chime: AudioTrackAsset
  @input
  @hint("Voice clip: Meli calling Joy")
  callMeli: AudioTrackAsset
  @input
  @hint("Voice clip: Ana calling Joy")
  callAna: AudioTrackAsset
  @input
  @hint("Voice clip: Alina calling Joy")
  callAlina: AudioTrackAsset
  @input
  @hint("Voice clip: Steph calling Joy")
  callSteph: AudioTrackAsset
  @ui.group_end
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Seconds before the first call")
  @widget(new SliderWidget(1, 20, 0.5))
  firstPingDelay: number = 5
  @input
  @hint("Seconds between an answer and the next call")
  @widget(new SliderWidget(1, 20, 0.5))
  nextPingDelay: number = 4
  @input
  @hint("Seconds the Sent line stays before the card fades")
  @widget(new SliderWidget(0.5, 6, 0.5))
  sentHoldSeconds: number = 2
  @input
  @hint("Seconds a machine view stays without a pinch")
  @widget(new SliderWidget(2, 20, 0.5))
  machineViewSeconds: number = 8
  @input
  @hint("Seconds from chime to spoken call")
  @widget(new SliderWidget(0, 2, 0.1))
  callAfterChime: number = 0.9
  @input
  @hint("Card distance in front of the eyes, cm")
  @widget(new SliderWidget(30, 120, 1))
  distanceCm: number = 60
  @input
  @hint("Card drop below eye level, cm")
  @widget(new SliderWidget(0, 40, 1))
  dropCm: number = 3
  @input
  @hint("Head-follow ease speed (higher = snappier)")
  @widget(new SliderWidget(0.5, 10, 0.5))
  followSpeed: number = 3
  @input
  @hint("Audio volume")
  @widget(new SliderWidget(0, 1, 0.05))
  volume: number = 1
  @ui.group_end
  @ui.separator
  @ui.group_start("Debug")
  @input
  @hint("Debug only: seconds after each call to auto-press Speak (0 = off)")
  @widget(new SliderWidget(0, 10, 0.5))
  debugAutoAnswerSeconds: number = 0
  @ui.group_end

  private time = 0
  private timers: Timer[] = []
  private queueIndex = 0
  private current: FleetQuestion = null
  private cardMode: string = "none" // none | ping | view
  private viewMachine = ""
  private chimeAudio: AudioComponent
  private voiceAudio: AudioComponent
  private started = false
  private snapped = false

  onAwake() {
    if (!this.cameraObject || !this.anchor || !this.pingCard || !this.fleetRow || !this.fleetDot) {
      print("[Callsign] ERROR missing @input wiring (camera/anchor/pingCard/fleetRow/fleetDot)")
      return
    }
    this.chimeAudio = this.makeAudio("ChimeAudio")
    this.voiceAudio = this.makeAudio("VoiceAudio")
    this.createEvent("OnStartEvent").bind(() => this.onStart())
    this.createEvent("UpdateEvent").bind(() => this.onUpdate())
  }

  private makeAudio(name: string): AudioComponent {
    const o = global.scene.createSceneObject(name)
    o.setParent(this.sceneObject)
    const a = o.createComponent("Component.AudioComponent") as AudioComponent
    try {
      a.playbackMode = Audio.PlaybackMode.LowLatency
    } catch (e) {
      // older runtimes: keep default mode
    }
    a.volume = this.volume
    return a
  }

  private onStart() {
    this.pingCard.onAnswer.add((answer: string) => this.onAnswer(answer))
    this.fleetRow.onTagPicked.add((m: string) => this.onTagPicked(m))
    this.fleetDot.onOpen.add(() => this.onDotOpen())
    for (const m of MACHINE_ORDER) this.fleetRow.setState(m, MACHINES[m].startState)
    this.after(this.firstPingDelay, () => this.nextPing(), "ping")
  }

  private after(sec: number, fn: () => void, tag: string) {
    this.timers.push({at: this.time + sec, fn: fn, tag: tag})
  }

  private cancel(tag: string) {
    this.timers = this.timers.filter((t) => t.tag !== tag)
  }

  private onUpdate() {
    const dt = getDeltaTime()
    this.time += dt
    if (!this.started) {
      // first frame after UIKit init: start idle (only the dot shows)
      this.started = true
      this.pingCard.hide()
      this.fleetRow.hide()
      this.fleetDot.show()
      print("[Callsign] idle")
    }
    const due = this.timers.filter((t) => t.at <= this.time)
    if (due.length > 0) {
      this.timers = this.timers.filter((t) => t.at > this.time)
      for (const t of due) t.fn()
    }
    this.follow(dt)
  }

  private follow(dt: number) {
    const cam = this.cameraObject.getTransform()
    const camPos = cam.getWorldPosition()
    let dir = cam.back // camera looks along its local -Z
    dir = new vec3(dir.x, 0, dir.z)
    if (dir.length < 0.001) return
    dir = dir.normalize()
    const target = camPos.add(dir.uniformScale(this.distanceCm)).add(new vec3(0, -this.dropCm, 0))
    const targetRot = quat.lookAt(dir.uniformScale(-1), vec3.up())
    const tr = this.anchor.getTransform()
    if (!this.snapped) {
      this.snapped = true
      tr.setWorldPosition(target)
      tr.setWorldRotation(targetRot)
      return
    }
    const k = 1 - Math.exp(-this.followSpeed * dt)
    tr.setWorldPosition(vec3.lerp(tr.getWorldPosition(), target, k))
    tr.setWorldRotation(quat.slerp(tr.getWorldRotation(), targetRot, k))
  }

  private clipFor(machine: string): AudioTrackAsset {
    if (machine === "Meli") return this.callMeli
    if (machine === "Ana") return this.callAna
    if (machine === "Alina") return this.callAlina
    if (machine === "Steph") return this.callSteph
    return null
  }

  private play(a: AudioComponent, track: AudioTrackAsset) {
    if (!track) return
    a.audioTrack = track
    a.volume = this.volume
    a.play(1)
  }

  private nextPing() {
    if (this.queueIndex >= QUESTIONS.length) {
      print("[Callsign] queue empty")
      return
    }
    const q = QUESTIONS[this.queueIndex]
    this.queueIndex += 1
    this.current = q
    this.cancel("view")
    this.cancel("fade")
    this.cardMode = "ping"
    this.viewMachine = ""
    this.pingCard.showPing(q.machine, q.project, q.question, q.sampleAnswer)
    this.fleetRow.setState(q.machine, "needs Joy")
    this.fleetRow.setActive(q.machine)
    this.fleetRow.show()
    this.fleetDot.hide()
    print("[Callsign] state " + q.machine + " needs Joy")
    this.play(this.chimeAudio, this.chime)
    const clip = this.clipFor(q.machine)
    this.after(this.callAfterChime, () => this.play(this.voiceAudio, clip), "voice")
    print("[Callsign] ping " + q.machine + ": " + q.project + ": " + q.question)
    if (this.debugAutoAnswerSeconds > 0) {
      this.after(this.debugAutoAnswerSeconds, () => this.pingCard.debugPress("Speak"), "debug")
    }
  }

  private onAnswer(answer: string) {
    const q = this.current
    if (!q || this.cardMode !== "ping") return
    print("[Callsign] answer " + q.machine + ": " + answer)
    this.pingCard.showSent(q.machine, answer)
    this.fleetRow.setState(q.machine, "working")
    print("[Callsign] sent " + q.machine + ": " + answer)
    print("[Callsign] state " + q.machine + " working")
    this.current = null
    this.after(this.sentHoldSeconds, () => this.closeCard(), "fade")
    this.after(this.nextPingDelay, () => this.nextPing(), "ping")
  }

  private closeCard() {
    this.cardMode = "none"
    this.pingCard.fadeOut(() => print("[Callsign] faded"))
    this.fleetRow.hide()
    this.fleetDot.show()
    print("[Callsign] fade")
  }

  private onTagPicked(machine: string) {
    const m = MACHINES[machine]
    if (!m) return
    this.cancel("view")
    this.cancel("fade")
    this.cardMode = "view"
    this.viewMachine = machine
    this.pingCard.showMachineView(m.name, m.os, m.sessions)
    this.fleetRow.setActive(machine)
    this.fleetRow.show()
    this.fleetDot.hide()
    print("[Callsign] view " + machine)
    this.after(this.machineViewSeconds, () => this.endView(), "view")
  }

  private endView() {
    print("[Callsign] view hide " + this.viewMachine)
    this.viewMachine = ""
    const q = this.current
    if (q) {
      // the unanswered call is still waiting: bring it back
      this.cardMode = "ping"
      this.pingCard.showPing(q.machine, q.project, q.question, q.sampleAnswer)
      this.fleetRow.setActive(q.machine)
      print("[Callsign] ping " + q.machine + " (back)")
    } else {
      this.cardMode = "none"
      this.pingCard.fadeOut()
      this.fleetRow.hide()
      this.fleetDot.show()
    }
  }

  private onDotOpen() {
    print("[Callsign] fleet open")
    this.fleetRow.setActive("")
    this.fleetRow.show()
    this.fleetDot.hide()
    this.cancel("view")
    this.after(this.machineViewSeconds, () => this.endView(), "view")
  }
}
