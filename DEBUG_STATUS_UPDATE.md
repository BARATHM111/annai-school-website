# Debug Status Update Issue

## How to Test Status Updates

Follow these steps to debug why status updates aren't reflecting:

### Step 1: Update Status as Admin

1. **Login as Admin** (`admin@annaischool.edu` / `admin123`)
2. **Go to Applications page** (`/admin/applications`)
3. **Find a student** and click the status update button
4. **Change the status** (e.g., pending → approved)
5. **Click Save**

### Step 2: Check Server Console

**Look for these logs in your terminal:**

```
=== UPDATE STATUS REQUEST ===
Email: student@email.com
Status: approved
Notes: Status updated to approved
Existing student found: true
Current status: pending
Update affected rows: 1
✅ Student status updated for student@email.com: approved
```

**What to check:**
- ✅ Does "Existing student found" show `true`?
- ✅ Does "Update affected rows" show `1`?
- ❌ If "Update affected rows" shows `0`, the email doesn't match any student in database

### Step 3: Check Database Directly

**Run this SQL query:**

```sql
SELECT email, firstName, lastName, status, updatedAt 
FROM student 
WHERE email = 'student@email.com';
```

**What to verify:**
- Is the status updated in the database?
- What is the `updatedAt` timestamp?

### Step 4: Check Student Results Page

1. **Login as the student** (use the email from step 1)
2. **Go to Results page** (`/student/results`)
3. **Refresh the page** (F5 or Ctrl+R)

### Step 5: Check Browser Console and Server Console

**Browser Console (F12):**
```
📡 Fetching application data from API... (1234567890)
📊 API Response: {...}
📊 Status from API: approved
📊 Last Updated: 2025-10-10...
✅ Application data found: {...}
```

**Server Console (Terminal):**
```
=== FETCH STATUS REQUEST ===
User email: student@email.com
Students found: 1
Student ID: STU123...
Current Status: approved
Last Updated: 2025-10-10...
Application found: APP2025... approved
```

### Common Issues

#### Issue 1: Email Mismatch
**Symptom:** "Update affected rows: 0"

**Solution:**
- Check if the email in admin panel matches the email in the database
- Verify with: `SELECT email FROM student;`

#### Issue 2: Student Not in Database
**Symptom:** "Existing student found: false"

**Solution:**
- The student needs to sign up first using `/auth/signup`
- Check with: `SELECT COUNT(*) FROM student;`

#### Issue 3: Browser Cache
**Symptom:** Status shows old value

**Solution:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- The timestamp parameter should prevent this: `?t=1234567890`

#### Issue 4: Database Connection
**Symptom:** "MySQL query error" or "Database not connected"

**Solution:**
- Check if MySQL is running
- Verify credentials in `.env` file
- Check console for: `✅ MySQL (classic) loaded successfully`

### Expected Flow

```
Admin Panel                  MySQL Database              Student Results
    ↓                              ↓                           ↓
Update Status  ────────→    UPDATE student         ←────  Fetch Status
to "approved"               SET status='approved'        GET student info
                            WHERE email='...'             
    ↓                              ↓                           ↓
Success Message             Status Changed               Shows "approved"
```

### Still Not Working?

**Collect this information:**

1. **Admin update logs** from server console
2. **Student fetch logs** from server console  
3. **Database query result:**
   ```sql
   SELECT email, status, updatedAt FROM student WHERE email = 'the-email';
   ```
4. **Browser console logs** from student results page

**Share these logs to get help debugging!**
