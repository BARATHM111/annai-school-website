# Testing Status Update Flow

## Step-by-Step Test Procedure

### Setup
Make sure your app is running:
```bash
npm run dev
```

---

## Test 1: Create Student Account

1. **Go to Signup**: http://localhost:3000/auth/signup
2. **Create account with these details:**
   - Name: Test Student
   - Email: `teststudent@email.com`
   - Password: `password123`
   - Date of Birth: 2005-01-01
   - Gender: male
   - Nationality: indian
   - Mobile: 9876543210

3. **After signup**, you should see success message
4. **Login** with the same credentials

---

## Test 2: Check Initial Status

1. **Go to Results Page**: http://localhost:3000/student/results
2. **You should see:**
   - Status: `pending` (default after signup)
   - Application ID: APP2025XXXXXX
   - "Last checked" timestamp

3. **Note the exact email shown** on this page

---

## Test 3: Update Status as Admin

1. **Logout** from student account
2. **Login as Admin**:
   - Email: `admin@annaischool.edu`
   - Password: `admin123`

3. **Go to Applications**: http://localhost:3000/admin/applications
4. **Find the student** "Test Student" (`teststudent@email.com`)
5. **Click the Status button** (3 vertical dots or edit icon)
6. **Change status to**: `approved`
7. **Add notes** (optional): "Application approved by admin"
8. **Click Save**

9. **Check Server Console** - You should see:
   ```
   === UPDATE STATUS REQUEST ===
   Email: teststudent@email.com
   Status: approved
   ...
   Update affected rows: 1
   ✅ Student status updated for teststudent@email.com: approved
   ```

---

## Test 4: Verify Update (Student Side)

1. **Logout** from admin account
2. **Login as student**: `teststudent@email.com` / `password123`
3. **Go to Results Page**: http://localhost:3000/student/results
4. **Click "Check Status" button** (top right)
5. **You should now see:**
   - Status changed to: `approved` ✅
   - Updated timestamp
   - "Last checked" time updated

6. **Check Browser Console (F12)**:
   ```
   📡 Fetching application data from API...
   📊 Status from API: approved
   ✅ Application data found: {...}
   ```

7. **Check Server Console**:
   ```
   === FETCH STATUS REQUEST ===
   User email: teststudent@email.com
   Students found: 1
   Current Status: approved
   ```

---

## Test 5: Test Different Statuses

Repeat Test 3 and Test 4 with different statuses:

- ✅ `approved` - Should show green checkmark
- ❌ `rejected` - Should show red X  
- 🔄 `under_review` - Should show blue icon
- ⏱️ `pending` - Should show clock icon

---

## Expected Results

### ✅ Success Indicators:

1. **Admin Update:**
   - Success toast message appears
   - "Update affected rows: 1" in console
   - Status badge changes in admin table

2. **Student Results:**
   - Status updates after clicking "Check Status"
   - "Last checked" timestamp updates
   - Correct icon and color for status
   - Notes from admin are visible (if any)

3. **Database:**
   ```sql
   SELECT email, status, updatedAt FROM student WHERE email = 'teststudent@email.com';
   ```
   Should show the updated status

---

## Common Issues & Solutions

### Issue: "Update affected rows: 0"

**Cause**: Email mismatch

**Solution**:
```sql
-- Check what emails exist in database
SELECT email, firstName, lastName FROM student;

-- Use the EXACT email shown in database
```

### Issue: Status doesn't update on student page

**Cause**: Browser cache

**Solutions**:
1. Click "Check Status" button (forces refresh)
2. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
3. Clear browser cache

### Issue: "No application found"

**Cause**: Student not in database

**Solution**:
- Student must complete signup first
- Check: `SELECT COUNT(*) FROM student;`

### Issue: Database connection error

**Cause**: MySQL not running or wrong credentials

**Solution**:
1. Start MySQL server
2. Check `.env` file has correct credentials
3. Verify: Look for "✅ MySQL (classic) loaded successfully" in console

---

## Quick Verification SQL Queries

```sql
-- 1. Check all students
SELECT email, firstName, lastName, status FROM student;

-- 2. Check specific student
SELECT * FROM student WHERE email = 'teststudent@email.com';

-- 3. Update status directly (for testing)
UPDATE student SET status = 'approved' WHERE email = 'teststudent@email.com';

-- 4. Check last update time
SELECT email, status, updatedAt FROM student WHERE email = 'teststudent@email.com';
```

---

## Success Checklist

- [ ] Student can sign up successfully
- [ ] Student appears in admin applications list
- [ ] Admin can update status successfully
- [ ] "Update affected rows: 1" appears in console
- [ ] Student can see updated status on results page
- [ ] "Check Status" button refreshes data
- [ ] "Last checked" timestamp updates
- [ ] Different statuses show correct icons/colors
- [ ] No console errors in browser or server

---

## If Still Not Working

**Collect these logs and share:**

1. Server console output (both admin update and student fetch)
2. Browser console output (F12) from results page
3. SQL query result: `SELECT * FROM student WHERE email = 'teststudent@email.com';`
4. Screenshot of admin applications page
5. Screenshot of student results page

This will help identify the exact issue!
