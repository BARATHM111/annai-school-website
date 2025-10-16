'use client'

import { useBranch } from '@/contexts/BranchContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Building2, Check } from 'lucide-react'

export function BranchSwitcher() {
  const { currentBranch, branchConfig, switchBranch, availableBranches } = useBranch()
  const branches = availableBranches.length > 0 ? availableBranches : [branchConfig]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Building2 className="h-4 w-4" />
          <span className="hidden md:inline">{branchConfig.name}</span>
          <span className="md:hidden">{branchConfig.id.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Campus</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            onClick={() => switchBranch(branch.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">{branch.name}</div>
                <div className="text-xs text-muted-foreground">{branch.address}</div>
              </div>
              {currentBranch === branch.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
