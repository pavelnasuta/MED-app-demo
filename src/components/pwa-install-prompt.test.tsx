import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PwaInstallPrompt } from './pwa-install-prompt'

function setNavigatorProperty(name: string, value: unknown) {
  Object.defineProperty(navigator, name, { configurable: true, value })
}

type DeferredInstallEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

describe('PwaInstallPrompt', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setNavigatorProperty('userAgent', 'Mozilla/5.0 (Linux; Android 14) Chrome/120')
    setNavigatorProperty('standalone', undefined)
  })

  afterEach(cleanup)

  it('offers the browser installation flow when it becomes available', async () => {
    const prompt = vi.fn().mockResolvedValue(undefined)
    const event = Object.assign(new Event('beforeinstallprompt'), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' as const }),
    }) as DeferredInstallEvent
    const user = userEvent.setup()
    render(<PwaInstallPrompt />)

    window.dispatchEvent(event)

    await user.click(await screen.findByRole('button', { name: 'Установить' }))
    expect(prompt).toHaveBeenCalledOnce()
  })

  it('explains installation on iPhone when the app is not standalone', async () => {
    setNavigatorProperty('userAgent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15')
    render(<PwaInstallPrompt />)
    window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' as const }),
    }) as DeferredInstallEvent)

    expect(await screen.findByRole('status', { name: 'Установка приложения' })).toHaveTextContent('Поделиться')
    expect(screen.getByText(/На экран.*Домой/)).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Установить' })).not.toBeInTheDocument()
  })

  it('does not show again after the visitor chooses later', async () => {
    setNavigatorProperty('userAgent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15')
    const user = userEvent.setup()
    const first = render(<PwaInstallPrompt />)

    await user.click(screen.getByRole('button', { name: 'Понятно' }))
    first.unmount()
    render(<PwaInstallPrompt />)

    expect(screen.queryByRole('status', { name: 'Установка приложения' })).not.toBeInTheDocument()
  })
})
