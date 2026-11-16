import { ArrowRight, BookOpenCheck, Clock3, ShieldCheck } from 'lucide-react'

import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'

export function SkinCheckStartPage({ onStart, onShowHistory, onShowMethods }: { onStart: () => void; onShowHistory: () => void; onShowMethods: () => void }) {
  return (
    <section className="mx-auto max-w-3xl space-y-6 pb-8" aria-labelledby="skincheck-title">
      <div className="rounded-[2rem] border border-teal-950/10 bg-[linear-gradient(135deg,#ecfdf5_0%,#f0fdfa_48%,#f8fafc_100%)] p-6 shadow-sm sm:p-9">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-900 px-3 py-1.5 text-xs font-semibold tracking-wide text-white"><ShieldCheck className="h-4 w-4" aria-hidden="true" />SkinCheck · учебный прототип</p>
        <h1 id="skincheck-title" className="max-w-xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">Проверьте признаки — подготовьтесь к очному осмотру.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">Предварительная оценка признаков новообразований кожи лица на основе ваших ответов. Без фотографий, искусственного интеллекта и диагнозов.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg" onClick={onStart}>Начать проверку <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          <Button type="button" size="lg" variant="outline" onClick={onShowHistory}><Clock3 className="h-4 w-4" aria-hidden="true" />История проверок</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-teal-950/10 bg-card/90"><CardHeader><CardTitle className="text-base">3–5 минут</CardTitle><CardDescription>Короткие вопросы, преимущественно с готовыми вариантами.</CardDescription></CardHeader></Card>
        <Card className="border-teal-950/10 bg-card/90"><CardHeader><CardTitle className="text-base">На устройстве</CardTitle><CardDescription>История появится в следующем этапе и останется в браузере.</CardDescription></CardHeader></Card>
        <Card className="border-teal-950/10 bg-card/90"><CardHeader><CardTitle className="text-base">Понятно</CardTitle><CardDescription>Показываем критерии и объясняем, какие ответы на них повлияли.</CardDescription></CardHeader></Card>
      </div>

      <Card className="border-amber-300/70 bg-amber-50/70">
        <CardContent className="pt-6 text-sm leading-6 text-slate-700"><strong className="font-semibold text-slate-950">Важно:</strong> результат носит предварительный ознакомительный характер. Приложение не ставит диагноз и не заменяет консультацию врача.</CardContent>
      </Card>

      <button type="button" onClick={onShowMethods} className="inline-flex min-h-11 items-center gap-2 rounded-md px-1 text-sm font-medium text-teal-800 underline-offset-4 hover:underline"><BookOpenCheck className="h-4 w-4" aria-hidden="true" />О методиках и ограничениях</button>
    </section>
  )
}
