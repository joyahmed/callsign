// C3: Yes, No and Later each answer a ping the same way and show in the "Sent" line.
// Uses three consecutive pings: Meli (Yes), Ana (No), Alina (Later).

import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {pinch, text, visible, waitForPing} from "./CallsignTestKit"

@component
export class CallsignC3QuickAnswers extends Scenario {
  async run(): Promise<void> {
    const steps = [
      {machine: "Meli", button: "YesButton", answer: "Yes"},
      {machine: "Ana", button: "NoButton", answer: "No"},
      {machine: "Alina", button: "LaterButton", answer: "Later"},
    ]
    for (const s of steps) {
      await waitForPing(s.machine, 12000)
      expect(text("SentText")).toBe("")
      await pinch(s.button)
      expect(text("AnswerText")).toBe('You: "' + s.answer + '"')
      expect(text("SentText")).toBe("Sent to " + s.machine + ": " + s.answer)
      expect(visible(s.button)).toBe(false)
      print(`[CallsignTest] C3 ${s.button} -> ${text("SentText")}`)
    }
  }
}
