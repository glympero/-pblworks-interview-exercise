'use client'

import { updateProject } from '@/app/projects/[projectId]/actions/update-project'
import { LoadingButton } from '@mui/lab'
import {
  FormControl,
  Grid,
  Input,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Project } from '@prisma/client'
import { useState } from 'react'

export const EditProjectForm = ({ project }: { project: Project }) => {
  const [title, setTitle] = useState(project.title)
  const [subhead, setSubhead] = useState(project.subhead)
  const [description, setDescription] = useState(project.description)
  const [isLoading, setIsLoading] = useState(false)

  const onSave = async () => {
    setIsLoading(true)
    try {
      await updateProject({
        id: project.id,
        title,
        subhead,
        description,
      })
    } catch (error: unknown) {
      console.error('Error while trying to update project', {
        project: { id: project.id, title, description, subhead },
        error,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} md={5} lg={4}>
          <TextField
            fullWidth
            label="Project Title"
            value={title}
            placeholder="Enter the project title, eg. 'Power of the punch'"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <TextField
            fullWidth
            label="Project Subhead"
            value={subhead}
            placeholder="Use a small sentence to describe the project, eg. 'Students will learn Newtons Laws while constructing a boxing glove'"
            onChange={(event) => setSubhead(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Project Descripton"
            value={description}
            placeholder="Describe the project in detail (suggested length: 300 words)"
            onChange={(event) => setDescription(event.target.value)}
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      <LoadingButton loading={isLoading} onClick={onSave} variant="contained">
        Update Project
      </LoadingButton>
    </Paper>
  )
}
