import { type Metadata } from 'next'
import { AdminTagListPage } from '@/features/tag/admin-tag-list-page'

export const metadata: Metadata = {
  title: 'Admin tag',
}

export default function Page() {
  return <AdminTagListPage></AdminTagListPage>
}
