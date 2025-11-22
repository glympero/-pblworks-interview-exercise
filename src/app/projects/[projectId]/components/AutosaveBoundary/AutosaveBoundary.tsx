'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DebouncedState } from 'use-debounce'
import { ProjectFormData } from '../../schemas'

interface AutosaveBoundaryProps {
  debouncedSave: DebouncedState<(data: ProjectFormData) => Promise<void>>
  children: React.ReactNode
}

export function AutosaveBoundary({
  debouncedSave,
  children,
}: AutosaveBoundaryProps) {
  const pathname = usePathname()

  useEffect(() => {
    const event = new CustomEvent('register-flush', {
      detail: debouncedSave.flush,
    })
    window.dispatchEvent(event)

    return () => {
      const event = new CustomEvent('register-flush', {
        detail: null,
      })
      window.dispatchEvent(event)
    }
  }, [debouncedSave])

  useEffect(() => {
    return () => {
      debouncedSave.flush()
    }
  }, [debouncedSave])

  return <>{children}</>
}
