import { render, screen } from '@testing-library/react'
import { Header } from './Header'

jest.mock('../UserMenu/UserMenu', () => ({
  UserMenu: () => <div data-testid="user-menu">UserMenu</div>,
}))

describe('Header Component', () => {
  it('renders the logo link', () => {
    render(<Header />)
    const link = screen.getByRole('link', { name: /go to projects/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/projects')
  })

  it('renders the title when provided', () => {
    render(<Header title="My Awesome Project" />)
    expect(screen.getByText('My Awesome Project')).toBeInTheDocument()
  })

  it('does not render a title when prop is missing', () => {
    render(<Header />)

    expect(screen.queryByText('My Awesome Project')).not.toBeInTheDocument()
  })

  it('renders the UserMenu', () => {
    render(<Header />)
    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
  })
})
