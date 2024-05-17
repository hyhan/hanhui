'use server'

import { type Prisma } from '@prisma/client'
import {
  CreateSnippetDTO,
  GetSnippetDTO,
  UpdateSnippetDTO,
  createSnippetSchema,
  getSnippetSchema,
  updateSnippetSchema,
} from './types'
import { isUndefined } from 'lodash-es'
import { PUBLISHED_MAP } from '@/constants'
import { prisma } from '@/lib/prisma'
import { getSkip } from '@/utils'

const isSnippetExistByID = async (id: string) => {
  const isExist = await prisma.snippet.findUnique({
    where: { id },
  })
  return Boolean(isExist)
}

export const getSnippets = async (params: GetSnippetDTO) => {
  const result = await getSnippetSchema.safeParseAsync(params)

  if (!result.success) {
    const error = result.error.format()._errors?.join(';')
    throw new Error(error)
  }

  const cond: Prisma.SnippetWhereInput = {}
  if (!isUndefined(result.data.published)) {
    const searchPublished: boolean | undefined = PUBLISHED_MAP[result.data.published]
    if (!isUndefined(searchPublished)) {
      cond.published = searchPublished
    }
  }
  if (result.data.title?.trim()) {
    cond.OR = [
      ...(cond.OR || []),
      ...[
        {
          title: {
            contains: result.data.title?.trim(),
          },
        },
      ],
    ]
  }
  if (result.data.slug?.trim()) {
    cond.OR = [
      ...(cond.OR || []),
      ...[
        {
          slug: {
            contains: result.data.slug?.trim(),
          },
        },
      ],
    ]
  }
  if (result.data.tags?.length) {
    cond.OR = [
      ...(cond.OR || []),
      ...[
        {
          tags: {
            some: {
              id: {
                in: result.data.tags,
              },
            },
          },
        },
      ],
    ]
  }

  const sort: Prisma.SnippetOrderByWithRelationInput = {}
  if (result.data.orderBy && result.data.order) {
    sort[result.data.orderBy] = result.data.order
  }

  const total = await prisma.snippet.count({ where: cond })
  const snippets = await prisma.snippet.findMany({
    where: cond,
    orderBy: sort,
    take: result.data.pageSize,
    skip: getSkip(result.data.pageIndex, result.data.pageSize),
    include: {
      tags: true,
    },
  })
  return {
    total,
    snippets,
  }
}

export const getPublishedSnippets = async () => {
  const total = await prisma.snippet.count({})
  const snippets = await prisma.snippet.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      tags: true,
    },
    where: {
      published: true,
    },
  })

  return {
    total,
    snippets,
  }
}

export const getSnippetByID = async (id: string) => {
  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: {
      tags: true,
    },
  })
  return { snippet }
}

export const getSnippetBySlug = async (slug: string) => {
  const snippet = await prisma.snippet.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  })
  return { snippet }
}

export const deleteSnippetById = async (id: string) => {
  const isExist = await isSnippetExistByID(id)
  if (!isExist) {
    throw new Error('Snippet not found')
  }
  await prisma.snippet.delete({
    where: { id },
  })
}

export const createSnippet = async (params: CreateSnippetDTO) => {
  const result = await createSnippetSchema.safeParseAsync(params)
  if (!result.success) {
    const error = result.error.format()._errors?.join(';')
    throw new Error(error)
  }

  const snippets = await prisma.snippet.findMany({
    where: {
      OR: [{ title: result.data.title }, { slug: result.data.slug }],
    },
  })
  if (snippets.length) {
    throw new Error('Title or slug already exists')
  }
  await prisma.snippet.create({
    data: {
      title: result.data.title,
      slug: result.data.slug,
      description: result.data.description,
      published: result.data.published,
      body: result.data.body,
      tags: {
        connect: result.data.tags?.map((id) => ({ id })),
      },
    },
  })
}

export const toggleSnippetPublished = async (id: string) => {
  const snippet = await prisma.snippet.findUnique({
    where: { id },
  })
  if (!snippet) {
    throw new Error('Snippet not found')
  }
  await prisma.snippet.update({
    data: {
      published: !snippet.published,
    },
    where: {
      id,
    },
  })
}

export const updateSnippet = async (params: UpdateSnippetDTO) => {
  const result = await updateSnippetSchema.safeParseAsync(params)
  if (!result.success) {
    const error = result.error.format()._errors?.join(';')
    throw new Error(error)
  }
  const snippet = await prisma.snippet.findUnique({
    where: {
      id: result.data.id,
    },
    include: { tags: true },
  })
  if (!snippet) {
    throw new Error('Snippet not found')
  }
  const snippetTagIDs = snippet.tags.map((tag) => tag.id)
  const needConnect = result.data.tags?.filter(tag => !snippetTagIDs.includes(tag))
  const needDisconnect = snippetTagIDs.filter(tag => !result.data.tags?.includes(tag))

  await prisma.snippet.update({
    where: {id: result.data.id},
    data: {
      title: result.data.title,
      slug: result.data.slug,
      description: result.data.description,
      published: result.data.published,
      body: result.data.body,
      tags: {
        connect: needConnect?.map((id) => ({ id })),
        disconnect: needDisconnect?.map((id) => ({ id })),
      },
    }
  })
}
