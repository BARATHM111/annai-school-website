// Branch configuration for multi-campus system
export type BranchId = 'tirupur' | 'uthukuli'

export interface BranchConfig {
  id: BranchId
  name: string
  displayName: string
  address: string
  phone: string
  email: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  logo?: string
}

export const BRANCHES: Record<BranchId, BranchConfig> = {
  tirupur: {
    id: 'tirupur',
    name: 'Tirupur Campus',
    displayName: 'Annai Matriculation School - Tirupur',
    address: 'Tirupur, Tamil Nadu',
    phone: '+91 1234567890',
    email: 'tirupur@annaischool.edu',
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))'
    }
  },
  uthukuli: {
    id: 'uthukuli',
    name: 'Uthukuli Campus',
    displayName: 'Annai Matriculation School - Uthukuli',
    address: 'Uthukuli, Tamil Nadu',
    phone: '+91 0987654321',
    email: 'uthukuli@annaischool.edu',
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))'
    }
  }
}

export const DEFAULT_BRANCH: BranchId = 'tirupur'

export function getBranch(branchId: BranchId): BranchConfig {
  return BRANCHES[branchId]
}

export function getAllBranches(): BranchConfig[] {
  return Object.values(BRANCHES)
}

export function getEnabledBranches(): BranchConfig[] {
  return getAllBranches()
}
