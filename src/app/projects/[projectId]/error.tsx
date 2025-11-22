'use client'

import { Box, Typography } from '@mui/material'

export default function ProjectError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h5" color="error" gutterBottom>
        Something went wrong loading this project.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {error.message || 'An unexpected error occurred.'}
      </Typography>
    </Box>
  )
}
