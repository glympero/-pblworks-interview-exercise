'use server'

import { prisma } from '@/prisma/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ProjectFormSchema } from '../schemas'
import { Prisma } from '@prisma/client'

export const updateProject = async (
  id: number,
  data: z.infer<typeof ProjectFormSchema>
) => {
  const validated = ProjectFormSchema.parse(data)

  const updateData: Prisma.ProjectUpdateInput = {
    title: validated.title ?? '',
    subhead: validated.subhead ?? '',
    description: validated.description ?? '',
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: updateData,
  })

  revalidatePath('/projects')
  revalidatePath(`/projects/${id}`)

  return updatedProject
}
