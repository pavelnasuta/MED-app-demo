import { FACE_LOCATION_LABELS, type FaceLocation } from './skincheck-types'

const mapPoints: Array<{ location: FaceLocation; x: number; y: number }> = [
  { location: 'forehead', x: 120, y: 53 },
  { location: 'temple', x: 62, y: 91 },
  { location: 'cheek', x: 71, y: 142 },
  { location: 'nose', x: 120, y: 119 },
  { location: 'eye-area', x: 154, y: 101 },
  { location: 'chin', x: 120, y: 190 },
  { location: 'lip-area', x: 120, y: 159 },
  { location: 'ear', x: 182, y: 124 },
]

type FaceMapProps = { value?: FaceLocation; onChange: (location: FaceLocation) => void }

export function FaceMap({ value, onChange }: FaceMapProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-[13rem_1fr] sm:items-center">
      <div className="mx-auto w-full max-w-[13rem] rounded-[2rem] bg-teal-50 p-3">
        <svg viewBox="0 0 240 240" className="w-full" role="img" aria-label="Схема лица: выберите область новообразования кнопками рядом">
          <path d="M120 22c-43 0-69 31-67 77 1 44 21 100 67 119 46-19 66-75 67-119 2-46-24-77-67-77Z" fill="#fef3e8" stroke="#134e4a" strokeWidth="2" />
          <path d="M86 101c11-8 21-8 31 0M123 101c11-8 21-8 31 0M120 105v35l-9 8h18M102 160c10 7 26 7 36 0" fill="none" stroke="#5f4632" strokeLinecap="round" strokeWidth="2" />
          {mapPoints.map(({ location, x, y }) => <circle key={location} cx={x} cy={y} r={value === location ? 10 : 6} fill={value === location ? '#0f766e' : '#99f6e4'} stroke="#134e4a" strokeWidth="2" />)}
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(FACE_LOCATION_LABELS).map(([location, label]) => {
          const selected = value === location
          return <button key={location} type="button" aria-pressed={selected} onClick={() => onChange(location as FaceLocation)} className={`min-h-11 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors ${selected ? 'border-teal-700 bg-teal-700 text-white' : 'border-teal-950/10 bg-background hover:border-teal-700/50 hover:bg-teal-50'}`}>{label}</button>
        })}
      </div>
    </div>
  )
}
