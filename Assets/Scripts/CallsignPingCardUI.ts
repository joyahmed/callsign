// CallsignPingCardUI.ts - passive view for the ping card / machine view.
// Owns: UIKit BackPlate + 4 UIKit Buttons (SpeakButton, YesButton, NoButton, LaterButton) + 4 text lines.
// Expects: nothing wired; builds its children under this SceneObject in onAwake.
// Must not: hold fleet state or make decisions. Reports intent via onAnswer(answerText).
// Note: text lines are stacked at fixed Y rows on a fixed-size card (no FlexLayout) to keep
// this build small; sizes are Inspector-tunable.

import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate"
import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button"
import {ElementContent} from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent"
import {setTextRect} from "SpectaclesUIKit.lspkg/Scripts/Utility/UIKitUtilities"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

@component
export class CallsignPingCardUI extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">CallsignPingCardUI - ping card and machine view</span>')
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Card size in cm (width, height)")
  cardSize: vec2 = new vec2(27, 16)
  @input
  @hint("Speak button width in cm")
  @widget(new SliderWidget(4, 12, 0.5))
  speakWidth: number = 7
  @input
  @hint("Yes / No / Later button width in cm")
  @widget(new SliderWidget(4, 8, 0.5))
  quickWidth: number = 5
  @input
  @hint("Button height in cm")
  @widget(new SliderWidget(3, 7, 0.5))
  buttonHeight: number = 4.5
  @input("vec4", "{0.55, 0.85, 1.0, 1.0}")
  @hint("Title line color (keep light: the display is additive)")
  @widget(new ColorWidget())
  titleColor: vec4 = new vec4(0.55, 0.85, 1.0, 1.0)
  @input("vec4", "{0.95, 0.95, 0.95, 1.0}")
  @hint("Body text color")
  @widget(new ColorWidget())
  bodyColor: vec4 = new vec4(0.95, 0.95, 0.95, 1.0)
  @input
  @hint("Seconds the fade-out takes")
  @widget(new SliderWidget(0.1, 2, 0.1))
  fadeSeconds: number = 0.5
  @ui.group_end

  public onAnswer: Event<string> = new Event<string>()

  private backPlate: BackPlate
  private titleText: Text
  private questionText: Text
  private answerText: Text
  private sentText: Text
  private buttons: Button[] = []
  private speakButton: Button
  private sampleAnswer = ""
  private answered = true
  private fading = false
  private fadeT = 0
  private fadeDone: () => void = null

  onAwake() {
    const plateObj = global.scene.createSceneObject("CardBack")
    plateObj.setParent(this.sceneObject)
    this.backPlate = plateObj.createComponent(BackPlate.getTypeName()) as BackPlate
    this.backPlate.style = "dark"
    this.backPlate.size = this.cardSize

    const w = this.cardSize.x - 3
    const top = this.cardSize.y / 2
    this.titleText = this.makeText("TitleText", top - 2.0, w, 2.6, 58, this.titleColor)
    this.questionText = this.makeText("QuestionText", top - 5.2, w, 3.6, 44, this.bodyColor)
    this.answerText = this.makeText("AnswerText", top - 8.2, w, 2.2, 40, this.bodyColor)
    this.sentText = this.makeText("SentText", top - 10.2, w, 2.0, 38, this.titleColor)

    const h = this.buttonHeight
    const gap = 1
    const total = this.speakWidth + 3 * this.quickWidth + 3 * gap
    let x = -total / 2
    const y = -top + h / 2 + 0.8
    this.speakButton = this.makeButton("SpeakButton", "Speak", x + this.speakWidth / 2, y, this.speakWidth, h, 52)
    x += this.speakWidth + gap
    const names = ["Yes", "No", "Later"]
    for (const n of names) {
      const b = this.makeButton(n + "Button", n, x + this.quickWidth / 2, y, this.quickWidth, h, 48)
      b.onTriggerUp.add(() => this.answer(n))
      x += this.quickWidth + gap
    }
    this.speakButton.onTriggerUp.add(() => this.answer(this.sampleAnswer))

    this.createEvent("UpdateEvent").bind(() => this.onUpdate())
  }

  private makeText(name: string, y: number, w: number, h: number, size: number, color: vec4): Text {
    const o = global.scene.createSceneObject(name)
    o.setParent(this.sceneObject)
    o.getTransform().setLocalPosition(new vec3(0, y, 0.3))
    const t = o.createComponent("Component.Text") as Text
    t.size = size
    t.text = ""
    t.depthTest = true
    t.renderOrder = 10
    t.horizontalAlignment = HorizontalAlignment.Center
    t.verticalAlignment = VerticalAlignment.Center
    t.horizontalOverflow = HorizontalOverflow.Wrap
    t.verticalOverflow = VerticalOverflow.Shrink
    t.textFill.color = color
    setTextRect(t, o, w, h)
    return t
  }

  private makeButton(name: string, label: string, x: number, y: number, w: number, h: number, textSize: number): Button {
    const o = global.scene.createSceneObject(name)
    o.setParent(this.sceneObject)
    o.getTransform().setLocalPosition(new vec3(x, y, 0.5))
    const b = o.createComponent(Button.getTypeName()) as Button
    b.size = new vec3(w, h, 1)
    const c = o.createComponent(ElementContent.getTypeName()) as ElementContent
    c.text = label
    c.textSize = textSize
    this.buttons.push(b)
    return b
  }

  private answer(text: string) {
    if (this.answered || this.fading) return
    this.answered = true
    this.showAnswer(text)
    this.onAnswer.invoke(text)
  }

  private setButtonsVisible(v: boolean) {
    for (const b of this.buttons) b.sceneObject.enabled = v
  }

  private resetFade() {
    this.fading = false
    this.setAlpha(1)
  }

  private setAlpha(a: number) {
    const texts = [this.titleText, this.questionText, this.answerText, this.sentText]
    for (const t of texts) {
      const c = t.textFill.color
      t.textFill.color = new vec4(c.x, c.y, c.z, a)
    }
    for (const b of this.buttons) b.opacity = a
  }

  /** Show a new call. Takes over the card. */
  public showPing(machine: string, project: string, question: string, sampleAnswer: string) {
    this.resetFade()
    this.sceneObject.enabled = true
    this.sampleAnswer = sampleAnswer
    this.answered = false
    this.titleText.text = machine + " calling Joy"
    this.questionText.text = project + ": " + question
    this.answerText.text = ""
    this.sentText.text = ""
    this.setButtonsVisible(true)
  }

  /** Show what Joy answered (spoken sample or quick answer). */
  public showAnswer(answer: string) {
    this.answerText.text = 'You: "' + answer + '"'
  }

  /** Show the confirmation line. */
  public showSent(machine: string, answer: string) {
    this.sentText.text = "Sent to " + machine + ": " + answer
    this.setButtonsVisible(false)
  }

  /** Show a machine's status view (name, OS, sessions). */
  public showMachineView(machine: string, os: string, sessions: string[]) {
    this.resetFade()
    this.sceneObject.enabled = true
    this.titleText.text = machine + " · " + os
    this.questionText.text = sessions[0] || ""
    this.answerText.text = sessions[1] || ""
    this.sentText.text = sessions[2] || ""
    this.setButtonsVisible(false)
  }

  /** Fade out then hide. */
  public fadeOut(done?: () => void) {
    this.fading = true
    this.fadeT = 0
    this.fadeDone = done || null
  }

  public hide() {
    this.fading = false
    this.sceneObject.enabled = false
  }

  /** Debug/test hook: acts like pinching a card button ("Speak", "Yes", "No", "Later"). */
  public debugPress(name: string) {
    this.answer(name === "Speak" ? this.sampleAnswer : name)
  }

  public get isAnswered(): boolean {
    return this.answered
  }

  private onUpdate() {
    if (!this.fading) return
    this.fadeT += getDeltaTime()
    const a = Math.max(0, 1 - this.fadeT / this.fadeSeconds)
    this.setAlpha(a)
    if (a <= 0) {
      this.hide()
      this.setAlpha(1)
      if (this.fadeDone) this.fadeDone()
    }
  }
}
