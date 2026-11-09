// CallsignLeafIndex.ts - registers the Callsign LEAF scenarios (one per done criterion).

import {scenariosIndex} from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator"
import {ScenarioMetadata} from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata"
import {CallsignC1Ping} from "./CallsignC1Ping"
import {CallsignC2Speak} from "./CallsignC2Speak"
import {CallsignC3QuickAnswers} from "./CallsignC3QuickAnswers"
import {CallsignC4FleetRow} from "./CallsignC4FleetRow"
import {CallsignC5MachineView} from "./CallsignC5MachineView"
import {CallsignC6NextPing} from "./CallsignC6NextPing"

@component
export class CallsignLeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    {id: "CallsignC1Ping", typename: CallsignC1Ping.getTypeName()},
    {id: "CallsignC2Speak", typename: CallsignC2Speak.getTypeName()},
    {id: "CallsignC3QuickAnswers", typename: CallsignC3QuickAnswers.getTypeName()},
    {id: "CallsignC4FleetRow", typename: CallsignC4FleetRow.getTypeName()},
    {id: "CallsignC5MachineView", typename: CallsignC5MachineView.getTypeName()},
    {id: "CallsignC6NextPing", typename: CallsignC6NextPing.getTypeName()},
  ]
}
