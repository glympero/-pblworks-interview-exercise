import { render, screen, fireEvent } from '@testing-library/react'
import { UserMenu } from './UserMenu'

describe('UserMenu Component', () => {
  it('renders the avatar with initials', () => {
    render(<UserMenu initials="JD" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('opens the menu when clicked', () => {
    render(<UserMenu initials="JD" />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    const button = screen.getByRole('button', { name: /open user menu/i })
    fireEvent.click(button)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()

    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes the menu when an item is clicked', () => {
    render(<UserMenu initials="JD" />)

    fireEvent.click(screen.getByRole('button', { name: /open user menu/i }))

    fireEvent.click(screen.getByText('Logout'))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
