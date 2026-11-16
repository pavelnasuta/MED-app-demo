export type RouteName = 'home' | 'check' | 'history' | 'methods'

export type AppRoute = {
  name: RouteName
  label: string
}

export const appRoutes: AppRoute[] = [
  { name: 'home', label: 'Главная' },
  { name: 'check', label: 'Проверка' },
  { name: 'history', label: 'История' },
  { name: 'methods', label: 'Методики' },
]
