// CallsignFleetData.ts - sample fleet data (stand-in for live machine questions).
// Owns: the 4 machines, their OS and sample sessions, and the ordered question queue.
// Pure data, no scene access.

export type MachineState = "working" | "done" | "needs Joy"

export interface MachineInfo {
  name: string
  os: string
  sessions: string[]
  startState: MachineState
}

export interface FleetQuestion {
  machine: string
  project: string
  question: string
  sampleAnswer: string
  clipKey: string
}

// Row order is fixed by the brief: Ana | Steph | Meli | Alina
export const MACHINE_ORDER: string[] = ["Ana", "Steph", "Meli", "Alina"]

export const MACHINES: {[name: string]: MachineInfo} = {
  Ana: {
    name: "Ana",
    os: "Ubuntu / WSL",
    sessions: ["devgo · running tests 18/26", "zetta-hrm · lint clean", "palimpsest · idle"],
    startState: "working",
  },
  Steph: {
    name: "Steph",
    os: "Windows",
    sessions: ["specs-lens · reading the brief", "everything-joy · building docs"],
    startState: "working",
  },
  Meli: {
    name: "Meli",
    os: "Mac",
    sessions: ["trove · phase 16 ready to push", "banani-dohs · tests 42/42", "sunstone · syncing memory"],
    startState: "working",
  },
  Alina: {
    name: "Alina",
    os: "Ubuntu server",
    sessions: ["sunstone · server up 12 days", "zetta-community · deploy done"],
    startState: "done",
  },
}

export const QUESTIONS: FleetQuestion[] = [
  {machine: "Meli", project: "trove", question: "Push phase 16 to main now?", sampleAnswer: "Yes, push it", clipKey: "Meli"},
  {machine: "Ana", project: "devgo", question: "Tag v1.2.4?", sampleAnswer: "Yes, tag it", clipKey: "Ana"},
  {machine: "Alina", project: "sunstone", question: "Restart the server now?", sampleAnswer: "Not now, after my workout", clipKey: "Alina"},
  {machine: "Steph", project: "specs-lens", question: "Start the build from the brief?", sampleAnswer: "Yes, start the build", clipKey: "Steph"},
]
