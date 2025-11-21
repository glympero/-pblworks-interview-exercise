'use client'

import { Project } from '@prisma/client'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect } from 'react'
import { updateProject } from '@/app/projects/[projectId]/actions/update-project'
import { AutosaveBoundary } from '../AutosaveBoundary/AutosaveBoundary'
import { EditProjectForm } from '../EditProjectForm/EditProjectForm'

export interface ProjectFormData {
  title: string
  subhead: string
  description: string
}

interface WrapperProps {
  project: Project
}

export function EditProjectWrapper({ project }: WrapperProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: project.title ?? '',
    subhead: project.subhead ?? '',
    description: project.description ?? '',
  })

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>(
    'idle'
  )

  const debouncedSave = useDebouncedCallback(async (data: ProjectFormData) => {
    await updateProject(project.id, data)
    setSaveStatus('saved')
  }, 700)

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)

    if (saveStatus !== 'saving') setSaveStatus('saving')
    if (saveStatus === 'saved') setSaveStatus('saving')

    debouncedSave(newData)
  }

  return (
    <AutosaveBoundary debouncedSave={debouncedSave}>
      <EditProjectForm
        project={project}
        formData={formData}
        onChange={handleChange}
        saveStatus={saveStatus}
      />
    </AutosaveBoundary>
  )
}
