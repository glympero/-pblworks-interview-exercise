import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { GlobalNavigationHandler } from './GlobalNavigationHandler'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('GlobalNavigationHandler', () => {
  let mockRouter: { refresh: jest.Mock }
  let mockFlushCallback: jest.Mock

  beforeEach(() => {
    mockRouter = {
      refresh: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    mockFlushCallback = jest.fn()

    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Rendering', () => {
    it('should render children', () => {
      render(
        <GlobalNavigationHandler>
          <div>Test Child</div>
        </GlobalNavigationHandler>
      )

      expect(screen.getByText('Test Child')).toBeInTheDocument()
    })

    it('should not modify children', () => {
      const { container } = render(
        <GlobalNavigationHandler>
          <div data-testid="child">
            <span>Nested content</span>
          </div>
        </GlobalNavigationHandler>
      )

      const child = screen.getByTestId('child')
      expect(child).toBeInTheDocument()
      expect(child.querySelector('span')).toHaveTextContent('Nested content')
    })
  })

  describe('Flush Registration', () => {
    it('should register flush callback on custom event', () => {
      render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      const event = new CustomEvent('register-flush', {
        detail: mockFlushCallback,
      })
      window.dispatchEvent(event)

      const link = document.createElement('a')
      link.href = 'https://example.com'
      document.body.appendChild(link)

      link.click()

      expect(mockFlushCallback).toHaveBeenCalledTimes(1)

      document.body.removeChild(link)
    })

    it('should unregister flush callback on null event', () => {
      render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      const registerEvent = new CustomEvent('register-flush', {
        detail: mockFlushCallback,
      })
      window.dispatchEvent(registerEvent)

      const unregisterEvent = new CustomEvent('register-flush', {
        detail: null,
      })
      window.dispatchEvent(unregisterEvent)

      const link = document.createElement('a')
      link.href = 'https://example.com'
      document.body.appendChild(link)

      link.click()

      expect(mockFlushCallback).not.toHaveBeenCalled()

      document.body.removeChild(link)
    })

    it('should replace flush callback when new one is registered', () => {
      render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      const firstCallback = jest.fn()
      const secondCallback = jest.fn()

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: firstCallback })
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: secondCallback })
      )

      const link = document.createElement('a')
      link.href = 'https://example.com'
      document.body.appendChild(link)

      link.click()

      expect(firstCallback).not.toHaveBeenCalled()
      expect(secondCallback).toHaveBeenCalledTimes(1)

      document.body.removeChild(link)
    })
  })

  describe('Link Click Handling', () => {
    it('should call flush callback when link is clicked', async () => {
      const user = userEvent.setup()

      render(
        <GlobalNavigationHandler>
          <a href="/test">Test Link</a>
        </GlobalNavigationHandler>
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: mockFlushCallback })
      )

      const link = screen.getByText('Test Link')
      await user.click(link)

      expect(mockFlushCallback).toHaveBeenCalledTimes(1)
    })

    it('should call flush callback when clicking element inside link', async () => {
      const user = userEvent.setup()

      render(
        <GlobalNavigationHandler>
          <a href="/test">
            <span>Nested Text</span>
          </a>
        </GlobalNavigationHandler>
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: mockFlushCallback })
      )

      const nestedElement = screen.getByText('Nested Text')
      await user.click(nestedElement)

      expect(mockFlushCallback).toHaveBeenCalledTimes(1)
    })

    it('should not call flush callback when clicking non-link elements', async () => {
      const user = userEvent.setup()

      render(
        <GlobalNavigationHandler>
          <div>
            <button>Not a link</button>
          </div>
        </GlobalNavigationHandler>
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: mockFlushCallback })
      )

      const button = screen.getByText('Not a link')
      await user.click(button)

      expect(mockFlushCallback).not.toHaveBeenCalled()
    })

    it('should not call flush if no callback is registered', async () => {
      const user = userEvent.setup()

      render(
        <GlobalNavigationHandler>
          <a href="/test">Test Link</a>
        </GlobalNavigationHandler>
      )

      const link = screen.getByText('Test Link')

      await expect(user.click(link)).resolves.not.toThrow()
    })

    it('should handle links without href attribute', async () => {
      const user = userEvent.setup()

      render(
        <GlobalNavigationHandler>
          <a>Link without href</a>
        </GlobalNavigationHandler>
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: mockFlushCallback })
      )

      const link = screen.getByText('Link without href')
      await user.click(link)

      expect(mockFlushCallback).not.toHaveBeenCalled()
    })
  })

  describe('Browser Back/Forward Navigation', () => {
    it('should call flush callback on popstate event', () => {
      render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: mockFlushCallback })
      )

      const popStateEvent = new PopStateEvent('popstate')
      window.dispatchEvent(popStateEvent)

      expect(mockFlushCallback).toHaveBeenCalledTimes(1)
    })

    it('should call router.refresh after popstate', async () => {
      jest.useFakeTimers()

      render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: mockFlushCallback })
      )

      const popStateEvent = new PopStateEvent('popstate')
      window.dispatchEvent(popStateEvent)

      jest.runAllTimers()

      expect(mockRouter.refresh).toHaveBeenCalledTimes(1)

      jest.useRealTimers()
    })

    it('should call router.refresh even if no flush callback is registered', async () => {
      jest.useFakeTimers()

      render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      const popStateEvent = new PopStateEvent('popstate')
      window.dispatchEvent(popStateEvent)

      jest.runAllTimers()

      expect(mockRouter.refresh).toHaveBeenCalledTimes(1)

      jest.useRealTimers()
    })

    it('should call flush before router.refresh on popstate', () => {
      jest.useFakeTimers()

      const callOrder: string[] = []
      const trackingFlush = jest.fn(() => callOrder.push('flush'))
      const trackingRefresh = jest.fn(() => callOrder.push('refresh'))

      mockRouter.refresh = trackingRefresh

      render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      window.dispatchEvent(
        new CustomEvent('register-flush', { detail: trackingFlush })
      )

      const popStateEvent = new PopStateEvent('popstate')
      window.dispatchEvent(popStateEvent)

      jest.runAllTimers()

      expect(callOrder).toEqual(['flush', 'refresh'])

      jest.useRealTimers()
    })
  })

  describe('Event Listener Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')

      const { unmount } = render(
        <GlobalNavigationHandler>
          <div>Test</div>
        </GlobalNavigationHandler>
      )

      const addedListeners = addEventListenerSpy.mock.calls.length

      unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledTimes(addedListeners)
    })
  })
})
