import { NextRequest } from 'next/server'

export const DEFAULT_BRANCH = 'tirupur'
export const BRANCH_COOKIE_NAME = 'selected_branch'

/**
 * Get current branch ID from request
 * Checks in order: header -> query param -> cookie -> default
 */
export function getBranchFromRequest(request: NextRequest): string {
  // Check custom header first
  const headerBranch = request.headers.get('x-branch-id')
  if (headerBranch) {
    return headerBranch
  }

  // Check query parameter
  const { searchParams } = new URL(request.url)
  const queryBranch = searchParams.get('branch_id')
  if (queryBranch) {
    return queryBranch
  }

  // Check cookie (user's selected branch)
  const cookieBranch = request.cookies.get(BRANCH_COOKIE_NAME)?.value
  if (cookieBranch) {
    return cookieBranch
  }

  // Default to main campus
  return DEFAULT_BRANCH
}

/**
 * Get branch from request headers (for API routes)
 */
export function getBranchFromHeaders(request: NextRequest): string {
  const branchHeader = request.headers.get('x-branch-id')
  if (branchHeader) {
    return branchHeader
  }

  return getBranchFromRequest(request)
}
