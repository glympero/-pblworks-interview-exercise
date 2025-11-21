import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditProjectWrapper } from './EditProjectWrapper'
import { updateProject } from '@/app/projects/[projectId]/actions/update-project'
import { Project } from '@prisma/client'

jest.mock('@/app/projects/[projectId]/actions/update-project')
jest.mock('../AutosaveBoundary/AutosaveBoundary', () => ({
  AutosaveBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))
jest.mock('../EditProjectForm/EditProjectForm', () => ({
  EditProjectForm: ({ formData, onChange, saveStatus }: any) => (
    <div>
      <input
        data-testid="title-input"
        value={formData.title}
        onChange={(e) => onChange('title', e.target.value)}
      />
      <input
        data-testid="subhead-input"
        value={formData.subhead}
        onChange={(e) => onChange('subhead', e.target.value)}
      />
      <textarea
        data-testid="description-input"
        value={formData.description}
        onChange={(e) => onChange('description', e.target.value)}
      />
      <div data-testid="save-status">{saveStatus}</div>
    </div>
  ),
}))

describe('EditProjectWrapper', () => {
  let mockProject: Project
  const mockUpdateProject = updateProject as jest.MockedFunction<
    typeof updateProject
  >

  beforeEach(() => {
    jest.clearAllMocks()

    mockProject = {
      id: 1,
      title: 'Test Project',
      subhead: 'Test Subhead',
      description: 'Test Description',
    }

    mockUpdateProject.mockResolvedValue(mockProject)
  })

  it('should render with initial project data', () => {
    render(<EditProjectWrapper project={mockProject} />)

    expect(screen.getByTestId('title-input')).toHaveValue('Test Project')
    expect(screen.getByTestId('subhead-input')).toHaveValue('Test Subhead')
    expect(screen.getByTestId('description-input')).toHaveValue(
      'Test Description'
    )
  })

  it('should initialize with idle save status', () => {
    render(<EditProjectWrapper project={mockProject} />)

    expect(screen.getByTestId('save-status')).toHaveTextContent('idle')
  })

  it('should handle null values in project data', () => {
    const projectWithNulls = {
      ...mockProject,
      title: null,
      subhead: null,
      description: null,
    } as unknown as Project

    render(<EditProjectWrapper project={projectWithNulls} />)

    expect(screen.getByTestId('title-input')).toHaveValue('')
    expect(screen.getByTestId('subhead-input')).toHaveValue('')
    expect(screen.getByTestId('description-input')).toHaveValue('')
  })

  it('should update form data when user types', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')
    await user.clear(titleInput)
    await user.type(titleInput, 'New Title')

    expect(titleInput).toHaveValue('New Title')
  })

  it('should set status to saving when user types', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')
    await user.type(titleInput, 'x')

    expect(screen.getByTestId('save-status')).toHaveTextContent('saving')
  })

  it('should debounce save calls', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')

    await user.type(titleInput, 'abc')

    expect(mockUpdateProject).not.toHaveBeenCalled()

    await waitFor(
      () => {
        expect(mockUpdateProject).toHaveBeenCalledTimes(1)
      },
      { timeout: 1000 }
    )
  })

  it('should call updateProject with correct data after debounce', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Title')

    await waitFor(
      () => {
        expect(mockUpdateProject).toHaveBeenCalledWith(1, {
          title: 'Updated Title',
          subhead: 'Test Subhead',
          description: 'Test Description',
        })
      },
      { timeout: 1000 }
    )
  })

  it('should set status to saved after successful save', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')
    await user.type(titleInput, 'x')

    await waitFor(
      () => {
        expect(screen.getByTestId('save-status')).toHaveTextContent('saved')
      },
      { timeout: 1000 }
    )
  })

  it('should reset to saving status when typing after save completes', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')

    // First change
    await user.type(titleInput, 'x')

    await waitFor(
      () => {
        expect(screen.getByTestId('save-status')).toHaveTextContent('saved')
      },
      { timeout: 1000 }
    )

    await user.type(titleInput, 'y')

    expect(screen.getByTestId('save-status')).toHaveTextContent('saving')
  })

  it('should handle changes to all fields', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    await user.type(screen.getByTestId('title-input'), 'New')
    await user.type(screen.getByTestId('subhead-input'), 'Sub')
    await user.type(screen.getByTestId('description-input'), 'Desc')

    await waitFor(
      () => {
        expect(mockUpdateProject).toHaveBeenCalledWith(1, {
          title: 'Test ProjectNew',
          subhead: 'Test SubheadSub',
          description: 'Test DescriptionDesc',
        })
      },
      { timeout: 1000 }
    )
  })

  it('should only call updateProject once for rapid changes within debounce window', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')

    await user.type(titleInput, 'abc')

    await waitFor(
      () => {
        expect(mockUpdateProject).toHaveBeenCalledTimes(1)
      },
      { timeout: 1000 }
    )
  })

  it('should handle multiple rapid typing sessions', async () => {
    const user = userEvent.setup()
    render(<EditProjectWrapper project={mockProject} />)

    const titleInput = screen.getByTestId('title-input')

    await user.type(titleInput, 'a')

    await new Promise((resolve) => setTimeout(resolve, 300))

    await user.type(titleInput, 'b')

    await waitFor(
      () => {
        expect(mockUpdateProject).toHaveBeenCalledTimes(1)
      },
      { timeout: 1000 }
    )
  })
})
