import { render, screen } from '@testing-library/react'
import ProjectHeaderPage from '@/app/@header/projects/[projectId]/page'

import { getProjectById } from '@/app/projects/[projectId]/actions/get-project-by-id'

jest.mock('@/app/projects/[projectId]/actions/get-project-by-id')

jest.mock('@/app/components/layout/Header/Header', () => ({
  Header: ({ title }: { title: string }) => (
    <div data-testid="header">Title: {title}</div>
  ),
}))

describe('ProjectHeaderPage', () => {
  it('passes the project title to Header when project is found', async () => {
    ;(getProjectById as jest.Mock).mockResolvedValue({
      id: 1,
      title: 'Test Title',
    })

    const jsx = await ProjectHeaderPage({ params: { projectId: '1' } })
    render(jsx)

    expect(screen.getByTestId('header')).toHaveTextContent('Title: Test Title')
  })

  it('passes "Untitled Project" if project has no title', async () => {
    ;(getProjectById as jest.Mock).mockResolvedValue({ id: 1, title: null })

    const jsx = await ProjectHeaderPage({ params: { projectId: '1' } })
    render(jsx)

    expect(screen.getByTestId('header')).toHaveTextContent(
      'Title: Untitled Project'
    )
  })

  it('handles errors gracefully by rendering empty title (or default)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(getProjectById as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

    const jsx = await ProjectHeaderPage({ params: { projectId: '999' } })
    render(jsx)

    expect(screen.getByTestId('header')).toHaveTextContent('Title:')
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
