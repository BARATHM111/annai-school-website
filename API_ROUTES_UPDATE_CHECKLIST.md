# API Routes Update Checklist - Branch Isolation

## 🎯 Quick Start

Add this import to ALL API routes that access branch-specific data:
```typescript
import { getBranchFromRequest } from '@/lib/branch-utils'
```

---

## ✅ Routes to Update

### 1. Authentication & Signup
**File**: `src/app/api/auth/signup/route.ts`
```typescript
// In POST handler:
const branchId = getBranchFromRequest(request)

// When inserting:
INSERT INTO student_application_form (branch_id, ...) VALUES (?, ...)
```

---

### 2. Admin Applications
**File**: `src/app/api/admin/applications/route.ts`

```typescript
// GET - Fetch applications
const branchId = getBranchFromRequest(request)
const apps = await db.query(
  'SELECT * FROM student_application_form WHERE branch_id = ?',
  [branchId]
)

// PUT - Update application
const branchId = getBranchFromRequest(request)
// Add WHERE branch_id = ? to UPDATE queries
```

---

### 3. Admin Students
**File**: `src/app/api/admin/students/route.ts`

```typescript
// GET
const branchId = getBranchFromRequest(request)
const students = await db.query(
  'SELECT * FROM active_students WHERE branch_id = ?',
  [branchId]
)

// POST
const branchId = getBranchFromRequest(request)
INSERT INTO active_students (branch_id, ...) VALUES (?, ...)

// PUT/DELETE
Add: WHERE branch_id = ? AND id = ?
```

---

### 4. Careers/Jobs
**File**: `src/app/api/career/route.ts` or `src/app/api/admin/careers/route.ts`

```typescript
// GET - List applications
const branchId = getBranchFromRequest(request)
SELECT * FROM career_applications WHERE branch_id = ?

// POST - Submit application
const branchId = getBranchFromRequest(request)
INSERT INTO career_applications (branch_id, ...) VALUES (?, ...)
```

---

### 5. Academics
**File**: `src/app/api/admin/academics/route.ts` or `src/app/api/academics/route.ts`

```typescript
// GET
const branchId = getBranchFromRequest(request)
SELECT * FROM academics WHERE branch_id = ?

// POST
const branchId = getBranchFromRequest(request)
INSERT INTO academics (branch_id, ...) VALUES (?, ...)

// PUT/DELETE
WHERE branch_id = ? AND id = ?
```

---

### 6. Gallery
**File**: `src/app/api/admin/gallery/route.ts` or similar

```typescript
// GET
const branchId = getBranchFromRequest(request)
SELECT * FROM gallery WHERE branch_id = ? AND category = ?

// POST
const branchId = getBranchFromRequest(request)
INSERT INTO gallery (branch_id, ...) VALUES (?, ...)
```

---

### 7. Achievers
**File**: `src/app/api/achievers/route.ts` or admin version

```typescript
// GET
const branchId = getBranchFromRequest(request)
SELECT * FROM achievers WHERE branch_id = ?

// POST
const branchId = getBranchFromRequest(request)
INSERT INTO achievers (branch_id, ...) VALUES (?, ...)
```

---

### 8. Sports
**File**: `src/app/api/sports/route.ts` or admin version

```typescript
// GET
const branchId = getBranchFromRequest(request)
SELECT * FROM sports WHERE branch_id = ?

// POST
const branchId = getBranchFromRequest(request)
INSERT INTO sports (branch_id, ...) VALUES (?, ...)
```

---

### 9. News/Events
**File**: `src/app/api/news/route.ts` or `src/app/api/admin/news/route.ts`

```typescript
// GET
const branchId = getBranchFromRequest(request)
SELECT * FROM newsevent WHERE branch_id = ?

// POST
const branchId = getBranchFromRequest(request)
INSERT INTO newsevent (branch_id, ...) VALUES (?, ...)
```

---

### 10. Contacts
**File**: `src/app/api/contact/route.ts` or admin version

```typescript
// GET (admin only)
const branchId = getBranchFromRequest(request)
SELECT * FROM contacts WHERE branch_id = ?

// POST (public contact form)
const branchId = getBranchFromRequest(request)
INSERT INTO contacts (branch_id, ...) VALUES (?, ...)
```

---

### 11. Dashboard Stats
**File**: `src/app/api/admin/dashboard/route.ts`

```typescript
const branchId = getBranchFromRequest(request)

// All count queries need WHERE branch_id = ?
SELECT COUNT(*) FROM student_application_form WHERE branch_id = ?
SELECT COUNT(*) FROM active_students WHERE branch_id = ?
// etc.
```

---

## 🔍 Pattern to Follow

### For GET Requests (Fetching Data):
```typescript
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Check auth...
  
  // GET BRANCH
  const branchId = getBranchFromRequest(request)
  
  // FILTER BY BRANCH
  const data = await db.query(
    'SELECT * FROM table_name WHERE branch_id = ? AND other_conditions',
    [branchId, other_params]
  )
  
  return NextResponse.json({ success: true, data })
}
```

### For POST Requests (Creating Data):
```typescript
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const body = await request.json()
  
  // GET BRANCH
  const branchId = getBranchFromRequest(request)
  
  // INCLUDE BRANCH IN INSERT
  await db.query(
    'INSERT INTO table_name (branch_id, field1, field2) VALUES (?, ?, ?)',
    [branchId, body.field1, body.field2]
  )
  
  return NextResponse.json({ success: true })
}
```

### For PUT Requests (Updating Data):
```typescript
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const body = await request.json()
  
  // GET BRANCH
  const branchId = getBranchFromRequest(request)
  
  // UPDATE ONLY IN CURRENT BRANCH
  await db.query(
    'UPDATE table_name SET field1 = ? WHERE id = ? AND branch_id = ?',
    [body.field1, body.id, branchId]
  )
  
  return NextResponse.json({ success: true })
}
```

### For DELETE Requests:
```typescript
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  // GET BRANCH
  const branchId = getBranchFromRequest(request)
  
  // DELETE ONLY FROM CURRENT BRANCH
  await db.query(
    'DELETE FROM table_name WHERE id = ? AND branch_id = ?',
    [id, branchId]
  )
  
  return NextResponse.json({ success: true })
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Wrong:
```typescript
// Missing branch filter
SELECT * FROM students

// Forgetting to include branch_id
INSERT INTO students (name, age) VALUES (?, ?)

// Not filtering in UPDATE
UPDATE students SET name = ? WHERE id = ?
```

### ✅ Correct:
```typescript
// With branch filter
SELECT * FROM students WHERE branch_id = ?

// Including branch_id
INSERT INTO students (branch_id, name, age) VALUES (?, ?, ?)

// Filtering in UPDATE
UPDATE students SET name = ? WHERE id = ? AND branch_id = ?
```

---

## 📝 Testing Each Route

After updating each route:

1. **Switch to Tirupur branch**
2. **Create test data**
3. **Switch to Uthukuli branch**
4. **Verify data NOT visible**
5. **Create different test data**
6. **Switch back to Tirupur**
7. **Verify only Tirupur data visible**
8. **Check database**:
   ```sql
   SELECT branch_id, COUNT(*) FROM table_name GROUP BY branch_id;
   ```

---

## ⚡ Priority Order

Update in this order:

1. **High Priority** (user-facing):
   - [ ] Signup route
   - [ ] Applications route
   - [ ] Students route
   - [ ] Dashboard route

2. **Medium Priority** (admin features):
   - [ ] Academics route
   - [ ] Gallery route
   - [ ] News/Events route
   - [ ] Careers route

3. **Low Priority** (less frequently used):
   - [ ] Contacts route
   - [ ] Achievers route
   - [ ] Sports route

---

## 🔧 Quick Command Reference

```typescript
// At top of file
import { getBranchFromRequest } from '@/lib/branch-utils'

// In handler
const branchId = getBranchFromRequest(request)

// In queries - Add branch_id
WHERE branch_id = ?
INSERT INTO table (branch_id, ...) VALUES (?, ...)
UPDATE table SET ... WHERE id = ? AND branch_id = ?
DELETE FROM table WHERE id = ? AND branch_id = ?
```

---

## ✅ Verification

After all updates, verify:

```sql
-- Check all tables have branch_id
SHOW COLUMNS FROM student_application_form LIKE 'branch_id';
SHOW COLUMNS FROM active_students LIKE 'branch_id';
-- etc.

-- Count records per branch
SELECT branch_id, COUNT(*) FROM student_application_form GROUP BY branch_id;
SELECT branch_id, COUNT(*) FROM active_students GROUP BY branch_id;
-- etc.
```

---

**Remember**: One route at a time, test each before moving to next! 🎯
