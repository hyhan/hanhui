'use client';

import React from 'react';
import { Sidenav } from './components/Sidenav';

// import { SessionProvider } from 'next-auth/react';


export const AdminLayout = ({ children }: React.PropsWithChildren) => {
  return (
    // <SessionProvider>
      <div className="flex bg-black dark:bg-white">
        <Sidenav />

        <section className="flex-1 bg-background overflow-clip">
          {children}
        </section>
      </div>
    // {/* </SessionProvider> */}
  );
};
