'use client'

import React from 'react'

import { TagTypeEnum } from '@prisma/client'
import { type ColumnDef } from '@tanstack/react-table'
import { useSetState } from 'ahooks'
import { isUndefined } from 'lodash-es'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// import { PageHeader } from '@/components/page-header'

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  PATHS,
  PLACEHOLDER_TEXT,
  PUBLISHED_ENUM,
  PUBLISHED_LABEL_MAP,
} from '@/constants'
import { GetSnippetDTO, Snippet } from './types'
import { useGetSnippets } from './api'
import { cn, toSlashDateString } from '@/lib/utils'

import { ArrowDown10, ArrowUp01, EditIcon, PlusIcon, RefreshCcwIcon, SearchIcon } from 'lucide-react'
// import { DeleteTagButton } from './components'
import { IllustrationNoContent } from '@/components/illustrations'
import { AdminContentLayout } from '@/features/layout/admin-content-layout'
import { Highlight } from '@/components/highlight'
import { useRouter } from 'next/navigation'

export const AdminSnippetListPage = () => {
  const router = useRouter()
  const [params, updateParams] = useSetState<GetSnippetDTO>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    order: 'desc',
    orderBy: 'createdAt',
  })

  const [inputParams, updateInputParams] = useSetState<Omit<GetSnippetDTO, 'pageIndex' | 'pageSize'>>({
    title: undefined,
    tags: undefined,
    published: undefined,
  })

  const getSnippetsQuery = useGetSnippets(params)
  const data = React.useMemo(() => getSnippetsQuery.data?.snippets ?? [], [getSnippetsQuery])

  const columns: ColumnDef<Snippet>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: '标题',
      cell: ({ row }) => {
        return (
          <Highlight
            sourceString={row.original.title}
            searchWords={params.title ? [params.title] : undefined}
          />
        )
      },
    },
    {
      accessorKey: 'tags',
      header: '标签',
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-2">
            {row.original.tags.length ? row.original.tags.map((tag) => (
              <Badge key={tag.id}>
                {tag.name}
              </Badge>
            )) : PLACEHOLDER_TEXT}
          </div>
        )
      },
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            handleOrderChange('createdAt')
          }}
        >
          <span className="mx-1">创建时间</span>
          {params.order === 'asc' && params.orderBy == 'createdAt' && <ArrowUp01 size={20} />}
          {params.order === 'desc' && params.orderBy == 'createdAt' && <ArrowDown10 size={20} />}
        </Button>
      ),
      cell({ row }) {
        return toSlashDateString(row.original.createdAt)
      },
    },
    {
      accessorKey: 'updatedAt',
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            handleOrderChange('updatedAt')
          }}
        >
          <span className="mx-1">更新时间</span>
          {params.order === 'asc' && params.orderBy == 'updatedAt' && <ArrowUp01 size={20} />}
          {params.order === 'desc' && params.orderBy == 'updatedAt' && <ArrowDown10 size={20} />}
        </Button>
      ),
      cell({ row }) {
        return toSlashDateString(row.original.updatedAt)
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const record = row.original
        return (
          <div className="flex gap-2 items-center">
            <Button size={'icon'} variant="ghost" onClick={() => handleGoToEdit(record.id)}>
              <EditIcon size={20} />
            </Button>
            {/* <DeleteTagButton id={record.id} refreshAsync={getSnippetsQuery.refreshAsync} /> */}
          </div>
        )
      },
    },
  ]

  return (
    <AdminContentLayout>
      <div className="grid gap-4 grid-cols-4 py-4 px-2">
        <Input
          placeholder="请输入标题"
          value={inputParams.title}
          onChange={(v) =>
            updateInputParams({
              title: v.target.value,
            })
          }
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSearch()
            }
          }}
        />
        <Select
          onValueChange={(v: TagTypeEnum) =>
            updateInputParams({
              title: v,
            })
          }
          value={inputParams.title}
        >
          <SelectTrigger
            className={cn({
              'text-muted-foreground': isUndefined(inputParams.tags),
            })}
          >
            <SelectValue placeholder="请选择类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PUBLISHED_ENUM.ALL}>
              {PUBLISHED_LABEL_MAP[PUBLISHED_ENUM.ALL]}
            </SelectItem>
            <SelectItem value={PUBLISHED_ENUM.PUBLISHED}>
              {PUBLISHED_LABEL_MAP[PUBLISHED_ENUM.PUBLISHED]}
            </SelectItem>
            <SelectItem value={PUBLISHED_ENUM.NO_PUBLISHED}>
              {PUBLISHED_LABEL_MAP[PUBLISHED_ENUM.NO_PUBLISHED]}
            </SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-4">
          <Button onClick={handleSearch}>
            <SearchIcon className="mr-2" size={16} />
            搜索
          </Button>
          <Button onClick={handleReset}>
            <RefreshCcwIcon className="mr-2" size={16} />
            重置
          </Button>
          <Button onClick={handleGoToCreate}>
            <PlusIcon className="mr-2" size={16} />
            创建片段
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        total={getSnippetsQuery.data?.total}
        loading={getSnippetsQuery.loading}
        params={{ ...params }}
        updateParams={updateParams}
        noResult={
          <div className="grid place-content-center gap-4 py-16">
            <IllustrationNoContent />
            <p>暂无内容</p>
            <Button onClick={handleGoToCreate}>
              去创建
            </Button>
          </div>
        }
      />
    </AdminContentLayout>
  )

  function handleSearch() {
    updateParams({
      title: inputParams.title,
      tags: inputParams.tags,
      published: inputParams.published,
    })
  }

  function handleReset() {
    updateInputParams({
      title: '',
      tags: undefined,
      published: undefined,
    })
    updateParams({
      title: '',
      tags: undefined,
      published: undefined,
      pageIndex: DEFAULT_PAGE_INDEX,
      order: 'desc',
      orderBy: 'createdAt',
    })
  }

  function handleOrderChange(orderBy: GetSnippetDTO['orderBy']) {
    updateParams((prev) => {
      if (prev.orderBy !== orderBy) {
        return { orderBy: orderBy, order: 'asc' }
      } else {
        if (prev.order === 'desc') {
          return { orderBy: undefined, order: undefined }
        } else if (prev.order === 'asc') {
          return { order: 'desc' }
        } else {
          return { order: 'asc' }
        }
      }
    })
  }

  function handleGoToCreate() {
    router.push(PATHS.ADMIN_SNIPPET_CREATE)
  }

  function handleGoToEdit(id: string) {
    router.push(`${PATHS.ADMIN_SNIPPET_EDIT}/${id}`)
  }
}

