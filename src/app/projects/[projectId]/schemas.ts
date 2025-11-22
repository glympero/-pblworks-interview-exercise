import { z } from 'zod'

export const ProjectIdSchema = z.coerce.number().int().positive()

export const ProjectFormSchema = z.object({
  title: z.string().optional().nullable(),
  subhead: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

export type ProjectFormData = z.infer<typeof ProjectFormSchema>
