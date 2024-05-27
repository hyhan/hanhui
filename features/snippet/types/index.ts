import { PUBLISHED_ENUM, REGEX } from '@/constants'
import { z } from 'zod'
import { getSnippets } from '../actions'

export const createSnippetSchema = z.object({
  title: z.string().min(1, { message: '长度不能小于1' }),
  slug: z
    .string()
    .regex(REGEX.SLUG, { message: '只允许输入数字、小写字母和中横线' })
    .min(1, { message: '长度不能小于1' }),
  description: z.string().min(1, { message: '长度不能小于1' }),
  published: z.boolean().optional(),
  body: z.string().min(1, { message: '长度不能小于1' }),
  tags: z.string().array().optional(),
})

export const updateSnippetSchema = createSnippetSchema.partial().extend({
  id: z.string().min(1),
})

export const getSnippetSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  published: z.enum([
    PUBLISHED_ENUM.ALL,
    PUBLISHED_ENUM.NO_PUBLISHED,
    PUBLISHED_ENUM.PUBLISHED,
  ]).optional(),
  tags: z.string().array().optional(),
  pageIndex: z.number(),
  pageSize: z.number(),
  orderBy: z.enum(['createdAt', 'updatedAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
})

export type CreateSnippetDTO = z.infer<typeof createSnippetSchema>
export type UpdateSnippetDTO = z.infer<typeof updateSnippetSchema>
export type GetSnippetDTO = z.infer<typeof getSnippetSchema>

export type Snippet = Awaited<ReturnType<typeof getSnippets>>['snippets'][number]
