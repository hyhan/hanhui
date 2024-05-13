import React from 'react'
import { AdminLayout } from '@/features/layout/admin-layout'

export default function Layout({ children }: React.PropsWithChildren) {
  return <AdminLayout>{children}</AdminLayout>
}
