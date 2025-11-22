import { render, screen } from '@testing-library/react'
import NotFound from './not-found'

describe('NotFound Component', () => {
  it('renders the 404 heading properly', () => {
    render(<NotFound />)
    expect(
      screen.getByRole('heading', { level: 1, name: /404/i })
    ).toBeInTheDocument()
  })

  it('renders the main content area', () => {
    render(<NotFound />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getByText(/this page could not be found/i)
    ).toBeInTheDocument()
  })
})
