// C4: with the card open the fleet row shows Ana, Steph, Meli, Alina; the asking machine shows
// "needs Joy" and switches to "working" after the answer is sent.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {obj, pinch, tagLabel, visible, waitForPing} from "./CallsignTestKit"

@component
export class CallsignC4FleetRow extends Scenario {
  async run(): Promise<void> {
    await waitForPing("Meli", 12000)
    expect(visible("FleetRow")).toBe(true)

    // order left to right: Ana | Steph | Meli | Alina
    const names = ["Ana", "Steph", "Meli", "Alina"]
    let lastX = -1e9
    for (const n of names) {
      expect(visible("Tag" + n)).toBe(true)
      const x = obj("Tag" + n).getTransform().getLocalPosition().x
      expect(x > lastX).toBe(true)
      lastX = x
    }
    expect(tagLabel("Meli")).toBe("Meli\nneeds Joy")
    expect(tagLabel("Ana")).toBe("Ana\nworking")
    expect(tagLabel("Steph")).toBe("Steph\nworking")
    expect(tagLabel("Alina")).toBe("Alina\ndone")

    await pinch("SpeakButton")
    expect(tagLabel("Meli")).toBe("Meli\nworking")
    print(`[CallsignTest] C4 Meli tag after answer: ${tagLabel("Meli").replace("\n", " / ")}`)
  }
}
