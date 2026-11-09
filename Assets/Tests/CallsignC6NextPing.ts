// C6: after the first ping is answered the next arrives as "Ana calling Joy" (~4 s later), and
// turning / walking keeps the open card in view.
// Head motion: LEAF has no preview-camera driver, so the test pauses DeviceTracking on the camera
// and moves the camera transform itself (turn 90 deg, then walk 1 m), then checks that
// CallsignAnchor eases back to ~60 cm straight ahead of the new head pose.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {main, obj, pinch, text, visible, waitForPing} from "./CallsignTestKit"

function cardInView(tag: string): {horiz: number; along: number} {
  const cam = obj("Camera Object").getTransform()
  const d = obj("PingCard").getTransform().getWorldPosition().sub(cam.getWorldPosition())
  const fwd = cam.back
  const fwdFlat = new vec3(fwd.x, 0, fwd.z).normalize()
  const flat = new vec3(d.x, 0, d.z)
  const r = {horiz: flat.length, along: flat.normalize().dot(fwdFlat)}
  print(`[CallsignTest] C6 ${tag}: horiz=${r.horiz.toFixed(1)} along=${r.along.toFixed(3)}`)
  return r
}

@component
export class CallsignC6NextPing extends Scenario {
  async run(): Promise<void> {
    await waitForPing("Meli", 12000)
    await pinch("SpeakButton")
    const answeredT = main().time

    await waitForPing("Ana", 7000)
    const gap = main().time - 0.3 - answeredT
    print(`[CallsignTest] C6 Ana ping +${gap.toFixed(2)} s after answer`)
    expect(gap < 5).toBe(true)
    expect(text("QuestionText")).toBe("devgo: Tag v1.2.4?")

    const camObj = obj("Camera Object")
    const tracking = camObj.getComponent("Component.DeviceTracking") as DeviceTracking
    const camT = camObj.getTransform()
    const startPos = camT.getWorldPosition()
    const startRot = camT.getWorldRotation()
    if (tracking) tracking.enabled = false
    try {
      // turn right 90 deg
      camT.setWorldRotation(quat.angleAxis(-Math.PI / 2, vec3.up()).multiply(startRot))
      await sleep(150)
      const mid = cardInView("just after turn")
      expect(mid.along < 0.9).toBe(true) // the card really was left behind for a moment
      await sleep(2500)
      let r = cardInView("2.5 s after turn")
      expect(r.along > 0.97).toBe(true)
      expect(r.horiz > 55 && r.horiz < 65).toBe(true)

      // walk 100 cm forward along the new facing
      const fwd = camT.back
      camT.setWorldPosition(startPos.add(new vec3(fwd.x, 0, fwd.z).normalize().uniformScale(100)))
      await sleep(2500)
      r = cardInView("2.5 s after walk")
      expect(r.along > 0.97).toBe(true)
      expect(r.horiz > 55 && r.horiz < 65).toBe(true)
      expect(visible("PingCard")).toBe(true)
      expect(text("TitleText")).toBe("Ana calling Joy")
    } finally {
      camT.setWorldPosition(startPos)
      camT.setWorldRotation(startRot)
      if (tracking) tracking.enabled = true
    }
  }
}
