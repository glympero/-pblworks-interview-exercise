import { render, screen } from '@testing-library/react'
import ProjectError from './error'

describe('ProjectError Component', () => {
  it('renders the default error message', () => {
    const mockError = new Error('Custom error message')
    const mockReset = jest.fn()

    render(<ProjectError error={mockError} reset={mockReset} />)

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
  })

  it('renders a fallback message if error has no message', () => {
    const mockError = { name: 'Error', message: '' } as Error
    const mockReset = jest.fn()

    render(<ProjectError error={mockError} reset={mockReset} />)

    expect(
      screen.getByText('An unexpected error occurred.')
    ).toBeInTheDocument()
  })
})
