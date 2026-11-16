import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

import { PwaInstallPrompt } from '../components/pwa-install-prompt'
import { PwaUpdateNotice } from '../components/pwa-update-notice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { SkinCheckStartPage } from '../features/skincheck/SkinCheckStartPage'
import { usePreferencesStore } from '../stores/preferences-store'
import { AppShell } from './layouts/AppShell'
import { appRoutes, type RouteName } from './routes'

function routeFromHash(): RouteName { const route = window.location.hash.slice(1); return appRoutes.find((candidate) => candidate.name === route)?.name ?? 'home' }

function useAppliedTheme() {
  const theme = usePreferencesStore((state) => state.theme)
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)')
    const applyTheme = () => { const isDark = theme === 'dark' || (theme === 'system' && media?.matches); document.documentElement.classList.toggle('dark', Boolean(isDark)); document.documentElement.dataset.theme = theme; document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#082f2a' : '#f0fdfa') }
    applyTheme()
    if (theme !== 'system' || !media) return undefined
    media.addEventListener?.('change', applyTheme)
    return () => media.removeEventListener?.('change', applyTheme)
  }, [theme])
}

function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  useEffect(() => { const updateStatus = () => setIsOnline(navigator.onLine); window.addEventListener('online', updateStatus); window.addEventListener('offline', updateStatus); return () => { window.removeEventListener('online', updateStatus); window.removeEventListener('offline', updateStatus) } }, [])
  return isOnline ? null : <p className="border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-sm text-foreground" role="status" aria-label="Подключение к интернету">Нет подключения к интернету. Основные функции доступны на этом устройстве.</p>
}

function NextStagePage({ title, description }: { title: string; description: string }) {
  return <section className="mx-auto max-w-2xl space-y-5"><div><p className="text-sm font-medium text-teal-700">SkinCheck развивается по этапам</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1></div><Card><CardHeader><CardTitle>Скоро здесь появится рабочий экран</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className="text-sm leading-6 text-muted-foreground">На первом этапе готовы оболочка SkinCheck и проверяемая логика подсчёта. Следующим этапом добавим первый экран опроса и выбор зоны на лице.</CardContent></Card></section>
}

export function App() {
  const [activeRoute, setActiveRoute] = useState<RouteName>(routeFromHash)
  useAppliedTheme()
  useEffect(() => { const syncRoute = () => setActiveRoute(routeFromHash()); window.addEventListener('hashchange', syncRoute); return () => window.removeEventListener('hashchange', syncRoute) }, [])
  const navigate = (route: RouteName) => { window.location.hash = route; setActiveRoute(route) }
  const page = activeRoute === 'check' ? <NextStagePage title="Проверка новообразования" description="Последовательный опрос появится на следующем этапе." /> : activeRoute === 'history' ? <NextStagePage title="История проверок" description="Локальное сохранение результатов появится на четвёртом этапе." /> : activeRoute === 'methods' ? <NextStagePage title="О методиках" description="Краткий справочник ABCDE, 7-point checklist и ограничений появится на четвёртом этапе." /> : <SkinCheckStartPage onStart={() => navigate('check')} onShowHistory={() => navigate('history')} onShowMethods={() => navigate('methods')} />
  return <><OfflineStatus /><PwaInstallPrompt /><AppShell activeRoute={activeRoute} onNavigate={navigate}>{page}</AppShell><PwaUpdateNotice /><Toaster richColors position="top-center" closeButton /></>
}
