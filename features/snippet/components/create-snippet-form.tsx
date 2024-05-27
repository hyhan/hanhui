'use client'

import { useForm } from 'react-hook-form'
import { useCreateSnippet } from '../api'
import { CreateSnippetDTO, createSnippetSchema } from '../types'
import { useRouter } from 'next/navigation'
import { useGetAllTags } from '@/features/tag/api'
import { TagTypeEnum } from '@prisma/client'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { LoaderCircleIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toSlug } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Combobox } from '@/components/ui/combobox'
import { CreateTagButton } from '@/features/tag/components'

export const CreateSnippetForm = () => {
  const router = useRouter()

  const getTagsQuery = useGetAllTags(TagTypeEnum.ALL)
  const tags = React.useMemo(() => {
    return getTagsQuery.data?.tags ?? []
  }, [getTagsQuery])

  const createSnippetQuery = useCreateSnippet()
  const form = useForm<CreateSnippetDTO>({
    resolver: zodResolver(createSnippetSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      published: true,
      body: '',
      tags: [],
    },
  })

  return (
    <Form {...form}>
      <form autoComplete="off">
        <div className="fixed z-10 bottom-10 left-24 right-24 md:left-[20vw] md:right-[20vw]">
          <Button>
            {createSnippetQuery.loading && (
              <LoaderCircleIcon className="mr-2 animate-spin" size={16}></LoaderCircleIcon>
            )}
            创建
          </Button>
        </div>
        <div className="grid gap-4 pb-24 px-1">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入标题"></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="slug"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="flex items-center w-full gap-4">
                    <Input {...field} placeholder="请输入slug"></Input>
                    <Button type="button" onClick={handleFormatSlug}>
                      格式化
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="请输入描述"></Textarea>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="published"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>是否发布</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange}></Switch>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="tags"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>标签</FormLabel>
                <FormControl>
                  <div className='grid grid-cols-12 gap-4 items-center'>
                    <div className="col-span-10">
                      <Combobox 
                        options={
                          tags ? tags?.map(el => ({
                            label: el.name,
                            value: el.id
                          })) : []
                        }
                        multiple
                        clearable
                        selectPlaceholder='请选择标签'
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </div>
                    <CreateTagButton refreshAsync={getTagsQuery.runAsync} />
                  </div>
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )

  function handleFormatSlug() {
    const tmp = form.getValues().slug?.trim()
    if (tmp) {
      const formatted = toSlug(tmp)
      form.setValue('slug', formatted)
    }
  }
}
