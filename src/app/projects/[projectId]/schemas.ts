import { z } from 'zod'

export const ProjectIdSchema = z.coerce.number().int().positive()
