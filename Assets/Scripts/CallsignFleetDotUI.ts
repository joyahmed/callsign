// CallsignFleetDotUI.ts - passive view: the small fleet dot (Button "FleetDot").
// Visible when nothing needs Joy. Pinching it emits onOpen (stand-in for saying "open screen").

import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button"
import {ElementContent} from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"

@component
export class CallsignFleetDotUI extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">CallsignFleetDotUI - fleet dot</span>')
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Dot size in cm")
  @widget(new SliderWidget(2, 6, 0.5))
  dotSize: number = 3.5
  @input
  @hint("Dot label")
  label: string = "Fleet"
  @ui.group_end

  public onOpen: Event<void> = new Event<void>()

  onAwake() {
    // Button lives on this authored "FleetDot" SceneObject itself (one name for tests to find).
    const o = this.sceneObject
    const b = o.createComponent(Button.getTypeName()) as Button
    b.size = new vec3(this.dotSize, this.dotSize, 1)
    const c = o.createComponent(ElementContent.getTypeName()) as ElementContent
    c.text = this.label
    c.textSize = 22
    b.onTriggerUp.add(() => this.onOpen.invoke())
  }

  public show() {
    this.sceneObject.enabled = true
  }

  public hide() {
    this.sceneObject.enabled = false
  }
}
