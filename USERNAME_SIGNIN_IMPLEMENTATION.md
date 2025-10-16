# Username-Based Sign-In Implementation for Students

## Overview
Students will now sign in using a **username** instead of an email address, as young students typically don't have personal email accounts. Admins continue to use email for sign-in.

---

## Changes Made

### 1. **Database Schema Update**
- **File**: `scripts/add-username-to-student.sql`
- Added `username` column to `student_application_form` table
- Username is unique and indexed for fast lookups
- **Action Required**: Run this SQL script on your database
  ```bash
  mysql -u root -p annai_school < scripts/add-username-to-student.sql
  ```

### 2. **Authentication Logic**
- **File**: `src/lib/auth.ts`
- Changed credential field from `email` to `identifier`
- Students authenticate using **username**
- Admins authenticate using **email** (detected by presence of '@' symbol)
- Updated query to fetch student by username instead of email
- Added username to user session and JWT token

### 3. **TypeScript Types**
- **File**: `src/types/next-auth.d.ts`
- Added `username?: string` to User, Session, and JWT interfaces
- Ensures type safety across the application

### 4. **Sign-In Page**
- **File**: `src/app/auth/signin/page.tsx`
- Changed form field from `email` to `identifier`
- **Students see**: "Username" field with placeholder "Enter your username"
- **Admins see**: "Email Address" field with placeholder "Enter your email"
- Updated validation:
  - Students: Just checks if username is entered
  - Admins: Validates email format
- Form dynamically adjusts based on selected portal (Student/Admin)

### 5. **Sign-Up Process**
- **File**: `src/app/api/auth/signup/route.ts`
- Automatically generates unique username during registration
- **Username Format**: `firstname.lastname.XXXX`
  - Example: `john.doe.5432`
  - Uses 4-digit random number to ensure uniqueness
  - Automatically regenerates if username already exists
- Returns generated username in response
- Stores username in database

### 6. **Success Message**
- **File**: `src/components/forms/DynamicAdmissionForm.tsx`
- After successful signup, displays generated username
- Toast message: "Your username is: [username]. Please use this to sign in."
- Username is shown for 5 seconds before redirect

### 7. **Database Helper Functions**
- **File**: `src/lib/mysql.ts`
- Added `getStudentByUsername(username: string)` function
- Maintains existing `getStudentByEmail()` for other operations

---

## How It Works

### For Students (Sign Up):
1. Student fills out admission/signup form
2. System automatically generates username from first name and last name
   - Example: "Ravi Kumar" → `ravi.kumar.3847`
3. Success message displays the generated username
4. Student is redirected to sign-in page

### For Students (Sign In):
1. Select "Student" portal
2. Enter username (not email)
3. Enter password
4. Sign in successful → redirected to student dashboard

### For Admins (Sign In):
1. Select "Admin" portal
2. Enter email address
3. Enter password
4. Sign in successful → redirected to admin dashboard

---

## Next Steps

### Required Actions:
1. **Run the database migration**:
   ```bash
   mysql -u root -p annai_school < scripts/add-username-to-student.sql
   ```

2. **Generate usernames for existing students**:
   ```sql
   -- Example SQL to generate usernames for existing students
   UPDATE student_application_form 
   SET username = CONCAT(
     LOWER(firstName), 
     '.', 
     LOWER(COALESCE(lastName, '')),
     '.',
     FLOOR(1000 + RAND() * 9000)
   )
   WHERE username IS NULL;
   ```

3. **Test the implementation**:
   - Create a new student account via sign-up
   - Note the generated username
   - Sign out and sign in using the username

### Optional Enhancements:
1. **Email notifications**: Send email with username to parents/guardians
2. **Username recovery**: Add feature to retrieve forgotten username via email or mobile
3. **Custom usernames**: Allow students to customize their username after first login
4. **Admin panel**: Add interface for admins to view/reset student usernames

---

## Important Notes

- **Admins**: Continue using email for sign-in (backward compatible)
- **Students**: Must use username (generated during signup)
- **Username uniqueness**: Ensured by database constraint and generation logic
- **Case-insensitive**: Usernames are stored and matched in lowercase
- **Security**: Password requirements remain the same (min 8 characters)

---

## Troubleshooting

### Issue: Student can't sign in
- **Check**: Is username column added to database?
- **Check**: Does the student have a username in the database?
- **Fix**: Run the migration script and generate usernames

### Issue: Username generation fails
- **Check**: Database connection is working
- **Check**: `student_application_form` table exists
- **Fix**: Ensure all dependencies are installed and database is accessible

### Issue: Duplicate username error
- **Check**: Username generation logic includes random suffix
- **Fix**: The system automatically regenerates on collision, but you can manually update in database

---

## Files Modified

```
✅ scripts/add-username-to-student.sql (NEW)
✅ src/lib/auth.ts
✅ src/lib/mysql.ts
✅ src/types/next-auth.d.ts
✅ src/app/auth/signin/page.tsx
✅ src/app/api/auth/signup/route.ts
✅ src/components/forms/DynamicAdmissionForm.tsx
```

---

## Testing Checklist

- [ ] Database migration executed successfully
- [ ] New student registration generates username
- [ ] Username is displayed in success message
- [ ] Student can sign in using username
- [ ] Admin can still sign in using email
- [ ] Portal selector correctly shows "Username" for students
- [ ] Portal selector correctly shows "Email" for admins
- [ ] Username validation works (doesn't require @ symbol)
- [ ] Email validation works for admin login
- [ ] Existing students have usernames assigned

---

**Implementation Date**: January 2025
**Status**: ✅ Complete - Ready for Testing
