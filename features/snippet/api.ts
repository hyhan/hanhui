import { useRequest } from 'ahooks'
import { createSnippet, deleteSnippetById, getSnippetByID, getSnippets, toggleSnippetPublished, updateSnippet } from './actions'
import { CreateSnippetDTO, GetSnippetDTO, UpdateSnippetDTO } from './types'
import { showErrorToast, showSuccessToast } from '@/components/ui/toast'

export const useGetSnippet = (id: string, ready: boolean) => {
  return useRequest(() => getSnippetByID(id), {
    ready,
    loadingDelay: 300
  })
}

export const useGetSnippets = (params: GetSnippetDTO) => {
  return useRequest(() => getSnippets(params), {
    refreshDeps: [params],
    loadingDelay: 300
  })
}

export const useCreateSnippet = () => {
  return useRequest(createSnippet, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('Snippet created')
    },
    onError(error) {
      showErrorToast(`Snippet creation failed: ${error.message}`)
    }
  })
}

export const useUpdateSnippet = () => {
  return useRequest(updateSnippet, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('Snippet updated')
    },
    onError(error) {
      showErrorToast(`Snippet update failed: ${error.message}`)
    }
  })
}
export const useUpdateSnippetPublished = () => {
  return useRequest(toggleSnippetPublished, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('Snippet updated')
    },
    onError(error) {
      showErrorToast(`Snippet update failed: ${error.message}`)
    }
  })
}

export const useDeleteSnippet = () => {
  return useRequest(deleteSnippetById, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('Snippet deleted')
    },
    onError(error) {
      showErrorToast(`Snippet deletion failed: ${error.message}`)
    }
  })
}
