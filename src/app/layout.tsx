import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'

export const metadata: Metadata = {
  title: 'PBLWorks Author',
}

export default function RootLayout({
  children,
  header,
}: Readonly<{
  children: React.ReactNode
  header: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {header}
            <Box component="main" sx={{ p: 2 }}>
              {children}
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
