import { useRequest } from 'ahooks'

import { showErrorToast, showSuccessToast } from '@/components/ui/toast'

import { createTag, deleteTagByID, getAllTags, getTagByID, getTags, updateTag } from './actions'
import { TagTypeEnum } from '@prisma/client'
import { GetTagsDTO } from './types'

export const useGetTags = (params: GetTagsDTO) => {
  return useRequest(() => getTags(params), {
    refreshDeps: [params],
    loadingDelay: 300,
  })
}

export const useGetAllTags = (type?: TagTypeEnum) => {
  return useRequest(() => getAllTags(type))
}

export const useGetTag = (id: string, ready: boolean) => {
  return useRequest(() => getTagByID(id), {
    ready,
    loadingDelay: 300,
  })
}

export const useCreateTag = () => {
  return useRequest(createTag, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('标签已创建')
    },
    onError(error) {
      showErrorToast(`标签创建失败: ${error.message}`)
    },
  })
}

export const useUpdateTag = () => {
  return useRequest(updateTag, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('标签已更新')
    },
    onError(error) {
      showErrorToast(`标签更新失败: ${error.message}`)
    },
  })
}

export const useDeleteTag = () => {
  return useRequest(deleteTagByID, {
    manual: true,
    onSuccess() {
      showSuccessToast('标签已删除')
    },
    onError(error) {
      showErrorToast(`标签删除失败: ${error.message}`)
    },
  })
}
