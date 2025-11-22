import { render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditProjectForm } from './EditProjectForm'
import { Project } from '@prisma/client'
import { ProjectFormData } from '../EditProjectWrapper/EditProjectWrapper'

describe('EditProjectForm', () => {
  let mockProject: Project
  let mockFormData: ProjectFormData
  let mockOnChange: jest.Mock

  beforeEach(() => {
    mockProject = {
      id: 1,
      title: 'Test Project',
      subhead: 'Test Subhead',
      description: 'Test Description',
    }

    mockFormData = {
      title: 'Test Project',
      subhead: 'Test Subhead',
      description: 'Test Description',
    }

    mockOnChange = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all form fields with correct values', () => {
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      expect(screen.getByLabelText('Project Title')).toHaveValue('Test Project')
      expect(screen.getByLabelText('Project Subhead')).toHaveValue(
        'Test Subhead'
      )
      expect(screen.getByLabelText('Project Description')).toHaveValue(
        'Test Description'
      )
    })

    it('should render with empty values', () => {
      const emptyFormData: ProjectFormData = {
        title: '',
        subhead: '',
        description: '',
      }

      render(
        <EditProjectForm
          project={mockProject}
          formData={emptyFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      expect(screen.getByLabelText('Project Title')).toHaveValue('')
      expect(screen.getByLabelText('Project Subhead')).toHaveValue('')
      expect(screen.getByLabelText('Project Description')).toHaveValue('')
    })

    it('should render description field as multiline', () => {
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const descriptionField = screen.getByLabelText('Project Description')
      expect(descriptionField.tagName).toBe('TEXTAREA')
      expect(descriptionField).toHaveAttribute('rows', '4')
    })

    it('should render within a Paper component', () => {
      const { container } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const paper = container.querySelector('.MuiPaper-root')
      expect(paper).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onChange when title is changed', async () => {
      const user = userEvent.setup()
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const titleInput = screen.getByLabelText('Project Title')
      await user.type(titleInput, 'x')

      expect(mockOnChange).toHaveBeenCalledWith('title', 'Test Projectx')
    })

    it('should call onChange when subhead is changed', async () => {
      const user = userEvent.setup()
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const subheadInput = screen.getByLabelText('Project Subhead')
      await user.type(subheadInput, 'x')

      expect(mockOnChange).toHaveBeenCalledWith('subhead', 'Test Subheadx')
    })

    it('should call onChange when description is changed', async () => {
      const user = userEvent.setup()
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const descriptionInput = screen.getByLabelText('Project Description')
      await user.type(descriptionInput, 'x')

      expect(mockOnChange).toHaveBeenCalledWith(
        'description',
        'Test Descriptionx'
      )
    })

    it('should call onChange for each character typed', async () => {
      const user = userEvent.setup()
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const titleInput = screen.getByLabelText('Project Title')
      await user.type(titleInput, 'abc')

      expect(mockOnChange).toHaveBeenCalledTimes(3)

      expect(mockOnChange).toHaveBeenNthCalledWith(1, 'title', 'Test Projecta')
      expect(mockOnChange).toHaveBeenNthCalledWith(2, 'title', 'Test Projectb')
      expect(mockOnChange).toHaveBeenNthCalledWith(3, 'title', 'Test Projectc')
    })
  })

  describe('Save Status Indicator', () => {
    it('should not show status indicators when idle', () => {
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
      expect(screen.queryByText('Saved')).not.toBeInTheDocument()
    })

    it('should show saving indicator when status is saving', () => {
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="saving"
        />
      )

      expect(screen.getByText('Saving...')).toBeInTheDocument()
      expect(screen.queryByText('Saved')).not.toBeInTheDocument()
    })

    it('should show saved indicator when status is saved', () => {
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="saved"
        />
      )

      expect(screen.getByText('Saved')).toBeInTheDocument()
      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
    })

    it('should render SyncIcon when saving', () => {
      const { container } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="saving"
        />
      )

      const syncIcon = container.querySelector('[data-testid="SyncIcon"]')
      expect(syncIcon).toBeInTheDocument()
    })

    it('should render CheckCircleIcon when saved', () => {
      const { container } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="saved"
        />
      )

      const checkIcon = container.querySelector(
        '[data-testid="CheckCircleIcon"]'
      )
      expect(checkIcon).toBeInTheDocument()
    })

    it('should transition between save statuses correctly', async () => {
      const { rerender } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
      expect(screen.queryByText('Saved')).not.toBeInTheDocument()

      rerender(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="saving"
        />
      )

      expect(screen.getByText('Saving...')).toBeInTheDocument()

      rerender(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="saved"
        />
      )

      expect(screen.getByText('Saved')).toBeInTheDocument()

      await waitFor(
        () => {
          expect(screen.queryByText('Saving...')).not.toBeInTheDocument()
        },
        { timeout: 1000 }
      )
    })
  })

  describe('Form Updates', () => {
    it('should reflect updated formData prop', () => {
      const { rerender } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const updatedFormData: ProjectFormData = {
        title: 'Updated Title',
        subhead: 'Updated Subhead',
        description: 'Updated Description',
      }

      rerender(
        <EditProjectForm
          project={mockProject}
          formData={updatedFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      expect(screen.getByLabelText('Project Title')).toHaveValue(
        'Updated Title'
      )
      expect(screen.getByLabelText('Project Subhead')).toHaveValue(
        'Updated Subhead'
      )
      expect(screen.getByLabelText('Project Description')).toHaveValue(
        'Updated Description'
      )
    })
  })

  describe('Accessibility', () => {
    it('should have accessible labels for all inputs', () => {
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      expect(screen.getByLabelText('Project Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Project Subhead')).toBeInTheDocument()
      expect(screen.getByLabelText('Project Description')).toBeInTheDocument()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()
      render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const titleInput = screen.getByLabelText('Project Title')
      const subheadInput = screen.getByLabelText('Project Subhead')
      const descriptionInput = screen.getByLabelText('Project Description')

      await user.click(titleInput)
      expect(titleInput).toHaveFocus()

      await user.tab()
      expect(subheadInput).toHaveFocus()

      await user.tab()
      expect(descriptionInput).toHaveFocus()
    })

    it('should have fullWidth TextFields for better UX', () => {
      const { container } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const textFields = container.querySelectorAll('.MuiTextField-root')
      textFields.forEach((field) => {
        expect(field.classList.contains('MuiFormControl-fullWidth')).toBe(true)
      })
    })
  })

  describe('Layout', () => {
    it('should use Grid layout for responsive design', () => {
      const { container } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="idle"
        />
      )

      const gridContainer = container.querySelector('.MuiGrid-container')
      const gridItems = container.querySelectorAll('.MuiGrid-item')

      expect(gridContainer).toBeInTheDocument()
      expect(gridItems).toHaveLength(3)
    })

    it('should position save status indicator in top right', () => {
      const { container } = render(
        <EditProjectForm
          project={mockProject}
          formData={mockFormData}
          onChange={mockOnChange}
          saveStatus="saving"
        />
      )

      const paper = container.querySelector('.MuiPaper-root')
      const statusBox = within(paper as HTMLElement)
        .getByText('Saving...')
        .closest('div')

      expect(statusBox).toBeInTheDocument()
    })
  })
})
