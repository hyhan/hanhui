import { Sidebar } from './slidebar'

export const Sidenav = () => {
  return <aside className="w-16 lg:w-[256px] transition-all h-screen flex-col flex items-center justify-center py-12 bg-foreground">
    <Sidebar></Sidebar>
  </aside>
}
