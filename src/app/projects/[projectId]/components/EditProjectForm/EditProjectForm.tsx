'use client'

import { Project } from '@prisma/client'
import { ProjectFormData } from '../EditProjectWrapper/EditProjectWrapper'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SyncIcon from '@mui/icons-material/Sync'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'

interface EditProjectFormProps {
  project: Project
  formData: ProjectFormData
  onChange: (field: keyof ProjectFormData, value: string) => void
  saveStatus: 'idle' | 'saving' | 'saved'
}

export function EditProjectForm({
  project,
  formData,
  onChange,
  saveStatus,
}: EditProjectFormProps) {
  return (
    <Paper sx={{ padding: 2, position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ position: 'relative', width: 80, height: 20 }}>
          <Fade in={saveStatus === 'saving'} unmountOnExit>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 0.5,
                color: 'text.secondary',
              }}
            >
              <SyncIcon
                sx={{
                  fontSize: 16,
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              />
              <Typography variant="caption">Saving...</Typography>
            </Box>
          </Fade>

          <Fade in={saveStatus === 'saved'} unmountOnExit>
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 0.5,
                color: 'success.main',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">Saved</Typography>
            </Box>
          </Fade>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={5} lg={4}>
          <TextField
            fullWidth
            label="Project Title"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <TextField
            fullWidth
            label="Project Subhead"
            value={formData.subhead}
            onChange={(e) => onChange('subhead', e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Project Description"
            value={formData.description}
            multiline
            rows={4}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
