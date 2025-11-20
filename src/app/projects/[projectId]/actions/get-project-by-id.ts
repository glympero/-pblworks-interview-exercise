'use server'

import { prisma } from '@/prisma/prisma'
import { ProjectIdSchema } from '../schemas'

export async function getProjectById(rawId: string) {
  const result = ProjectIdSchema.safeParse(rawId)

  if (!result.success) {
    throw new Error('Invalid project id')
  }
  const id = result.data

  const project = await prisma.project.findUnique({
    where: { id },
  })

  return project
}
