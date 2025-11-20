import Link from 'next/link'
import Image from 'next/image'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { UserMenu } from '../UserMenu/UserMenu'

type HeaderProps = { title?: string | null }

export function Header({ title }: HeaderProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ backgroundColor: '#ffffff', color: '#000' }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link
            href="/projects"
            aria-label="Go to projects"
            style={{ display: 'block' }}
          >
            <Image
              src="/design-logo.svg"
              alt="PBLWorks Design"
              width={120}
              height={32}
              priority
              style={{ display: 'block' }}
            />
          </Link>
        </Box>

        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          {title ? (
            <Typography
              variant="h6"
              noWrap
              sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
            >
              {title}
            </Typography>
          ) : null}
        </Box>

        <UserMenu initials="GL" />
      </Toolbar>
    </AppBar>
  )
}
