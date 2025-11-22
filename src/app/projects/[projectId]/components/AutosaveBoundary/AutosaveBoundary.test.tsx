import { render } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { AutosaveBoundary } from './AutosaveBoundary'
import { DebouncedState } from 'use-debounce'
import { ProjectFormData } from '../../schemas'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

describe('AutosaveBoundary', () => {
  let mockFlush: jest.Mock
  let mockDebouncedSave: DebouncedState<
    (data: ProjectFormData) => Promise<void>
  >

  beforeEach(() => {
    ;(usePathname as jest.Mock).mockReturnValue('/projects/123')

    mockFlush = jest.fn()

    mockDebouncedSave = {
      flush: mockFlush,
      cancel: jest.fn(),
      isPending: jest.fn(() => false),
    } as unknown as DebouncedState<(data: ProjectFormData) => Promise<void>>

    jest.spyOn(window, 'dispatchEvent')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render children', () => {
    const { getByText } = render(
      <AutosaveBoundary debouncedSave={mockDebouncedSave}>
        <div>Test Child</div>
      </AutosaveBoundary>
    )

    expect(getByText('Test Child')).toBeInTheDocument()
  })

  it('should dispatch register-flush event on mount with flush callback', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')

    render(
      <AutosaveBoundary debouncedSave={mockDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'register-flush',
      })
    )

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent
    expect(event.detail).toBe(mockFlush)
  })

  it('should dispatch register-flush event with null on unmount', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')

    const { unmount } = render(
      <AutosaveBoundary debouncedSave={mockDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    dispatchSpy.mockClear()

    unmount()

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'register-flush',
      })
    )

    const event = dispatchSpy.mock.calls[0][0] as CustomEvent
    expect(event.detail).toBeNull()
  })

  it('should call flush on unmount', () => {
    const { unmount } = render(
      <AutosaveBoundary debouncedSave={mockDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    expect(mockFlush).not.toHaveBeenCalled()

    unmount()

    expect(mockFlush).toHaveBeenCalledTimes(1)
  })

  it('should re-register flush callback when debouncedSave changes', () => {
    const newMockFlush = jest.fn()
    const newDebouncedSave = {
      flush: newMockFlush,
      cancel: jest.fn(),
      isPending: jest.fn(() => false),
    } as unknown as DebouncedState<(data: ProjectFormData) => Promise<void>>

    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')

    const { rerender } = render(
      <AutosaveBoundary debouncedSave={mockDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    dispatchSpy.mockClear()

    rerender(
      <AutosaveBoundary debouncedSave={newDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    expect(dispatchSpy).toHaveBeenCalledTimes(2)

    const events = dispatchSpy.mock.calls.map((call) => call[0] as CustomEvent)

    expect(events[0].type).toBe('register-flush')
    expect(events[0].detail).toBeNull()

    expect(events[1].type).toBe('register-flush')
    expect(events[1].detail).toBe(newMockFlush)
  })

  it('should call old flush before registering new one when debouncedSave changes', () => {
    const newMockFlush = jest.fn()
    const newDebouncedSave = {
      flush: newMockFlush,
      cancel: jest.fn(),
      isPending: jest.fn(() => false),
    } as unknown as DebouncedState<(data: ProjectFormData) => Promise<void>>

    const { rerender } = render(
      <AutosaveBoundary debouncedSave={mockDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    expect(mockFlush).not.toHaveBeenCalled()

    rerender(
      <AutosaveBoundary debouncedSave={newDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    expect(mockFlush).toHaveBeenCalledTimes(1)
  })

  it('should dispatch events in correct order during lifecycle', () => {
    const dispatchSpy = jest.spyOn(window, 'dispatchEvent')

    const { unmount } = render(
      <AutosaveBoundary debouncedSave={mockDebouncedSave}>
        <div>Test</div>
      </AutosaveBoundary>
    )

    expect(dispatchSpy).toHaveBeenCalledTimes(1)
    const mountEvent = dispatchSpy.mock.calls[0][0] as CustomEvent
    expect(mountEvent.type).toBe('register-flush')
    expect(mountEvent.detail).toBe(mockFlush)

    dispatchSpy.mockClear()

    unmount()

    expect(dispatchSpy).toHaveBeenCalledTimes(1)
    const unmountEvent = dispatchSpy.mock.calls[0][0] as CustomEvent
    expect(unmountEvent.type).toBe('register-flush')
    expect(unmountEvent.detail).toBeNull()
  })
})
