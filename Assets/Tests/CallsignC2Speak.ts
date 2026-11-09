// C2: pinching Speak shows "Yes, push it", then "Sent to Meli", and the card fades within ~2 s.

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {waitUntil} from "./CallsignTestKit"
import {cardSummary, main, pinch, text, visible, waitForPing} from "./CallsignTestKit"

@component
export class CallsignC2Speak extends Scenario {
  async run(): Promise<void> {
    await waitForPing("Meli", 12000)
    await pinch("SpeakButton")
    const answeredT = main().time
    expect(text("AnswerText")).toBe('You: "Yes, push it"')
    expect(text("SentText")).toBe("Sent to Meli: Yes, push it")
    expect(visible("SpeakButton")).toBe(false)

    // fade starts after the 2 s sent hold; the card is hidden once the fade ends
    await waitUntil(() => main().cardMode === "none", 2600, () => "fade never started; " + cardSummary())
    const fadeT = main().time - answeredT
    await waitUntil(() => !visible("PingCard"), 1500, () => "card never hid; " + cardSummary())
    const hiddenT = main().time - answeredT
    print(`[CallsignTest] C2 fade start +${fadeT.toFixed(2)} s, hidden +${hiddenT.toFixed(2)} s`)
    expect(fadeT < 2.5).toBe(true)
    expect(hiddenT < 3.2).toBe(true)
    expect(visible("FleetDot")).toBe(true)
  }
}
