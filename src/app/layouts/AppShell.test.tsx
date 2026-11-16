import { render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'

import { AppShell } from './AppShell'

it('renders a labelled mobile bottom navigation with every SkinCheck route', () => {
  render(
    <AppShell activeRoute="check" onNavigate={vi.fn()}>
      <p>Содержимое</p>
    </AppShell>,
  )

  const navigation = screen.getByRole('navigation', { name: 'Мобильная навигация' })

  expect(navigation).toHaveTextContent('Главная')
  expect(navigation).toHaveTextContent('Проверка')
  expect(navigation).toHaveTextContent('История')
  expect(navigation).toHaveTextContent('Методики')
  expect(screen.getAllByRole('link', { name: 'Проверка' }).some((link) => link.getAttribute('aria-current') === 'page')).toBe(true)
})
