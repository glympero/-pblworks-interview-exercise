import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function NotFound() {
  return (
    <>
      <Box component="main" sx={{ textAlign: 'center', mt: 10, p: 3 }}>
        <Typography variant="h1" sx={{ fontSize: '4rem', fontWeight: 700 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          This page could not be found.
        </Typography>
      </Box>
    </>
  )
}
