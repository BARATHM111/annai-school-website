# Database Usage Mapping - Annai School Management System

## Overview
This document provides a complete mapping of how the database schema is used throughout the backend codebase. Use this as a reference when planning database changes or migrations.

---

## Current Database Architecture

### Database Implementation Strategy
Your system currently uses a **hybrid approach** with three layers:

1. **JSON File Storage** (`src/lib/database.ts`)
   - File-based storage using JSON files
   - Tables: `profiles.json`, `applications.json`, `students.json`, `enrollments.json`
   - Used for: Profile management, Applications, Student records, Enrollment statistics

2. **MySQL Database** (`src/lib/mysql.ts`)
   - Primary production database
   - Direct SQL queries using `mysql` package
   - Connection pooling and transaction support

3. **Prisma Compatibility Layer** (`src/lib/prisma.ts`)
   - Legacy compatibility stub
   - Redirects to MySQL implementation

---

## Database Schema Files

### 1. PostgreSQL Schema
**File**: `DATABASE_SCHEMA.sql`
- Full PostgreSQL schema with UUID support
- 18 tables covering all modules
- Row Level Security (RLS) policies
- PostgreSQL-specific functions and triggers

### 2. MySQL Schema
**File**: `DATABASE_SCHEMA_MYSQL.sql`
- MySQL-compatible schema
- VARCHAR(36) for IDs
- JSON data types for flexible storage
- Stored procedures and views

---

## Core Database Tables

### User Management Tables

#### 1. **users** table
**Columns**: id, email, password_hash, role, status, email_verified, email_verification_token, password_reset_token, password_reset_expires, last_login, created_at, updated_at

**Used in**:
- `src/lib/auth.ts` - Authentication logic
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth integration
- `src/app/api/auth/signup/route.ts` - User registration
- `src/app/api/admin/profile/route.ts` - Admin profile management

**Operations**:
- INSERT: User registration, admin creation
- SELECT: Authentication, profile lookups
- UPDATE: Password resets, status changes, last login updates

#### 2. **user_profiles** table
**Columns**: id, user_id, first_name, middle_name, last_name, date_of_birth, gender, blood_group, nationality, religion, category, profile_photo, phone, alternate_phone, current_address, permanent_address, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, created_at, updated_at

**Used in**:
- `src/lib/database.ts` - Profile CRUD operations via `profileDb`
- `src/app/api/student/profile/route.ts` - Student profile management
- `src/app/api/admin/profile/route.ts` - Admin profile updates

**Operations**:
- INSERT: Profile creation during signup
- SELECT: Profile retrieval by user_id
- UPDATE: Profile information updates

### Admission Management Tables

#### 3. **applications** table
**Columns**: id, application_id, user_id, status, applying_for_grade, academic_year, personal_info (JSON), contact_info (JSON), parent_info (JSON), academic_info (JSON), additional_info (JSON), documents (JSON), admin_notes, reviewer_id, reviewed_at, submitted_at, created_at, updated_at

**Used in**:
- `src/lib/database.ts` - Application CRUD via `applicationDb`
- `src/app/api/admissions/route.ts` - Application submission
- `src/app/api/admin/applications/route.ts` - Application listing and management
- `src/app/api/admin/applications/[id]/route.ts` - Single application operations
- `src/app/api/admin/update-application-status/route.ts` - Status updates
- `src/app/api/student/application-status/route.ts` - Student viewing their status

**Operations**:
- INSERT: New application submission
- SELECT: List applications, view single application, filter by status
- UPDATE: Status changes, admin notes, reviewer assignment
- DELETE: Application removal

#### 4. **application_status_history** table
**Columns**: id, application_id, status, comment, changed_by, changed_at

**Used in**:
- `src/lib/database.ts` - Status history tracking in `applicationDb.updateApplicationStatus`
- `src/app/api/admin/update-application-status/route.ts` - Recording status changes

**Operations**:
- INSERT: Each status change creates a history record
- SELECT: Viewing application history

#### 5. **form_configurations** table
**Columns**: id, field_name, field_label, field_type, is_required, is_visible, placeholder, help_text, options (JSON), validation_rules (JSON), display_order, section, created_at, updated_at

**Used in**:
- `src/app/api/admin/form-config/route.ts` - Dynamic form field management
- Frontend form rendering (dynamically)

**Operations**:
- SELECT: Load form configuration
- INSERT/UPDATE: Admin configuring form fields

### Student Management Tables

#### 6. **students** table (MySQL) / **student** table (current implementation)
**Columns**: id, student_id, user_id, application_id, current_grade, section, roll_number, academic_year, enrollment_date, status, status_reason, status_updated_at, father_name, father_occupation, father_mobile, father_email, mother_name, mother_occupation, mother_mobile, mother_email, guardian_name, guardian_contact, previous_school, previous_class, previous_board, previous_percentage, created_at, updated_at, created_by

**Used in**:
- `src/lib/database.ts` - Student CRUD via `studentDb`
- `src/app/api/admin/students/route.ts` - Student listing and creation
- `src/app/api/admin/students/[id]/route.ts` - Single student operations
- `src/app/api/admin/migrate-approved-students/route.ts` - Converting applications to students
- `src/app/api/admin/dashboard/route.ts` - Dashboard statistics
- `src/app/api/auth/signup/route.ts` - Creating student records on signup

**Current MySQL Columns** (slightly different):
- id, applicationId, firstName, middleName, lastName, email, mobile, dateOfBirth, gender, bloodGroup, nationality, religion, category, password, photoUrl, currentAddress, permanentAddress, fatherName, fatherOccupation, fatherMobile, fatherEmail, motherName, motherOccupation, motherMobile, motherEmail, guardianName, guardianContact, previousSchool, previousClass, board, applyingForGrade, previousPercentage, birthCertUrl, marksheetUrl, transferCertUrl, aadharCardUrl, specialNeeds, interests, hearAboutUs, status, notes, appliedAt, createdAt, updatedAt

**Operations**:
- INSERT: Creating student records (from approved applications or manual entry)
- SELECT: Student listing, search, filtering by grade/year/status
- UPDATE: Student information updates, status changes
- DELETE: Student removal

#### 7. **student_documents** table
**Columns**: id, student_id, document_type, document_name, document_url, is_verified, verified_by, verified_at, verification_notes, uploaded_at

**Used in**:
- `src/lib/database.ts` - Document verification via `studentDb.verifyDocument`
- `src/app/api/admin/students/[id]/verify-document/route.ts` - Document verification

**Operations**:
- INSERT: Uploading documents
- SELECT: Listing student documents
- UPDATE: Verification status updates

### Academic Management Tables

#### 8. **academic_years** table
**Columns**: id, year, start_date, end_date, is_current, status, created_at

**Operations**:
- SELECT: Get current academic year
- INSERT: Create new academic year

#### 9. **grades** table
**Columns**: id, grade_name, grade_level, description, is_active, created_at

**Operations**:
- SELECT: List available grades for forms
- Used in dropdown selections throughout the system

#### 10. **sections** table
**Columns**: id, grade_id, section_name, capacity, class_teacher_id, is_active, created_at

**Operations**:
- SELECT: List sections for a grade
- INSERT: Create new sections

#### 11. **enrollments** table
**Columns**: id, student_id, academic_year_id, grade_id, section_id, enrollment_date, status, created_at

**Used in**:
- `src/lib/database.ts` - Enrollment tracking via `enrollmentDb`
- `src/app/api/admin/enrollments/route.ts` - Enrollment statistics

**Operations**:
- INSERT: Record enrollments
- SELECT: Statistics, reports

#### 12. **academics** table (custom)
**Current MySQL table for academic programs**
**Columns**: id, title, grades, description, features, displayOrder, published, createdAt, updatedAt

**Used in**:
- `src/app/api/admin/academics/route.ts` - CRUD operations
- `src/app/api/admin/academics/[id]/route.ts` - Single program operations
- `src/app/api/academics/route.ts` - Public listing

**Operations**:
- INSERT: Create academic programs
- SELECT: List programs
- UPDATE: Modify programs
- DELETE: Remove programs

### Content Management Tables

#### 13. **news** table / **newsevent** table (current implementation)
**Columns**: id, title, description, content, image_url, status, publish_date, author_id, views, is_featured, created_at, updated_at

**Current MySQL**: id, title, description, category, imageUrl, published, date, createdAt, updatedAt

**Used in**:
- `src/app/api/admin/news/route.ts` - News CRUD operations
- `src/app/api/admin/news/[id]/route.ts` - Single news operations
- `src/app/api/news/route.ts` - Public news listing

**Operations**:
- INSERT: Create news items
- SELECT: List news (with filtering by status)
- UPDATE: Edit news, publish/unpublish
- DELETE: Remove news

#### 14. **announcement** table (custom MySQL table)
**Columns**: id, title, content, published, createdAt, updatedAt

**Used in**:
- MySQL helper functions in `src/lib/mysql.ts`
- Announcement display on public pages

**Operations**:
- INSERT: Create announcements
- SELECT: List announcements
- UPDATE: Edit announcements
- DELETE: Remove announcements

#### 15. **carousel_images** table
**Columns**: id, title, description, image_url, link_url, display_order, is_active, created_at, updated_at

**Used in**:
- `src/app/api/carousel/route.ts` - Carousel management

**Operations**:
- INSERT: Add carousel images
- SELECT: List active images
- UPDATE: Reorder, activate/deactivate
- DELETE: Remove images

#### 16. **about_content** table
**Columns**: id, section, title, content, image_url, display_order, is_visible, created_at, updated_at

**Used in**:
- `src/app/api/about/route.ts` - About page content management

**Operations**:
- SELECT: Get about page sections
- UPDATE: Edit sections

### Contact & Communication Tables

#### 17. **contacts** table (custom MySQL table)
**Columns**: id, name, email, phone, subject, message, status, createdAt, updatedAt

**Used in**:
- `src/app/api/contact/route.ts` - Contact form submissions
- `src/app/api/admin/contacts/route.ts` - Admin viewing contacts
- `src/app/api/admin/contacts/[id]/route.ts` - Single contact operations

**Operations**:
- INSERT: New contact form submission
- SELECT: List contacts
- UPDATE: Change status (e.g., 'new' → 'read' → 'responded')
- DELETE: Remove old contacts

### System Tables

#### 18. **file_uploads** table
**Columns**: id, original_name, file_name, file_path, file_size, mime_type, upload_type, uploaded_by, related_entity_type, related_entity_id, is_public, created_at

**Used in**:
- `src/app/api/upload/route.ts` - File upload tracking

**Operations**:
- INSERT: Track file uploads
- SELECT: List files by entity

#### 19. **system_settings** table
**Columns**: id, setting_key, setting_value, setting_type, description, is_public, created_at, updated_at

**Operations**:
- SELECT: Get system configuration
- UPDATE: Change settings

#### 20. **audit_logs** table
**Columns**: id, user_id, action, entity_type, entity_id, old_values (JSON), new_values (JSON), ip_address, user_agent, created_at

**Operations**:
- INSERT: Log important actions
- SELECT: View audit trail

#### 21. **admin** table (custom MySQL table)
**Columns**: id, name, email, password, role, createdAt

**Used in**:
- `src/lib/mysql.ts` - Admin authentication helper functions

**Operations**:
- SELECT: Admin login verification
- INSERT: Create admin accounts

---

## Backend Files Using Database

### Database Implementation Files

#### 1. `src/lib/database.ts` (540 lines)
**Purpose**: JSON file-based database implementation
**Exports**:
- `profileDb` - Profile operations (getProfile, upsertProfile, updateProfilePhoto)
- `applicationDb` - Application operations (getApplication, createApplication, updateApplicationStatus, getAllApplications, updateApplication, deleteApplication)
- `studentDb` - Student operations (createStudent, getStudent, getStudentByEmail, getAllStudents, getStudentsByYear, getStudentsByGrade, getStudentsByStatus, updateStudent, verifyDocument, updateStudentStatus, deleteStudent, searchStudents)
- `enrollmentDb` - Enrollment statistics (addEnrollment, getEnrollmentByYear, getAllEnrollments, getStatistics)
- Helper functions: readApplications, writeApplications

#### 2. `src/lib/mysql.ts` (434 lines)
**Purpose**: MySQL database implementation
**Exports**:
- `Database` class - Core database operations
- `db` - Singleton database instance
- `query()` - Convenience query function
- `dbHelpers` - Helper functions for common operations:
  - `generateApplicationId()` - Generate APP202X#### format IDs
  - `generateId()` - Generate unique IDs
  - `getAdminByEmail()` - Admin authentication
  - `createAdmin()` - Create admin accounts
  - `getStudentByEmail()` - Student lookup
  - `getStudentByApplicationId()` - Student lookup by app ID
  - `getAllStudents()` - List all students
  - `createApplication()` - Create application record
  - `updateApplicationStatus()` - Update status
  - `deleteApplication()` - Remove application
  - `getAllNews()` - List news items
  - `getPublishedNews()` - List published news
  - `createNews()` - Create news
  - `updateNews()` - Update news
  - `deleteNews()` - Delete news
  - `getAllAnnouncements()` - List announcements
  - `getPublishedAnnouncements()` - List published announcements
  - `createAnnouncement()` - Create announcement
  - `updateAnnouncement()` - Update announcement
  - `deleteAnnouncement()` - Delete announcement
  - `getUserProfile()` - Get user profile
  - `updateUserProfile()` - Update user profile

#### 3. `src/lib/prisma.ts` (40 lines)
**Purpose**: Legacy compatibility layer
**Exports**:
- `prisma` - Stub Prisma client (non-functional)
- `handlePrismaError()` - MySQL error handler
- `generateApplicationId()` - Wrapper for dbHelpers
- `generateStudentId()` - Wrapper for dbHelpers
- `disconnectPrisma()` - No-op function

#### 4. `src/lib/auth.ts` (2551 bytes)
**Purpose**: NextAuth configuration
**Database Usage**:
- Uses `admin` table for admin authentication
- Uses `student` table for student authentication
- Credentials provider implementation

---

## API Routes and Database Usage

### Authentication Routes

#### `src/app/api/auth/[...nextauth]/route.ts`
**Tables**: admin, student
**Operations**: SELECT (authentication)

#### `src/app/api/auth/signup/route.ts`
**Tables**: student
**Operations**:
- SELECT: Check existing email/mobile
- INSERT: Create new student record with application

### Student Routes

#### `src/app/api/student/profile/route.ts`
**Tables**: student
**Operations**:
- GET: SELECT student by email
- PUT: UPDATE student profile data

#### `src/app/api/student/application-status/route.ts`
**Tables**: student
**Operations**:
- GET: SELECT application status by email

### Admin - Application Management

#### `src/app/api/admin/applications/route.ts`
**Tables**: student (acting as applications table)
**Operations**:
- GET: SELECT all applications with filtering, pagination
- PUT: UPDATE application data
- DELETE: DELETE application

#### `src/app/api/admin/applications/[id]/route.ts`
**Tables**: student
**Operations**:
- GET: SELECT single application
- PATCH: UPDATE application status
- DELETE: DELETE application

#### `src/app/api/admin/update-application-status/route.ts`
**Tables**: student
**Operations**:
- POST: UPDATE status field

### Admin - Student Management

#### `src/app/api/admin/students/route.ts`
**Tables**: student
**Operations**:
- GET: SELECT students with filters (search, grade, status, year)
- POST: INSERT new student record

#### `src/app/api/admin/students/[id]/route.ts`
**Tables**: student
**Operations**:
- GET: SELECT single student
- PUT: UPDATE student information
- DELETE: DELETE student

#### `src/app/api/admin/students/[id]/verify-document/route.ts`
**Tables**: student, student_documents
**Operations**:
- POST: UPDATE document verification status

#### `src/app/api/admin/migrate-approved-students/route.ts`
**Tables**: student
**Operations**:
- POST: SELECT approved applications, UPDATE to student status

### Admin - Dashboard & Statistics

#### `src/app/api/admin/dashboard/route.ts`
**Tables**: student
**Operations**:
- GET: Multiple COUNT queries for statistics
  - Total applications
  - Pending applications
  - Approved applications
  - Rejected applications
  - Recent applications (LIMIT 5)

#### `src/app/api/admin/enrollments/route.ts`
**Tables**: student, enrollments
**Operations**:
- GET: SELECT enrollment statistics by year/grade

### Admin - Content Management

#### `src/app/api/admin/news/route.ts`
**Tables**: newsevent
**Operations**:
- GET: SELECT all news
- POST: INSERT new news item

#### `src/app/api/admin/news/[id]/route.ts`
**Tables**: newsevent
**Operations**:
- GET: SELECT single news
- PUT: UPDATE news item
- DELETE: DELETE news item

#### `src/app/api/admin/academics/route.ts`
**Tables**: academics
**Operations**:
- GET: SELECT all academic programs
- POST: INSERT new academic program

#### `src/app/api/admin/academics/[id]/route.ts`
**Tables**: academics
**Operations**:
- GET: SELECT single program
- PUT: UPDATE program
- DELETE: DELETE program

### Admin - Contact Management

#### `src/app/api/admin/contacts/route.ts`
**Tables**: contacts
**Operations**:
- GET: SELECT all contacts

#### `src/app/api/admin/contacts/[id]/route.ts`
**Tables**: contacts
**Operations**:
- GET: SELECT single contact
- PUT: UPDATE contact (e.g., mark as read)
- DELETE: DELETE contact

### Public Routes

#### `src/app/api/contact/route.ts`
**Tables**: contacts
**Operations**:
- POST: INSERT new contact submission

#### `src/app/api/news/route.ts`
**Tables**: newsevent
**Operations**:
- GET: SELECT published news

#### `src/app/api/academics/route.ts`
**Tables**: academics
**Operations**:
- GET: SELECT published academic programs

#### `src/app/api/carousel/route.ts`
**Tables**: carousel_images
**Operations**:
- GET: SELECT active carousel images

#### `src/app/api/about/route.ts`
**Tables**: about_content
**Operations**:
- GET: SELECT about page sections

### Admin - Profile & Settings

#### `src/app/api/admin/profile/route.ts`
**Tables**: admin, student
**Operations**:
- GET: SELECT admin profile
- PUT: UPDATE admin profile

#### `src/app/api/admin/change-password/route.ts`
**Tables**: admin
**Operations**:
- POST: UPDATE password field

#### `src/app/api/admin/reset-password/route.ts`
**Tables**: admin
**Operations**:
- POST: UPDATE password field

---

## Database Schema Discrepancies

### Schema vs Implementation Differences

Your defined schemas (PostgreSQL and MySQL) differ from the current MySQL implementation:

**Defined Schema Tables** (not yet implemented):
1. users
2. user_profiles
3. applications
4. application_status_history
5. students
6. student_documents
7. academic_years
8. grades
9. sections
10. enrollments
11. form_configurations
12. news
13. carousel_images
14. about_content
15. file_uploads
16. system_settings
17. audit_logs

**Current MySQL Tables** (actually being used):
1. student (combining users, profiles, applications, students into one table)
2. admin
3. newsevent
4. announcement
5. academics
6. contacts

**Key Differences**:
- Current implementation uses a **denormalized approach** with `student` table containing all user, profile, application, and student data
- Schema defines **normalized tables** with proper relationships
- Current implementation is **simpler but less flexible**
- Schema design is **more scalable and follows best practices**

---

## Critical Database Patterns

### 1. ID Generation Pattern
```javascript
// Application ID: APP2024XXXXXX
const applicationId = `APP${new Date().getFullYear()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

// Student ID: STUXXXXXXXXXX
const studentId = `STU${Date.now()}`

// Generic ID: entity + timestamp
const id = `PREFIX${Date.now()}`
```

### 2. Status Management Pattern
**Application/Student Status Values**:
- `pending` / `submitted` - Initial state
- `under_review` / `reviewing` - Being reviewed
- `approved` - Accepted
- `rejected` - Denied
- `active` - Enrolled student
- `inactive` - Inactive student
- `graduated` - Completed
- `transferred` - Left school
- `dropped` - Dropped out

### 3. Query Patterns

**Filtering Pattern**:
```javascript
let sql = 'SELECT * FROM table WHERE 1=1'
const params = []

if (filter1) {
  sql += ' AND column1 = ?'
  params.push(filter1)
}

const results = await query(sql, params)
```

**Pagination Pattern**:
```javascript
const page = parseInt(searchParams.get('page') || '1')
const limit = parseInt(searchParams.get('limit') || '10')
const offset = (page - 1) * limit

// Then slice in-memory or use LIMIT/OFFSET in SQL
```

### 4. Date Handling Pattern
```javascript
// Convert to MySQL date format
const date = new Date(dateOfBirth)
const formattedDate = date.toISOString().split('T')[0] // YYYY-MM-DD
```

---

## Migration Recommendations

### If Changing Database:

1. **Map Current `student` Table Fields**
   - Determine which fields go to `users`
   - Determine which fields go to `user_profiles`
   - Determine which fields go to `applications`
   - Determine which fields go to `students`

2. **Create Migration Scripts**
   - Data transformation logic
   - Preserve all existing data
   - Handle NULL values appropriately

3. **Update These Files First** (Core Database Layer):
   - `src/lib/database.ts` - If keeping file-based approach
   - `src/lib/mysql.ts` - Update queries to match new schema
   - `src/lib/auth.ts` - Update authentication logic

4. **Update API Routes** (In this order):
   - Authentication routes first
   - Student routes
   - Admin application routes
   - Admin student routes
   - Content management routes
   - Public routes last

5. **Test Critical Paths**:
   - User signup → application creation
   - Admin login → dashboard
   - Application approval → student creation
   - Student profile updates
   - Document uploads and verification

6. **Data Migration Strategy**:
   ```sql
   -- Example migration from student table to normalized schema
   INSERT INTO users (email, role, status)
   SELECT email, 'student', status FROM student;
   
   INSERT INTO user_profiles (user_id, first_name, last_name, ...)
   SELECT u.id, s.firstName, s.lastName, ...
   FROM student s
   JOIN users u ON s.email = u.email;
   ```

---

## Quick Reference

### Tables by Module

**Authentication**: users, admin
**Profile**: user_profiles
**Applications**: applications, application_status_history, form_configurations
**Students**: students, student_documents
**Academic**: academic_years, grades, sections, enrollments, academics
**Content**: news/newsevent, announcement, carousel_images, about_content
**Communication**: contacts
**System**: file_uploads, system_settings, audit_logs

### Most Frequently Used Tables
1. **student** (current) - Used in ~20 API routes
2. **newsevent** - Used in ~5 routes
3. **academics** - Used in ~4 routes
4. **contacts** - Used in ~3 routes
5. **admin** - Used in authentication

### Database Operations by Frequency
- **SELECT**: ~90% of operations (listing, filtering, searching)
- **UPDATE**: ~5% of operations (status changes, profile updates)
- **INSERT**: ~3% of operations (creating records)
- **DELETE**: ~2% of operations (removing records)

---

## Conclusion

Your current implementation uses a **simplified, denormalized MySQL schema** focused on rapid development, while your documented schemas represent a **normalized, production-ready design**. 

**Before changing the database:**
1. Decide whether to keep the simple approach or migrate to normalized schema
2. Map all fields from current tables to new tables
3. Create comprehensive migration scripts
4. Update all 21+ API routes that use the database
5. Test thoroughly with real data

**Key files to update** when changing database:
- `src/lib/database.ts` or `src/lib/mysql.ts` (core layer)
- All files in `src/app/api/` directories (21+ files)
- `src/lib/auth.ts` (authentication)

This document should give you a complete picture of database usage for planning your migration.
