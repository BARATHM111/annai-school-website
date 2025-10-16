'use client'

import { useBranch } from '@/contexts/BranchContext'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

interface BranchBadgeProps {
  className?: string
  showIcon?: boolean
}

export function BranchBadge({ className = '', showIcon = true }: BranchBadgeProps) {
  const { branchConfig } = useBranch()

  return (
    <Badge variant="outline" className={`${className}`}>
      {showIcon && <Building2 className="h-3 w-3 mr-1" />}
      {branchConfig.name}
    </Badge>
  )
}
