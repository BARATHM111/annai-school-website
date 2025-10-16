# ⚠️ URGENT: Branch Isolation Setup

## 🚨 Issue
You're seeing data from Tirupur in Uthukuli (and vice versa) because **the database migration hasn't been run yet**.

---

## ✅ Solution (2 Steps)

### Step 1: Run Database Migrations
```bash
# First, create branches table
mysql -u root -p annai_school < sql/create_branches.sql

# Second, add branch_id to all tables (THIS IS CRITICAL!)
mysql -u root -p annai_school < sql/add_branch_id_to_tables.sql
```

### Step 2: Verify Migration Worked
```bash
# Check if branch_id column exists
mysql -u root -p annai_school < sql/verify_branch_migration.sql
```

**You should see:**
```
table_name                  | column_name | data_type
----------------------------|-------------|----------
student_application_form    | branch_id   | varchar
active_students             | branch_id   | varchar
...
```

---

## 🔍 What I've Already Updated

✅ **API Routes Updated** (Code changes done):
1. `/api/auth/signup` - Now saves with branch_id
2. `/api/admin/applications` - Now filters by branch_id
3. `/api/admin/students` - Now filters by branch_id  
4. `/api/admin/dashboard` - Now shows branch-specific stats

✅ **Helper Created**:
- `src/lib/branch-utils.ts` - Gets current branch from request

---

## 🎯 What Happens After Migration

### Before Migration (Current Problem):
```sql
-- Shows ALL data (no branch filter)
SELECT * FROM student_application_form
-- Result: Tirupur + Uthukuli data mixed together ❌
```

### After Migration (Fixed):
```sql
-- Shows ONLY current branch data
SELECT * FROM student_application_form WHERE branch_id = 'tirupur'
-- Result: Only Tirupur data ✅

SELECT * FROM student_application_form WHERE branch_id = 'uthukuli'
-- Result: Only Uthukuli data ✅
```

---

## 📊 What the Migration Does

### Adds `branch_id` column to:
- student_application_form
- active_students
- career_applications
- contacts
- academics
- gallery
- achievers
- sports
- newsevent
- announcement
- admission_form_fields

### Assigns existing data to Tirupur:
```sql
UPDATE student_application_form SET branch_id = 'tirupur' WHERE branch_id IS NULL;
-- All your current data → Tirupur campus
```

### Adds indexes and foreign keys:
```sql
ADD INDEX idx_branch_id (branch_id)
ADD FOREIGN KEY (branch_id) REFERENCES branches(id)
```

---

## 🧪 Test After Migration

1. **Switch to Tirupur branch**
   - Check browser cookie: `selected_branch=tirupur`
   
2. **Go to Admin → Applications**
   - Should see only Tirupur applications
   
3. **Switch to Uthukuli branch**
   - Cookie changes to: `selected_branch=uthukuli`
   - Should see 0 applications (empty)
   
4. **Create test application in Uthukuli**
   - New signup while on Uthukuli branch
   
5. **Switch back to Tirupur**
   - Should NOT see Uthukuli application ✅

---

## ⚡ Quick Verification Commands

### Check if migration needed:
```bash
# If this shows error "Unknown column 'branch_id'", you NEED migration
mysql -u root -p annai_school -e "SELECT branch_id FROM student_application_form LIMIT 1;"
```

### Check current data:
```bash
# After migration, check data distribution
mysql -u root -p annai_school -e "SELECT branch_id, COUNT(*) FROM student_application_form GROUP BY branch_id;"
```

Expected result:
```
branch_id | COUNT(*)
----------|----------
tirupur   | 50       (all existing data)
uthukuli  | 0        (empty until you add)
```

---

## 🚨 Backup First!

**ALWAYS backup before migration:**
```bash
mysqldump -u root -p annai_school > backup_before_branch_$(date +%Y%m%d_%H%M%S).sql
```

**If something goes wrong, restore:**
```bash
mysql -u root -p annai_school < backup_before_branch_YYYYMMDD_HHMMSS.sql
```

---

## 📝 Files You Need

1. ✅ `sql/create_branches.sql` - Creates branches table
2. ✅ `sql/add_branch_id_to_tables.sql` - Adds branch_id (MAIN FIX)
3. ✅ `sql/verify_branch_migration.sql` - Checks if it worked

---

## 🎯 Summary

**Problem**: No branch_id in database  
**Solution**: Run migration scripts  
**Result**: Complete data isolation per branch  

**Status of Code**: ✅ Already updated  
**Status of Database**: ❌ Needs migration  

---

## 🔧 Next Steps

```bash
# 1. Backup
mysqldump -u root -p annai_school > backup.sql

# 2. Run migrations
mysql -u root -p annai_school < sql/create_branches.sql
mysql -u root -p annai_school < sql/add_branch_id_to_tables.sql

# 3. Verify
mysql -u root -p annai_school < sql/verify_branch_migration.sql

# 4. Test
# - Switch branches in UI
# - Check data isolation working
```

---

**After running these 2 SQL scripts, your branch isolation will work perfectly!** 🎉
