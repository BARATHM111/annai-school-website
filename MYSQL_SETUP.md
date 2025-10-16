# MySQL Database Setup Guide

## ✅ Current Status
Your signup system is **ALREADY configured** to use MySQL database! All signup data will be stored in MySQL.

## 📋 Prerequisites

1. **MySQL Server** installed and running
2. **Node.js** installed
3. **MySQL package** installed (`npm install mysql` or `npm install mysql2`)

## 🔧 Setup Steps

### 1. Install MySQL (if not already installed)

**Windows:**
- Download from: https://dev.mysql.com/downloads/mysql/
- Install MySQL Server
- Remember your root password

**Using XAMPP:**
- Download XAMPP from: https://www.apachefriends.org/
- Install and start MySQL service

### 2. Create Database

Open MySQL command line or phpMyAdmin and run:

```sql
CREATE DATABASE annai_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Run Database Setup Script

```bash
# Navigate to project directory
cd C:\Users\Abishek\Desktop\Annai_school

# Run the setup script (creates all tables)
node scripts/setup-mysql.js
```

### 4. Configure Environment Variables

Create `.env` file in project root (copy from `env.example`):

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=annai_school_db

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 5. Test Database Connection

```bash
node scripts/test-mysql-connection.js
```

You should see:
```
✅ Connected to MySQL successfully!
📊 Available tables:
  - student
  - admin
  - newsevent
  - announcement
  - contacts
  - academics
🎉 All tests passed!
```

## 📊 Database Tables Created

### 1. **student** - Stores all user registrations and applications
- id, applicationId, firstName, lastName
- email, mobile, password (hashed)
- dateOfBirth, gender, nationality, bloodGroup
- Father/Mother information
- Address, academic details
- Application status

### 2. **admin** - Admin users
- id, name, email, password, role

### 3. **newsevent** - News and events
- id, title, description, category, imageUrl, date

### 4. **announcement** - Announcements
- id, title, content, published, createdAt

### 5. **contacts** - Contact form submissions
- id, name, email, phone, subject, message, status

### 6. **academics** - Academic programs
- id, title, grades, description, features

## 🔐 How Signup Data is Stored

When a user signs up via `/auth/signup`:

1. **Form Data Collected:**
   - Student name, DOB, gender
   - Email, mobile, password
   - Father/Mother details
   - Class applying for
   - Address

2. **Data Processing:**
   - Password is hashed using bcrypt
   - Unique IDs generated (studentId, applicationId)
   - Email and mobile are validated
   - Duplicate check performed

3. **MySQL Insert:**
   ```javascript
   await query(`INSERT INTO student (...) VALUES (...)`, [...data])
   ```

4. **Storage Location:**
   - MySQL Database: `annai_school_db`
   - Table: `student`
   - All data is properly indexed and secured

## 🧪 Verify Signup is Working

### Test Signup Flow:

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Visit:** http://localhost:3000/auth/signup

3. **Fill the form** with test data

4. **Check MySQL database:**
   ```sql
   USE annai_school_db;
   SELECT id, firstName, lastName, email, mobile, status FROM student;
   ```

You should see your signup data stored!

## 📈 Data Flow Diagram

```
User Signup Form
      ↓
/api/auth/signup
      ↓
Validate Data
      ↓
Hash Password (bcrypt)
      ↓
MySQL INSERT
      ↓
student table
      ↓
Return Success + Auto Sign-In
      ↓
Redirect to Dashboard
```

## 🔍 Troubleshooting

### Error: "connect ECONNREFUSED"
**Solution:** MySQL server is not running
- Start MySQL service
- Check if port 3306 is open

### Error: "Access denied for user"
**Solution:** Wrong credentials
- Check `.env` file DB_USER and DB_PASSWORD
- Verify MySQL user has proper permissions

### Error: "Unknown database"
**Solution:** Database doesn't exist
- Run: `CREATE DATABASE annai_school_db;`
- Or run: `node scripts/setup-mysql.js`

### Error: "Table doesn't exist"
**Solution:** Tables not created
- Run: `node scripts/setup-mysql.js`

## 📦 Backup & Restore

### Backup Database:
```bash
mysqldump -u root -p annai_school_db > backup.sql
```

### Restore Database:
```bash
mysql -u root -p annai_school_db < backup.sql
```

## 🔒 Security Notes

1. **Passwords** are hashed with bcrypt (12 rounds)
2. **SQL Injection** protected via parameterized queries
3. **Duplicate entries** prevented at database level
4. **Session-based** authentication
5. **Role-based** access control (admin vs student)

## 📱 Viewing Data

### Using MySQL Workbench:
1. Install MySQL Workbench
2. Connect to localhost:3306
3. Browse `annai_school_db` database

### Using phpMyAdmin (if using XAMPP):
1. Open http://localhost/phpmyadmin
2. Select `annai_school_db`
3. Browse tables

### Using Command Line:
```bash
mysql -u root -p
USE annai_school_db;
SELECT * FROM student;
```

## ✅ Verification Checklist

- [ ] MySQL server is running
- [ ] Database `annai_school_db` created
- [ ] All tables created (student, admin, etc.)
- [ ] `.env` file configured
- [ ] Test connection passes
- [ ] Can signup new user
- [ ] Data appears in MySQL database
- [ ] Can login with created account

## 🎉 Success!

If all checkpoints pass, your MySQL database is properly set up and **all signup data is being stored in MySQL**!

## 📞 Need Help?

Check the logs:
- Browser console (F12)
- Server terminal output
- MySQL error logs

---

**Created for Annai School Management System**
*Database-backed signup system with MySQL*
