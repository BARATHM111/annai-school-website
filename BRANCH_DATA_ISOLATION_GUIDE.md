# Branch Data Isolation - Complete Guide

## 🎯 Overview

Each branch (Tirupur, Uthukuli) will have completely separate data. When admin edits something in Tirupur, it only affects Tirupur. Same for Uthukuli.

---

## 📋 Implementation Steps

### Step 1: Run Database Migration ✅

```bash
# First, create branches table
mysql -u root -p annai_school < sql/create_branches.sql

# Then, add branch_id to all tables
mysql -u root -p annai_school < sql/add_branch_id_to_tables.sql
```

This adds `branch_id` column to:
- ✅ student_application_form
- ✅ active_students
- ✅ career_applications
- ✅ contacts
- ✅ academics
- ✅ gallery
- ✅ achievers
- ✅ sports
- ✅ newsevent
- ✅ announcement
- ✅ admission_form_fields (optional per branch)

**All existing data will be assigned to 'tirupur' branch (main campus)**

---

### Step 2: Update API Routes

#### Pattern for All API Routes:

```typescript
import { getBranchFromRequest } from '@/lib/branch-utils'

export async function GET(request: NextRequest) {
  // Get current branch
  const branchId = getBranchFromRequest(request)
  
  // Filter by branch
  const data = await db.query(
    'SELECT * FROM table_name WHERE branch_id = ?',
    [branchId]
  )
  
  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  const body = await request.json()
  
  // Include branch_id when creating
  await db.query(
    'INSERT INTO table_name (branch_id, ...) VALUES (?, ...)',
    [branchId, ...]
  )
}
```

---

## 🔧 API Routes to Update

### 1. Applications API
**File:** `src/app/api/admin/applications/route.ts`

```typescript
import { getBranchFromRequest } from '@/lib/branch-utils'

export async function GET(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  
  const applications = await db.query(
    'SELECT * FROM student_application_form WHERE branch_id = ? ORDER BY appliedAt DESC',
    [branchId]
  )
  
  return NextResponse.json({ success: true, data: applications })
}
```

### 2. Students API
**File:** `src/app/api/admin/students/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  
  const students = await db.query(
    'SELECT * FROM active_students WHERE branch_id = ?',
    [branchId]
  )
  
  return NextResponse.json({ success: true, data: students })
}
```

### 3. Signup API
**File:** `src/app/api/auth/signup/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  const body = await request.json()
  
  // Insert with branch_id
  await db.query(
    `INSERT INTO student_application_form 
    (branch_id, studentName, parentName, phoneNumber, ...) 
    VALUES (?, ?, ?, ?, ...)`,
    [branchId, body.studentName, body.parentName, ...]
  )
}
```

### 4. Academics API
**File:** `src/app/api/admin/academics/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  
  const academics = await db.query(
    'SELECT * FROM academics WHERE branch_id = ?',
    [branchId]
  )
}

export async function POST(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  const body = await request.json()
  
  await db.query(
    'INSERT INTO academics (branch_id, title, description, ...) VALUES (?, ?, ?, ...)',
    [branchId, body.title, body.description, ...]
  )
}
```

### 5. Gallery API
**File:** `src/app/api/admin/gallery/route.ts` (or similar)

```typescript
export async function GET(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  
  const images = await db.query(
    'SELECT * FROM gallery WHERE branch_id = ?',
    [branchId]
  )
}
```

### 6. Careers API
**File:** `src/app/api/career/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  
  const applications = await db.query(
    'SELECT * FROM career_applications WHERE branch_id = ?',
    [branchId]
  )
}
```

### 7. News/Events API
**File:** `src/app/api/news/route.ts` (or admin version)

```typescript
export async function GET(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  
  const news = await db.query(
    'SELECT * FROM newsevent WHERE branch_id = ?',
    [branchId]
  )
}
```

### 8. Contacts API
**File:** `src/app/api/contact/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  const body = await request.json()
  
  await db.query(
    'INSERT INTO contacts (branch_id, name, email, ...) VALUES (?, ?, ?, ...)',
    [branchId, body.name, body.email, ...]
  )
}
```

---

## 🔍 How Branch Detection Works

### Client Side:
1. User selects branch via switcher
2. Stored in **localStorage**: `annai_selected_branch`
3. Stored in **cookie**: `selected_branch`

### Server Side (API Routes):
```typescript
getBranchFromRequest(request)
```

Checks in order:
1. **Header**: `x-branch-id` (for explicit requests)
2. **Query Param**: `?branch_id=tirupur`
3. **Cookie**: `selected_branch`
4. **Default**: `tirupur` (main campus)

---

## 📊 Database Structure After Migration

### Example: student_application_form

```sql
CREATE TABLE student_application_form (
  id VARCHAR(36),
  branch_id VARCHAR(50) NOT NULL,  -- NEW!
  studentName VARCHAR(200),
  parentName VARCHAR(200),
  phoneNumber VARCHAR(20),
  -- ... other fields
  
  PRIMARY KEY (id),
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  INDEX idx_branch_id (branch_id)
);
```

**Existing Records:**
- All current data → `branch_id = 'tirupur'`
- New Uthukuli records → `branch_id = 'uthukuli'`

---

## 🧪 Testing Branch Isolation

### Test 1: Applications
1. Login as admin
2. Switch to **Tirupur** branch
3. Go to Applications
4. Create test application
5. Switch to **Uthukuli** branch
6. Go to Applications
7. ✅ Should NOT see Tirupur applications
8. Create another test application
9. Switch back to **Tirupur**
10. ✅ Should NOT see Uthukuli application

### Test 2: Students
1. Switch to **Tirupur**
2. Add student
3. Switch to **Uthukuli**
4. ✅ Should NOT see Tirupur students
5. Add different student
6. Switch back to **Tirupur**
7. ✅ Should only see Tirupur students

### Test 3: Gallery
1. Upload image in Tirupur branch
2. Switch to Uthukuli
3. ✅ Should NOT see Tirupur images
4. Upload different image
5. Switch back to Tirupur
6. ✅ Should only see Tirupur images

---

## ✅ Complete Checklist

### Database Migration
- [ ] Create `branches` table
- [ ] Run branch_id migration script
- [ ] Verify all tables have branch_id column
- [ ] Confirm existing data assigned to 'tirupur'

### API Route Updates
- [ ] src/app/api/auth/signup/route.ts
- [ ] src/app/api/admin/applications/route.ts
- [ ] src/app/api/admin/students/route.ts
- [ ] src/app/api/admin/academics/route.ts
- [ ] src/app/api/admin/gallery/route.ts
- [ ] src/app/api/admin/careers/route.ts
- [ ] src/app/api/admin/contacts/route.ts
- [ ] src/app/api/admin/news/route.ts
- [ ] src/app/api/contact/route.ts
- [ ] Any other custom routes

### Testing
- [ ] Test application creation per branch
- [ ] Test student management per branch
- [ ] Test gallery uploads per branch
- [ ] Test news/events per branch
- [ ] Test switching between branches
- [ ] Confirm data isolation working

---

## 🚨 Important Notes

### 1. Existing Data
- **All current data** will be assigned to `tirupur` branch
- This includes students, applications, gallery, etc.
- Uthukuli branch will start empty

### 2. Shared Data
Some data might be shared across branches:
- **Admins**: Same admin can manage all branches
- **Form Fields**: Can be global or branch-specific (configurable)
- **About Page**: Might be branch-specific or shared

### 3. Migration Safety
```sql
-- Before migration, backup your data!
mysqldump -u root -p annai_school > backup_before_branch_migration.sql

-- If something goes wrong, restore:
mysql -u root -p annai_school < backup_before_branch_migration.sql
```

### 4. Foreign Key Constraints
```sql
-- Branch deletion is RESTRICTED
-- Cannot delete branch if data exists

-- To delete branch, first:
-- 1. Move data to another branch
-- UPDATE students SET branch_id = 'tirupur' WHERE branch_id = 'uthukuli';

-- 2. Then delete branch
-- DELETE FROM branches WHERE id = 'uthukuli';
```

---

## 📝 Example: Full API Route Update

### Before (No Branch Isolation):
```typescript
// src/app/api/admin/applications/route.ts
export async function GET() {
  const applications = await db.query(
    'SELECT * FROM student_application_form ORDER BY appliedAt DESC'
  )
  
  return NextResponse.json({ success: true, data: applications })
}
```

### After (With Branch Isolation):
```typescript
import { getBranchFromRequest } from '@/lib/branch-utils'

export async function GET(request: NextRequest) {
  // Get current branch from request
  const branchId = getBranchFromRequest(request)
  
  // Filter by branch_id
  const applications = await db.query(
    'SELECT * FROM student_application_form WHERE branch_id = ? ORDER BY appliedAt DESC',
    [branchId]
  )
  
  return NextResponse.json({ 
    success: true, 
    data: applications,
    branch: branchId  // Optional: inform client which branch
  })
}

export async function POST(request: NextRequest) {
  const branchId = getBranchFromRequest(request)
  const body = await request.json()
  
  // Include branch_id in INSERT
  await db.query(
    `INSERT INTO student_application_form 
    (branch_id, studentName, parentName, phoneNumber, ...) 
    VALUES (?, ?, ?, ?, ...)`,
    [branchId, body.studentName, body.parentName, body.phoneNumber, ...]
  )
  
  return NextResponse.json({ success: true })
}
```

---

## 🎯 Next Steps

1. **Run SQL Migrations**
   ```bash
   mysql -u root -p annai_school < sql/create_branches.sql
   mysql -u root -p annai_school < sql/add_branch_id_to_tables.sql
   ```

2. **Update API Routes** (one by one)
   - Start with critical routes (signup, applications)
   - Test each update before moving to next
   - Use pattern shown above

3. **Test Thoroughly**
   - Switch between branches
   - Create data in each branch
   - Verify isolation working

4. **Monitor Logs**
   - Check for any errors
   - Verify correct branch_id in database

---

## 🔒 Security Considerations

- ✅ Branch ID from cookie (user selected)
- ✅ Cannot access other branch data
- ✅ Admin can see all branches via switcher
- ✅ Foreign key prevents orphaned data
- ✅ Index on branch_id for performance

---

**Status**: 📝 Migration scripts ready  
**Next**: Run SQL scripts → Update API routes → Test  
**Result**: Complete data isolation per branch! 🎉
