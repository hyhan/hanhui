'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import React from 'react'
import { useDeleteSnippet } from '../api'

type DeleteTagButtonProps = {
  id: string
  refreshAsync: () => Promise<unknown>
}

export const DeleteTagButton = ({ id, refreshAsync }: DeleteTagButtonProps) => {
  const [open, setOpen] = React.useState(false)
  const deleteSnippetQuery = useDeleteSnippet()

  const handleDelete = async () => {
    await deleteSnippetQuery.runAsync(id)
    setOpen(false)
    await refreshAsync()
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={'icon'}
          variant="ghost"
          onClick={() => {
            setOpen(true)
          }}
        >
          <TrashIcon size={20} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除片段</AlertDialogTitle>
          <AlertDialogDescription>确定要删除该片段吗？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleteSnippetQuery.loading}>
            取消
          </Button>
          <Button onClick={handleDelete} disabled={deleteSnippetQuery.loading}>
            {deleteSnippetQuery.loading && <Loader2Icon className="mr-2 text-base animate-spin" />}
            确定
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
