'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
import { useDeleteTag } from '../api'

type DeleteTagButtonProps = {
  id: string
  refreshAsync: () => Promise<unknown>
}

export const DeleteTagButton = ({ id, refreshAsync }: DeleteTagButtonProps) => {
  const [open, setOpen] = React.useState(false)
  const deleteTagQuery = useDeleteTag()

  const handleDelete = async () => {
    await deleteTagQuery.runAsync(id)
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
          <AlertDialogTitle>删除标签</AlertDialogTitle>
          <AlertDialogDescription>确定要删除该标签吗？</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={deleteTagQuery.loading}>
            取消
          </Button>
          <Button onClick={handleDelete} disabled={deleteTagQuery.loading}>
            {deleteTagQuery.loading && <Loader2Icon className="mr-2 text-base animate-spin" />}
            确定
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
