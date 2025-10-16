# Multi-Campus Branch System Guide

## Overview
The application now supports multiple branch campuses with dynamic switching capabilities. Both Tirupur (main campus) and Uthukuli campuses use the same UI and colors for consistency.

## Features

### ✅ Implemented
1. **Branch Configuration** (`src/lib/branches.ts`)
   - Tirupur Campus (Main)
   - Uthukuli Campus (Branch)
   - Both use identical Tailwind colors

2. **Branch Context** (`src/contexts/BranchContext.tsx`)
   - Global branch state management
   - Smooth transitions when switching
   - Persists selection in localStorage

3. **Branch Switcher Component** (`src/components/branch/BranchSwitcher.tsx`)
   - Dropdown menu for campus selection
   - Shows current campus with checkmark
   - Displays campus name and address

4. **Integration Points**
   - ✅ Public Navbar (top right)
   - ✅ Admin Sidebar (below logo)
   - ✅ Wrapped in Providers

## How to Use

### For Users
1. **Switch Campus**: Click the "Campus" button in the navbar
2. **View Current Campus**: The button shows the currently selected campus
3. **Persistent Selection**: Your choice is saved and remembered

### For Developers

#### Access Branch Information in Components
```typescript
import { useBranchInfo } from '@/hooks/useBranchInfo'

function MyComponent() {
  const { 
    branchId,           // 'tirupur' | 'uthukuli'
    branchName,         // 'Tirupur Campus'
    branchDisplayName,  // 'Annai Matriculation School - Tirupur'
    branchAddress,
    branchPhone,
    branchEmail,
    switchBranch,
    isTransitioning,
    isTirupur,
    isUthukuli
  } = useBranchInfo()

  return <div>{branchDisplayName}</div>
}
```

#### Display Branch-Specific Content
```typescript
const { isTirupur, isUthukuli } = useBranchInfo()

if (isTirupur) {
  return <TirupurContent />
}
if (isUthukuli) {
  return <UthukliContent />
}
```

#### Switch Branch Programmatically
```typescript
const { switchBranch } = useBranchInfo()

// Switch to Uthukuli
switchBranch('uthukuli')
```

## Branch Configuration

### Adding New Campus
Edit `src/lib/branches.ts`:

```typescript
export type BranchId = 'tirupur' | 'uthukuli' | 'new_campus'

export const BRANCHES: Record<BranchId, BranchConfig> = {
  // ... existing branches
  new_campus: {
    id: 'new_campus',
    name: 'New Campus',
    displayName: 'Annai Matriculation School - New Campus',
    address: 'New Location, Tamil Nadu',
    phone: '+91 1234567890',
    email: 'newcampus@annaischool.edu',
    colors: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--secondary))',
      accent: 'hsl(var(--accent))'
    }
  }
}
```

## Color Scheme
Both campuses use the same Tailwind CSS color variables:
- **Primary**: `hsl(var(--primary))`
- **Secondary**: `hsl(var(--secondary))`
- **Accent**: `hsl(var(--accent))`

This ensures consistent branding across all campuses.

## Files Structure

```
src/
├── lib/
│   └── branches.ts                     # Branch configuration
├── contexts/
│   └── BranchContext.tsx              # Branch state management
├── components/
│   ├── branch/
│   │   └── BranchSwitcher.tsx         # Campus switcher UI
│   ├── admin/
│   │   └── optimized-sidebar.tsx      # Admin sidebar (includes switcher)
│   ├── layout/
│   │   └── navbar.tsx                 # Public navbar (includes switcher)
│   └── providers.tsx                  # Wraps app with BranchProvider
└── hooks/
    └── useBranchInfo.ts               # Hook for branch information
```

## Next Steps

To make data branch-specific:

1. **Database**: Add `branch_id` column to relevant tables
2. **API Routes**: Filter data by current branch
3. **Forms**: Include branch context when submitting
4. **Components**: Display branch-specific content

Example API modification:
```typescript
// Before
const students = await db.query('SELECT * FROM students')

// After
const students = await db.query(
  'SELECT * FROM students WHERE branch_id = ?',
  [branchId]
)
```

## Important Notes

- ⚠️ **Main Campus Protected**: All existing Tirupur campus data remains unchanged
- ✅ **Same UI/Colors**: Both campuses use identical design
- ✅ **Smooth Transitions**: 300ms fade animation when switching
- ✅ **Persistent**: Branch selection saved in localStorage
- ✅ **Admin Access**: Branch switcher available in admin panel

## Testing

1. Visit the homepage
2. Click the branch switcher in the navbar
3. Select "Uthukuli Campus"
4. Notice the smooth transition
5. Refresh the page - selection persists
6. Access admin panel - branch switcher visible in sidebar

---

**Last Updated**: October 2025
**Status**: ✅ Implemented - Ready for branch-specific data integration
