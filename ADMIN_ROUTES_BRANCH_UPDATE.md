# Admin Routes Branch Isolation - Complete Update Guide

## ✅ Already Updated (Working)
1. ✅ `/api/admin/applications` - Branch-specific
2. ✅ `/api/admin/students` - Branch-specific
3. ✅ `/api/admin/dashboard` - Branch-specific
4. ✅ `/api/carousel` - Branch-specific

## 🔴 NEEDS UPDATE (Priority Order)

### HIGH PRIORITY (User-Facing Data)

#### 1. Academics Routes
- `src/app/api/admin/academics/route.ts` (GET, POST)
- `src/app/api/admin/academics/[id]/route.ts` (PUT, DELETE)

#### 2. News/Events Routes
- `src/app/api/admin/news/route.ts` (GET, POST)
- `src/app/api/admin/news/[id]/route.ts` (PUT, DELETE)

#### 3. Contacts Routes
- `src/app/api/admin/contacts/route.ts` (GET)
- `src/app/api/admin/contacts/[id]/route.ts` (PUT, DELETE)

### MEDIUM PRIORITY

#### 4. Gallery (if exists)
- Check for gallery management routes

#### 5. Achievers (if exists)
- Check for achievers routes

#### 6. Sports (if exists)
- Check for sports routes

### LOW PRIORITY (System-wide)
These should NOT be branch-specific:
- ❌ `/api/admin/branches` - Manages all branches
- ❌ `/api/admin/form-fields` - Can be global or branch-specific
- ❌ `/api/admin/profile` - Admin profile
- ❌ `/api/admin/change-password` - Admin actions
- ❌ Admin authentication routes

---

## 🔧 Quick Fix Pattern

For each route, add:

```typescript
// At top of file
import { getBranchFromRequest } from '@/lib/branch-utils'

// In GET handler
const branchId = getBranchFromRequest(request)
const data = await db.query(
  'SELECT * FROM table_name WHERE branch_id = ?',
  [branchId]
)

// In POST handler
const branchId = getBranchFromRequest(request)
await db.query(
  'INSERT INTO table_name (branch_id, ...) VALUES (?, ...)',
  [branchId, ...]
)

// In PUT handler
const branchId = getBranchFromRequest(request)
await db.query(
  'UPDATE table_name SET ... WHERE id = ? AND branch_id = ?',
  [values, id, branchId]
)

// In DELETE handler
const branchId = getBranchFromRequest(request)
await db.query(
  'DELETE FROM table_name WHERE id = ? AND branch_id = ?',
  [id, branchId]
)
```

---

## 📝 Verification Commands

After updating each route:

```sql
-- Check data distribution
SELECT branch_id, COUNT(*) FROM table_name GROUP BY branch_id;

-- Test in Tirupur
SELECT * FROM table_name WHERE branch_id = 'tirupur';

-- Test in Uthukuli
SELECT * FROM table_name WHERE branch_id = 'uthukuli';
```

---

## 🎯 Next Steps

I'll now update the HIGH PRIORITY routes one by one.
