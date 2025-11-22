'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface GlobalNavigationHandlerProps {
  children: React.ReactNode
}

export function GlobalNavigationHandler({
  children,
}: GlobalNavigationHandlerProps) {
  const router = useRouter()
  const flushCallbackRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const handleFlushRegistration = (event: CustomEvent<() => void>) => {
      flushCallbackRef.current = event.detail
    }

    window.addEventListener(
      'register-flush',
      handleFlushRegistration as EventListener
    )

    return () => {
      window.removeEventListener(
        'register-flush',
        handleFlushRegistration as EventListener
      )
    }
  }, [])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')

      if (link && link.href) {
        if (flushCallbackRef.current) {
          flushCallbackRef.current()
        }
      }
    }

    document.addEventListener('click', handleClick, { capture: true })

    return () => {
      document.removeEventListener('click', handleClick, { capture: true })
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      if (flushCallbackRef.current) {
        flushCallbackRef.current()
      }

      setTimeout(() => {
        router.refresh()
      }, 0)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  return <>{children}</>
}
