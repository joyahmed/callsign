// CallsignTestKit.ts - shared helpers for the Callsign LEAF scenarios.
// Reads Lens state through scene objects (names confirmed in Scene.scene / runtime-built children)
// and presses UIKit buttons through the LEAF DefaultLeafInteractor (real SIK trigger, not debugPress).

import {DefaultLeafInteractor} from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import {findInteractableByName} from "Leaf.lspkg/Interactors/InteractableUtils"
import {findSceneObjectByName, sleep} from "Leaf.lspkg/Utils/common/Utils"
import {ElementContent} from "SpectaclesUIKit.lspkg/Scripts/Components/Content/ElementContent"
import {CallsignMain} from "../Scripts/CallsignMain"

/** Poll cond every 50 ms until true or timeout (LEAF 2.0.2 has no waitUntil). */
export async function waitUntil(cond: () => boolean, timeoutMs: number, msg: () => string): Promise<void> {
  const start = getTime()
  while (!cond()) {
    if ((getTime() - start) * 1000 > timeoutMs) throw new Error(`waitUntil timed out after ${timeoutMs} ms: ${msg()}`)
    await sleep(50)
  }
}

export function obj(name: string): SceneObject {
  const o = findSceneObjectByName(name)
  if (!o) throw new Error(`SceneObject "${name}" not found`)
  return o
}

/** CallsignMain on CallsignRoot. Typed as any so tests can read its private state (time, cardMode). */
export function main(): any {
  const c = obj("CallsignRoot").getComponent(CallsignMain.getTypeName())
  if (!c) throw new Error("CallsignMain component not found on CallsignRoot")
  return c
}

export function text(name: string): string {
  const t = obj(name).getComponent("Component.Text") as Text
  if (!t) throw new Error(`Text component not found on "${name}"`)
  return t.text
}

/** Label shown on a fleet tag, e.g. "Meli\nneeds Joy". */
export function tagLabel(machine: string): string {
  const c = obj("Tag" + machine).getComponent(ElementContent.getTypeName()) as ElementContent
  if (!c) throw new Error(`ElementContent not found on Tag${machine}`)
  return c.text
}

export function visible(name: string): boolean {
  return obj(name).isEnabledInHierarchy
}

export function cardSummary(): string {
  return `card=${visible("PingCard")} mode=${main().cardMode} title="${text("TitleText")}" q="${text(
    "QuestionText",
  )}" a="${text("AnswerText")}" sent="${text("SentText")}"`
}

/** Waits until a ping from `machine` is open on the card. */
export async function waitForPing(machine: string, timeoutMs: number): Promise<void> {
  await waitUntil(
    () => visible("PingCard") && main().cardMode === "ping" && text("TitleText") === machine + " calling Joy",
    timeoutMs,
    () => `no ping from ${machine}; ${cardSummary()}`,
  )
  await sleep(300) // let SIK register the freshly enabled buttons
}

/** Pinch a UIKit button by its SceneObject name through the LEAF interactor. */
export async function pinch(name: string): Promise<void> {
  const i = findInteractableByName(name, undefined, true)
  if (!i) throw new Error(`Interactable "${name}" not found or not enabled`)
  await new DefaultLeafInteractor().trigger(i)
  await sleep(200)
}
