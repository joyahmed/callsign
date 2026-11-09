// C5: with the card open, pinching the Steph tag swaps the card to Steph's view, then the Alina tag
// swaps it to Alina's view (sessions and status lines).

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {main, pinch, text, visible, waitForPing} from "./CallsignTestKit"
import {MACHINES} from "../Scripts/CallsignFleetData"

@component
export class CallsignC5MachineView extends Scenario {
  async run(): Promise<void> {
    await waitForPing("Meli", 12000)

    for (const n of ["Steph", "Alina"]) {
      await pinch("Tag" + n)
      const m = MACHINES[n]
      expect(visible("PingCard")).toBe(true)
      expect(main().cardMode).toBe("view")
      expect(text("TitleText")).toBe(m.name + " · " + m.os)
      expect(text("QuestionText")).toBe(m.sessions[0])
      expect(text("AnswerText")).toBe(m.sessions[1] || "")
      expect(visible("SpeakButton")).toBe(false)
      print(`[CallsignTest] C5 view ${text("TitleText")} | ${text("QuestionText")}`)
    }
  }
}
