'use client'

import { useBranch } from '@/contexts/BranchContext'

export function useBranchInfo() {
  const { currentBranch, branchConfig, switchBranch, isTransitioning } = useBranch()

  return {
    branchId: currentBranch,
    branchName: branchConfig.name,
    branchDisplayName: branchConfig.displayName,
    branchAddress: branchConfig.address,
    branchPhone: branchConfig.phone,
    branchEmail: branchConfig.email,
    branchColors: branchConfig.colors,
    switchBranch,
    isTransitioning,
    isTirupur: currentBranch === 'tirupur',
    isUthukuli: currentBranch === 'uthukuli',
  }
}
