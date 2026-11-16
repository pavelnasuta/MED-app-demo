import type { AssessmentDraft, AssessmentEvaluation, ChecklistCriterion, LesionColour, YesNoUnknown } from './skincheck-types'

const PIGMENTED_COLOURS: LesionColour[] = ['light-brown', 'dark-brown-black', 'multiple-colours']

function isPigmented(draft: AssessmentDraft) {
  return draft.colour ? PIGMENTED_COLOURS.includes(draft.colour) : false
}

function yesNoStatus(value: YesNoUnknown | undefined): 'present' | 'absent' | 'unevaluated' {
  if (value === 'yes') return 'present'
  if (value === 'no') return 'absent'
  return 'unevaluated'
}

function sensationStatus(draft: AssessmentDraft): ChecklistCriterion['status'] {
  const itch = draft.symptoms?.itch
  const pain = draft.symptoms?.pain
  if (itch === 'yes' || pain === 'yes') return 'present'
  if (itch === 'unknown' || pain === 'unknown' || !itch || !pain) return 'unevaluated'
  return 'absent'
}

function criteriaFor(draft: AssessmentDraft): ChecklistCriterion[] {
  const changes = draft.changes ?? []
  return [
    { id: 'size-change', label: 'Изменение размера', points: 2, status: changes.includes('growing') || draft.symptoms?.growing === 'yes' ? 'present' : changes.includes('unknown') || draft.symptoms?.growing === 'unknown' || (!changes.length && !draft.symptoms?.growing) ? 'unevaluated' : 'absent' },
    { id: 'irregular-shape', label: 'Неправильная форма', points: 2, status: yesNoStatus(draft.borders) },
    { id: 'irregular-colour', label: 'Неоднородная окраска', points: 2, status: draft.colourUniformity ? (draft.colourUniformity === 'no' ? 'present' : draft.colourUniformity === 'yes' ? 'absent' : 'unevaluated') : 'unevaluated' },
    { id: 'diameter', label: 'Диаметр 7 мм и более', points: 1, status: typeof draft.sizeMm === 'number' ? (draft.sizeMm >= 7 ? 'present' : 'absent') : 'unevaluated' },
    { id: 'inflammation', label: 'Воспаление', points: 1, status: yesNoStatus(draft.symptoms?.inflammation) },
    { id: 'oozing', label: 'Мокнутие', points: 1, status: yesNoStatus(draft.symptoms?.oozing) },
    { id: 'sensation-change', label: 'Изменение ощущений', points: 1, status: sensationStatus(draft) },
  ]
}

export function evaluateAssessment(draft: AssessmentDraft): AssessmentEvaluation {
  const applicable = isPigmented(draft)
  const criteria = criteriaFor(draft)
  const isComplete = criteria.every((criterion) => criterion.status !== 'unevaluated')
  const score = applicable ? criteria.reduce((sum, criterion) => sum + (criterion.status === 'present' ? criterion.points : 0), 0) : null
  const changes = draft.changes ?? []
  const alertFlags: string[] = []

  if (draft.symptoms?.rapidGrowth === 'yes') alertFlags.push('Быстрый рост')
  if (draft.symptoms?.bleeding === 'yes' || draft.symptoms?.nonHealingSore === 'yes' || draft.appearance === 'non-healing-sore') alertFlags.push('Кровоточивость или незаживающая язвочка')
  if (draft.appearance === 'firm-nodule' && (draft.symptoms?.rapidGrowth === 'yes' || draft.symptoms?.growing === 'yes')) alertFlags.push('Увеличивающийся плотный узелок')
  if (changes.includes('shape-change') || changes.includes('colour-change')) alertFlags.push('Заметное изменение формы или цвета')

  const hasMultipleSuspiciousSigns = alertFlags.length >= 2 || criteria.filter((criterion) => criterion.status === 'present').length >= 2
  if (hasMultipleSuspiciousSigns) alertFlags.push('Сочетание нескольких признаков, требующих внимания')

  const level = score !== null && score >= 3 || alertFlags.length > 0
    ? 'prompt-assessment'
    : !applicable || !isComplete || criteria.some((criterion) => criterion.status === 'present')
      ? 'consult-dermatologist'
      : 'no-urgent-criteria'

  const abcde: AssessmentEvaluation['abcde'] = [
    { letter: 'A', label: 'Асимметрия', status: draft.asymmetry === 'no' ? 'attention' : draft.asymmetry === 'yes' ? 'reassuring' : 'unevaluated' },
    { letter: 'B', label: 'Границы', status: draft.borders === 'yes' ? 'attention' : draft.borders === 'no' ? 'reassuring' : 'unevaluated' },
    { letter: 'C', label: 'Цвет', status: draft.colourUniformity === 'no' ? 'attention' : draft.colourUniformity === 'yes' ? 'reassuring' : 'unevaluated' },
    { letter: 'D', label: 'Диаметр', status: typeof draft.sizeMm === 'number' ? (draft.sizeMm >= 7 ? 'attention' : 'reassuring') : 'unevaluated' },
    { letter: 'E', label: 'Изменения', status: changes.some((change) => ['growing', 'shape-change', 'colour-change'].includes(change)) ? 'attention' : changes.includes('none') ? 'reassuring' : 'unevaluated' },
  ]

  const explanation = [
    ...(score === null ? ['Взвешенный 7-point checklist не применяется как универсальная оценка для непигментированных образований.'] : [`Взвешенный 7-point checklist: ${score} из 11 баллов${isComplete ? '' : '; часть критериев не оценена'}.`]),
    ...(alertFlags.length ? [`Отмечены признаки: ${alertFlags.join(', ')}.`] : []),
    ...(level === 'prompt-assessment' ? ['По введённым данным рекомендуется без промедления пройти очную медицинскую оценку.'] : level === 'consult-dermatologist' ? ['Есть изменения, неопределённые признаки или недостаточно данных; рекомендуется очный осмотр дерматолога.'] : ['Формальные критерии срочного направления по введённым данным не выявлены. Это не исключает заболевание.']),
  ]

  return { checklist: { applicable, score, criteria, isComplete }, abcde, alertFlags, level, explanation }
}
