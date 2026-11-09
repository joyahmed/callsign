// CallsignFleetRowUI.ts - passive view: row of 4 machine tags (TagAna, TagSteph, TagMeli, TagAlina).
// Owns: 4 toggleable UIKit Buttons showing "Name / state"; the active tag is highlighted (isOn).
// Must not: hold fleet state. Reports intent via onTagPicked(machineName).

import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button"
import {ElementContent} from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

@component
export class CallsignFleetRowUI extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">CallsignFleetRowUI - machine tags</span>')
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Tag width in cm")
  @widget(new SliderWidget(4, 8, 0.5))
  tagWidth: number = 6
  @input
  @hint("Tag height in cm")
  @widget(new SliderWidget(3, 6, 0.5))
  tagHeight: number = 4
  @input
  @hint("Gap between tags in cm")
  @widget(new SliderWidget(0, 2, 0.1))
  gap: number = 0.6
  @input
  @hint("Tag label text size")
  @widget(new SliderWidget(20, 60, 1))
  textSize: number = 30
  @ui.group_end

  public onTagPicked: Event<string> = new Event<string>()

  private names: string[] = ["Ana", "Steph", "Meli", "Alina"]
  private buttons: {[n: string]: Button} = {}
  private contents: {[n: string]: ElementContent} = {}
  private states: {[n: string]: string} = {}
  private active = ""

  onAwake() {
    const total = this.names.length * this.tagWidth + (this.names.length - 1) * this.gap
    let x = -total / 2 + this.tagWidth / 2
    for (const n of this.names) {
      const o = global.scene.createSceneObject("Tag" + n)
      o.setParent(this.sceneObject)
      o.getTransform().setLocalPosition(new vec3(x, 0, 0.5))
      const b = o.createComponent(Button.getTypeName()) as Button
      b.size = new vec3(this.tagWidth, this.tagHeight, 1)
      b.setIsToggleable(true)
      const c = o.createComponent(ElementContent.getTypeName()) as ElementContent
      this.states[n] = "working"
      c.text = n + "\nworking"
      c.textSize = this.textSize
      b.onTriggerUp.add(() => this.onTagPicked.invoke(n))
      this.buttons[n] = b
      this.contents[n] = c
      x += this.tagWidth + this.gap
    }
  }

  public setState(machine: string, state: string) {
    this.states[machine] = state
    const c = this.contents[machine]
    if (c) c.text = machine + "\n" + state
  }

  /** Highlight one tag ("" clears). */
  public setActive(machine: string) {
    this.active = machine
    for (const n of this.names) {
      const b = this.buttons[n]
      if (b) b.isOn = n === machine
    }
  }

  public getState(machine: string): string {
    return this.states[machine]
  }

  public show() {
    this.sceneObject.enabled = true
    this.setActive(this.active)
  }

  public hide() {
    this.sceneObject.enabled = false
  }
}
