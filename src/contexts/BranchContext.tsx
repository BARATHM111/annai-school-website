'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { BranchId, BranchConfig, getBranch, DEFAULT_BRANCH } from '@/lib/branches'

interface BranchContextType {
  currentBranch: BranchId
  branchConfig: BranchConfig
  switchBranch: (branchId: BranchId) => void
  isTransitioning: boolean
  availableBranches: BranchConfig[]
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

const BRANCH_STORAGE_KEY = 'annai_selected_branch'

export function BranchProvider({ children }: { children: ReactNode }) {
  const [currentBranch, setCurrentBranch] = useState<BranchId>(DEFAULT_BRANCH)
  const [availableBranches, setAvailableBranches] = useState<BranchConfig[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [defaultBranch, setDefaultBranch] = useState<BranchId>(DEFAULT_BRANCH)

  // Fetch branches from database
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch('/api/branches')
        const data = await response.json()
        
        if (data.success && data.data) {
          const branches = data.data.map((b: any) => ({
            id: b.id,
            name: b.name,
            displayName: b.display_name,
            address: b.address,
            phone: b.phone,
            email: b.email,
            colors: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--secondary))',
              accent: 'hsl(var(--accent))'
            },
            logo: b.logo_url
          }))
          setAvailableBranches(branches)
          
          // Set default branch
          if (data.default) {
            setDefaultBranch(data.default as BranchId)
          }
        }
      } catch (error) {
        console.error('Failed to fetch branches:', error)
      }
    }
    
    fetchBranches()
  }, [])

  // Load saved branch on mount
  useEffect(() => {
    const savedBranch = localStorage.getItem(BRANCH_STORAGE_KEY) as BranchId | null
    if (savedBranch) {
      setCurrentBranch(savedBranch)
    } else {
      setCurrentBranch(defaultBranch)
    }
  }, [defaultBranch])

  const switchBranch = (branchId: BranchId) => {
    if (branchId === currentBranch) return

    setIsTransitioning(true)
    
    // Smooth transition
    setTimeout(() => {
      setCurrentBranch(branchId)
      localStorage.setItem(BRANCH_STORAGE_KEY, branchId)
      
      // Set cookie for server-side access (expires in 1 year)
      document.cookie = `selected_branch=${branchId}; path=/; max-age=${60 * 60 * 24 * 365}`
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 150)
  }

  const branchConfig = getBranch(currentBranch)

  return (
    <BranchContext.Provider
      value={{
        currentBranch,
        branchConfig,
        switchBranch,
        isTransitioning,
        availableBranches
      }}
    >
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider')
  }
  return context
}
