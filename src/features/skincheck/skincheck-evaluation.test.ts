import { describe, expect, it } from 'vitest'

import { evaluateAssessment } from './skincheck-evaluation'

describe('evaluateAssessment', () => {
  it('uses the NICE weighted 7-point checklist weights and 3-point threshold for pigmented entries', () => {
    const evaluation = evaluateAssessment({
      colour: 'dark-brown-black',
      sizeMm: 8,
      borders: 'yes',
      colourUniformity: 'no',
      changes: ['growing'],
      asymmetry: 'yes',
      symptoms: { inflammation: 'no', oozing: 'no', itch: 'no', pain: 'no', growing: 'no' },
    })

    expect(evaluation.checklist.score).toBe(7)
    expect(evaluation.level).toBe('prompt-assessment')
  })

  it('marks unknown criteria as incomplete instead of treating them as zero', () => {
    const evaluation = evaluateAssessment({ colour: 'light-brown', sizeMm: 4, borders: 'no', colourUniformity: 'yes', changes: ['none'] })

    expect(evaluation.checklist.isComplete).toBe(false)
    expect(evaluation.checklist.criteria.find((criterion) => criterion.id === 'inflammation')?.status).toBe('unevaluated')
    expect(evaluation.level).toBe('consult-dermatologist')
  })

  it('does not apply the checklist to non-pigmented entries and still surfaces alert flags', () => {
    const evaluation = evaluateAssessment({ colour: 'red-pink', appearance: 'non-healing-sore', symptoms: { bleeding: 'yes' } })

    expect(evaluation.checklist.score).toBeNull()
    expect(evaluation.checklist.applicable).toBe(false)
    expect(evaluation.level).toBe('prompt-assessment')
    expect(evaluation.alertFlags).toContain('Кровоточивость или незаживающая язвочка')
  })
})
