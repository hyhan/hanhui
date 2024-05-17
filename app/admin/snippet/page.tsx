
import { type Metadata } from 'next'
import { AdminSnippetListPage } from '@/features/snippet/admin-snippet-list-page'

export const metadata: Metadata = {
  title: 'Admin snippet',
}

export default function Page() {
  return <AdminSnippetListPage></AdminSnippetListPage>
}
