'use client'

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children,
}: {children: React.ReactNode}){ // any wala children will be of type reactnode
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}