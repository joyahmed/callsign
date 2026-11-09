// C1: ~5 s after start a chime + "Meli calling Joy" play and the ping card opens ~60 cm ahead,
// a little below eye level, titled "Meli calling Joy", question "trove: Push phase 16 to main now?".
// Accepted deviation: card 3 cm below eye level (not 15).

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {waitUntil} from "./CallsignTestKit"
import {main, obj, text, visible, waitForPing} from "./CallsignTestKit"

@component
export class CallsignC1Ping extends Scenario {
  async run(): Promise<void> {
    await waitUntil(() => main().time > 0, 5000, () => "CallsignMain never updated")
    const startT = main().time
    print(`[CallsignTest] C1 start lens t=${startT.toFixed(2)}`)
    expect(startT < 4.5).toBe(true) // must start before the first ping to measure its timing
    expect(visible("PingCard")).toBe(false) // idle: only the dot
    expect(visible("FleetDot")).toBe(true)

    await waitForPing("Meli", 12000)
    const pingT = main().time - 0.3
    print(`[CallsignTest] C1 ping at lens t=${pingT.toFixed(2)}`)
    expect(pingT > 4).toBe(true)
    expect(pingT < 6.5).toBe(true)

    expect(text("TitleText")).toBe("Meli calling Joy")
    expect(text("QuestionText")).toBe("trove: Push phase 16 to main now?")

    // audio: chime then the Meli voice clip
    const m = main()
    expect(m.chimeAudio.audioTrack === m.chime).toBe(true)
    await sleep(1200)
    expect(m.voiceAudio.audioTrack === m.callMeli).toBe(true)

    // placement: ~60 cm ahead, a little below eye level
    const cam = obj("Camera Object").getTransform()
    const d = obj("PingCard").getTransform().getWorldPosition().sub(cam.getWorldPosition())
    const horiz = Math.sqrt(d.x * d.x + d.z * d.z)
    const fwd = cam.back
    const fwdFlat = new vec3(fwd.x, 0, fwd.z).normalize()
    const along = new vec3(d.x, 0, d.z).normalize().dot(fwdFlat)
    print(`[CallsignTest] C1 card offset horiz=${horiz.toFixed(1)} dy=${d.y.toFixed(1)} along=${along.toFixed(3)}`)
    expect(horiz > 55).toBe(true)
    expect(horiz < 65).toBe(true)
    expect(d.y < 0).toBe(true)
    expect(d.y > -20).toBe(true)
    expect(along > 0.97).toBe(true) // straight ahead
  }
}
