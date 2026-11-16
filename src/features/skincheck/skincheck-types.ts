export const FACE_LOCATIONS = [
  'forehead',
  'temple',
  'cheek',
  'nose',
  'eye-area',
  'chin',
  'lip-area',
  'ear',
  'other-face-area',
] as const

export type FaceLocation = (typeof FACE_LOCATIONS)[number]
export type YesNoUnknown = 'yes' | 'no' | 'unknown'
export type Appearance = 'flat-spot' | 'raised-mole' | 'firm-nodule' | 'reddish-lesion' | 'non-healing-sore' | 'other'
export type LesionColour = 'flesh' | 'light-brown' | 'dark-brown-black' | 'red-pink' | 'multiple-colours' | 'other'
export type Change = 'growing' | 'shape-change' | 'colour-change' | 'none' | 'unknown'

export type AssessmentDraft = {
  location?: FaceLocation
  appearedWhen?: 'under-month' | 'one-to-six-months' | 'over-six-months' | 'long-standing' | 'unknown'
  appearance?: Appearance
  sizeMm?: number
  colour?: LesionColour
  asymmetry?: YesNoUnknown
  borders?: YesNoUnknown
  colourUniformity?: YesNoUnknown
  changes?: Change[]
  symptoms?: {
    itch?: YesNoUnknown
    pain?: YesNoUnknown
    bleeding?: YesNoUnknown
    crusting?: YesNoUnknown
    oozing?: YesNoUnknown
    nonHealingSore?: YesNoUnknown
    growing?: YesNoUnknown
    rapidGrowth?: YesNoUnknown
    denser?: YesNoUnknown
    inflammation?: YesNoUnknown
  }
  riskFactors?: {
    sunburns?: YesNoUnknown
    manyMoles?: YesNoUnknown
    previousSkinCancer?: YesNoUnknown
    familyMelanoma?: YesNoUnknown
    immunosuppression?: YesNoUnknown
  }
}

export type ChecklistCriterion = {
  id: 'size-change' | 'irregular-shape' | 'irregular-colour' | 'diameter' | 'inflammation' | 'oozing' | 'sensation-change'
  label: string
  points: 1 | 2
  status: 'present' | 'absent' | 'unevaluated'
}

export type AssessmentResultLevel = 'no-urgent-criteria' | 'consult-dermatologist' | 'prompt-assessment'

export type AssessmentEvaluation = {
  checklist: {
    applicable: boolean
    score: number | null
    criteria: ChecklistCriterion[]
    isComplete: boolean
  }
  abcde: Array<{ letter: 'A' | 'B' | 'C' | 'D' | 'E'; label: string; status: 'attention' | 'reassuring' | 'unevaluated' }>
  alertFlags: string[]
  level: AssessmentResultLevel
  explanation: string[]
}
