# Database Tables Quick Reference

## Current MySQL Tables (Actually Used in Code)

| Table Name | Primary Purpose | API Routes Using It | Key Operations |
|------------|----------------|---------------------|----------------|
| **student** | Stores all student/application data (denormalized) | 20+ routes | SELECT, INSERT, UPDATE, DELETE |
| **admin** | Admin user authentication | auth routes, admin/profile | SELECT, INSERT, UPDATE |
| **newsevent** | News and events | admin/news, news | SELECT, INSERT, UPDATE, DELETE |
| **announcement** | School announcements | (via mysql helpers) | SELECT, INSERT, UPDATE, DELETE |
| **academics** | Academic programs | admin/academics, academics | SELECT, INSERT, UPDATE, DELETE |
| **contacts** | Contact form submissions | contact, admin/contacts | SELECT, INSERT, UPDATE, DELETE |

---

## Planned Schema Tables (Defined but Not Implemented)

### Core Tables

| Table Name | Status | Purpose | Relationships |
|------------|--------|---------|---------------|
| **users** | ❌ Not Implemented | Authentication & roles | → user_profiles, applications, students |
| **user_profiles** | ❌ Not Implemented | Detailed user info | users → |
| **applications** | ❌ Not Implemented | Admission applications | users → , → students |
| **application_status_history** | ❌ Not Implemented | Track status changes | applications → |
| **students** | ❌ Not Implemented | Enrolled students | users →, applications → |
| **student_documents** | ❌ Not Implemented | Document verification | students → |

### Academic Tables

| Table Name | Status | Purpose | Relationships |
|------------|--------|---------|---------------|
| **academic_years** | ❌ Not Implemented | Academic year management | → enrollments |
| **grades** | ❌ Not Implemented | Grade/class definitions | → sections, enrollments |
| **sections** | ❌ Not Implemented | Sections within grades | grades →, users → (teacher) |
| **enrollments** | ❌ Not Implemented | Student-year-grade tracking | students →, academic_years →, grades → |

### Content Tables

| Table Name | Status | Purpose | Relationships |
|------------|--------|---------|---------------|
| **news** | ❌ Not Implemented | News articles | users → (author) |
| **carousel_images** | ❌ Not Implemented | Homepage carousel | - |
| **about_content** | ❌ Not Implemented | About page sections | - |
| **form_configurations** | ❌ Not Implemented | Dynamic form builder | - |

### System Tables

| Table Name | Status | Purpose | Relationships |
|------------|--------|---------|---------------|
| **file_uploads** | ❌ Not Implemented | File tracking | users → (uploader) |
| **system_settings** | ❌ Not Implemented | App configuration | - |
| **audit_logs** | ❌ Not Implemented | Activity logging | users → |

---

## Current vs Planned Mapping

### student Table (Current) → Multiple Tables (Planned)

| Current Field (student) | Maps To Table | Maps To Field |
|------------------------|---------------|---------------|
| email | users | email |
| password | users | password_hash |
| status | users/students | status |
| firstName | user_profiles | first_name |
| middleName | user_profiles | middle_name |
| lastName | user_profiles | last_name |
| dateOfBirth | user_profiles | date_of_birth |
| gender | user_profiles | gender |
| bloodGroup | user_profiles | blood_group |
| nationality | user_profiles | nationality |
| religion | user_profiles | religion |
| category | user_profiles | category |
| phone/mobile | user_profiles | phone |
| photoUrl | user_profiles | profile_photo |
| currentAddress | user_profiles | current_address |
| permanentAddress | user_profiles | permanent_address |
| applicationId | applications | application_id |
| applyingForGrade | applications | applying_for_grade |
| appliedAt | applications | submitted_at |
| notes | applications | admin_notes |
| fatherName | applications/students | parent_info JSON / father_name |
| motherName | applications/students | parent_info JSON / mother_name |
| fatherMobile | applications/students | parent_info JSON / father_mobile |
| fatherEmail | applications/students | parent_info JSON / father_email |
| motherMobile | applications/students | parent_info JSON / mother_mobile |
| motherEmail | applications/students | parent_info JSON / mother_email |
| guardianName | applications/students | parent_info JSON / guardian_name |
| guardianContact | applications/students | parent_info JSON / guardian_contact |
| previousSchool | applications/students | academic_info JSON / previous_school |
| previousClass | applications/students | academic_info JSON / previous_class |
| board | applications/students | academic_info JSON / previous_board |
| previousPercentage | applications/students | academic_info JSON / previous_percentage |
| birthCertUrl | applications | documents JSON |
| marksheetUrl | applications | documents JSON |
| transferCertUrl | applications | documents JSON |
| aadharCardUrl | applications | documents JSON |
| specialNeeds | applications | additional_info JSON |
| interests | applications | additional_info JSON |
| hearAboutUs | applications | additional_info JSON |
| id | students | student_id |
| status (active) | students | status |
| createdAt | students | enrollment_date |

---

## API Routes by Database Table

### Routes Using `student` Table

| Route | HTTP Method | Operations |
|-------|-------------|------------|
| `/api/auth/signup` | POST | INSERT (create student) |
| `/api/student/profile` | GET, PUT | SELECT, UPDATE |
| `/api/student/application-status` | GET | SELECT |
| `/api/admin/applications` | GET, PUT, DELETE | SELECT (all), UPDATE, DELETE |
| `/api/admin/applications/[id]` | GET, PATCH, DELETE | SELECT (one), UPDATE, DELETE |
| `/api/admin/update-application-status` | POST | UPDATE status |
| `/api/admin/students` | GET, POST | SELECT (filtered), INSERT |
| `/api/admin/students/[id]` | GET, PUT, DELETE | SELECT (one), UPDATE, DELETE |
| `/api/admin/dashboard` | GET | SELECT COUNT(*), aggregations |
| `/api/admin/migrate-approved-students` | POST | SELECT, UPDATE |
| `/api/admin/profile` | GET, PUT | SELECT, UPDATE |

### Routes Using `newsevent` Table

| Route | HTTP Method | Operations |
|-------|-------------|------------|
| `/api/news` | GET | SELECT (published) |
| `/api/admin/news` | GET, POST | SELECT (all), INSERT |
| `/api/admin/news/[id]` | GET, PUT, DELETE | SELECT (one), UPDATE, DELETE |

### Routes Using `academics` Table

| Route | HTTP Method | Operations |
|-------|-------------|------------|
| `/api/academics` | GET | SELECT (published) |
| `/api/admin/academics` | GET, POST | SELECT (all), INSERT |
| `/api/admin/academics/[id]` | GET, PUT, DELETE | SELECT (one), UPDATE, DELETE |

### Routes Using `contacts` Table

| Route | HTTP Method | Operations |
|-------|-------------|------------|
| `/api/contact` | POST | INSERT |
| `/api/admin/contacts` | GET | SELECT (all) |
| `/api/admin/contacts/[id]` | GET, PUT, DELETE | SELECT (one), UPDATE, DELETE |

### Routes Using `admin` Table

| Route | HTTP Method | Operations |
|-------|-------------|------------|
| `/api/auth/[...nextauth]` | POST | SELECT (auth) |
| `/api/admin/profile` | GET, PUT | SELECT, UPDATE |
| `/api/admin/change-password` | POST | UPDATE password |
| `/api/admin/reset-password` | POST | UPDATE password |

---

## Database Layer Files

| File | Purpose | Tables/Functions | Usage |
|------|---------|------------------|--------|
| `src/lib/database.ts` | JSON file storage | profiles, applications, students, enrollments | Used by some API routes, JSON-based |
| `src/lib/mysql.ts` | MySQL connection | All MySQL tables | Direct SQL queries, connection pooling |
| `src/lib/prisma.ts` | Legacy stub | None (redirects to mysql) | Compatibility layer |
| `src/lib/auth.ts` | NextAuth config | admin, student | Authentication logic |

---

## Database Operations by Type

### INSERT Operations (Creating Records)

| What | Where | Table |
|------|-------|-------|
| New student signup | `/api/auth/signup` | student |
| New application | `/api/admin/applications` | student |
| New student (manual) | `/api/admin/students` | student |
| New news item | `/api/admin/news` | newsevent |
| New academic program | `/api/admin/academics` | academics |
| New contact form | `/api/contact` | contacts |

### SELECT Operations (Reading Records)

| What | Where | Table |
|------|-------|-------|
| Student login | `/api/auth/[...nextauth]` | student |
| Admin login | `/api/auth/[...nextauth]` | admin |
| List applications | `/api/admin/applications` | student |
| List students | `/api/admin/students` | student |
| Dashboard stats | `/api/admin/dashboard` | student |
| Student profile | `/api/student/profile` | student |
| List news | `/api/admin/news`, `/api/news` | newsevent |
| List programs | `/api/admin/academics`, `/api/academics` | academics |
| List contacts | `/api/admin/contacts` | contacts |

### UPDATE Operations (Modifying Records)

| What | Where | Table |
|------|-------|-------|
| Application status | `/api/admin/update-application-status` | student |
| Student info | `/api/admin/students/[id]` | student |
| Student profile | `/api/student/profile` | student |
| News item | `/api/admin/news/[id]` | newsevent |
| Academic program | `/api/admin/academics/[id]` | academics |
| Admin password | `/api/admin/change-password` | admin |
| Contact status | `/api/admin/contacts/[id]` | contacts |

### DELETE Operations (Removing Records)

| What | Where | Table |
|------|-------|-------|
| Application | `/api/admin/applications`, `/api/admin/applications/[id]` | student |
| Student | `/api/admin/students/[id]` | student |
| News item | `/api/admin/news/[id]` | newsevent |
| Academic program | `/api/admin/academics/[id]` | academics |
| Contact | `/api/admin/contacts/[id]` | contacts |

---

## Field Name Conventions

### Current Implementation (MySQL)
- **camelCase**: firstName, lastName, dateOfBirth, applyingForGrade
- **lowercase**: email, mobile, status
- **PascalCase for timestamps**: createdAt, updatedAt, appliedAt

### Planned Schema (PostgreSQL/MySQL Schema Files)
- **snake_case**: first_name, last_name, date_of_birth, applying_for_grade
- **lowercase with underscore**: email, mobile, status
- **snake_case for timestamps**: created_at, updated_at, submitted_at

⚠️ **Important**: If migrating to planned schema, you'll need to update ALL API routes to use snake_case field names.

---

## Status Values Used

### Application/Student Status
- `submitted` - Application submitted (current default)
- `pending` - Awaiting review
- `under_review` / `reviewing` - Being reviewed by admin
- `approved` - Application accepted
- `rejected` - Application denied
- `waitlisted` - On waitlist
- `active` - Enrolled active student
- `inactive` - Inactive student
- `graduated` - Completed schooling
- `transferred` - Transferred to another school
- `dropped` - Dropped out

### Contact Status
- `new` - New contact message
- `read` - Message read
- `responded` - Response sent

### News/Content Status
- `draft` - Not published
- `published` - Live on website
- `archived` - Archived content

---

## JSON Fields in Current Schema

Some tables store complex data as JSON:

### `applications` table (planned schema)
- `personal_info` - Personal details
- `contact_info` - Contact information
- `parent_info` - Parent/guardian details
- `academic_info` - Academic history
- `additional_info` - Extra information
- `documents` - Document URLs

### `form_configurations` table
- `options` - Dropdown/radio options
- `validation_rules` - Field validation

### `audit_logs` table
- `old_values` - Previous state
- `new_values` - New state

---

## Migration Checklist

When changing database schema:

### Phase 1: Schema Setup
- [ ] Create new database with chosen schema
- [ ] Run schema SQL file
- [ ] Verify all tables created correctly
- [ ] Check indexes and foreign keys

### Phase 2: Data Migration
- [ ] Export data from current `student` table
- [ ] Transform data to match new schema
- [ ] Split student data into: users, user_profiles, applications, students
- [ ] Import data into new tables
- [ ] Verify data integrity and relationships

### Phase 3: Code Updates
- [ ] Update `src/lib/mysql.ts` or `src/lib/database.ts`
- [ ] Update `src/lib/auth.ts` authentication logic
- [ ] Update all 20+ API routes using `student` table
- [ ] Update field names (camelCase → snake_case if needed)
- [ ] Update query patterns to handle normalized structure

### Phase 4: Testing
- [ ] Test user signup flow
- [ ] Test admin authentication
- [ ] Test application submission
- [ ] Test application approval → student creation
- [ ] Test student profile updates
- [ ] Test dashboard statistics
- [ ] Test all CRUD operations on each table

### Phase 5: Deployment
- [ ] Backup current database
- [ ] Deploy new schema
- [ ] Migrate data
- [ ] Deploy updated code
- [ ] Monitor for errors
- [ ] Have rollback plan ready

---

## Quick Stats

- **Current Tables**: 6 (student, admin, newsevent, announcement, academics, contacts)
- **Planned Tables**: 17 (normalized schema)
- **API Routes**: 39 total files
- **Routes Using Database**: ~25 routes
- **Most Used Table**: student (~20 routes)
- **Database Operations**: ~90% SELECT, ~5% UPDATE, ~3% INSERT, ~2% DELETE

---

## Contact for Questions

This mapping was generated by analyzing:
- `DATABASE_SCHEMA.sql` (PostgreSQL schema)
- `DATABASE_SCHEMA_MYSQL.sql` (MySQL schema)
- `src/lib/database.ts` (JSON implementation)
- `src/lib/mysql.ts` (MySQL implementation)
- All API route files in `src/app/api/`

Last Updated: December 2024
