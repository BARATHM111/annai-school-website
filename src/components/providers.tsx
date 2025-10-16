"use client"

import { SessionProvider } from "next-auth/react"
import { BranchProvider } from "@/contexts/BranchContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BranchProvider>
        {children}
      </BranchProvider>
    </SessionProvider>
  )
}
