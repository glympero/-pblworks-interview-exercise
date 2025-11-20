import { render, screen } from '@testing-library/react'
import Page from './page'

describe('Example Test', () => {
  it('renders some text', () => {
    render(<Page />)

    const content = screen.getByText('PBLWorks technical exercise')

    expect(content).toBeInTheDocument()
  })
})
