# Annai School Management System - Database Documentation

## Overview

This document provides comprehensive documentation for the Annai School Management System database schema. The database is designed to support a complete school management system with user authentication, student admissions, academic management, content management, and file handling capabilities.

## Database Technology Stack

- **Primary Database**: PostgreSQL (recommended for production)
- **ORM**: Prisma
- **Alternative Databases**: MySQL, SQLite (for development)
- **Authentication**: NextAuth.js with JWT strategy
- **File Storage**: Local filesystem with support for AWS S3 and Cloudinary

## Core Modules

### 1. User Management Module
- **Purpose**: Handle user authentication, roles, and basic profile information
- **Tables**: `users`, `user_profiles`
- **Features**: Role-based access control, email verification, password reset

### 2. Admission Management Module
- **Purpose**: Manage student admission applications and dynamic form configurations
- **Tables**: `applications`, `application_status_history`, `form_configurations`
- **Features**: Dynamic form builder, application tracking, status management

### 3. Student Management Module
- **Purpose**: Manage enrolled student records and document verification
- **Tables**: `students`, `student_documents`
- **Features**: Student enrollment, document verification, parent information

### 4. Academic Management Module
- **Purpose**: Handle academic structure and enrollment tracking
- **Tables**: `academic_years`, `grades`, `sections`, `enrollments`
- **Features**: Grade management, section allocation, enrollment statistics

### 5. Content Management Module
- **Purpose**: Manage website content, news, and announcements
- **Tables**: `news`, `carousel_images`, `about_content`
- **Features**: News publishing, homepage carousel, about page management

### 6. File Management Module
- **Purpose**: Track file uploads and manage document storage
- **Tables**: `file_uploads`
- **Features**: File upload tracking, metadata storage, access control

### 7. System Configuration Module
- **Purpose**: Application settings and audit logging
- **Tables**: `system_settings`, `audit_logs`
- **Features**: Dynamic configuration, audit trail, system monitoring

## Detailed Table Documentation

### Users Table
```sql
users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    -- Additional authentication fields
)
```

**Purpose**: Core user authentication and role management
**Key Features**:
- UUID primary keys for security
- Role-based access control (admin, teacher, student, parent)
- Email verification workflow
- Password reset functionality
- User status management

### User Profiles Table
```sql
user_profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    -- Additional profile fields
)
```

**Purpose**: Detailed user profile information
**Key Features**:
- One-to-one relationship with users
- Comprehensive personal information
- Contact details and addresses
- Emergency contact information

### Applications Table
```sql
applications (
    id UUID PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE, -- APP2024001
    user_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'submitted',
    applying_for_grade VARCHAR(50),
    personal_info JSONB,
    contact_info JSONB,
    parent_info JSONB,
    academic_info JSONB,
    -- Additional application fields
)
```

**Purpose**: Student admission applications
**Key Features**:
- Human-readable application IDs
- Flexible JSON storage for form data
- Status tracking with history
- Document attachment support
- Admin review workflow

### Students Table
```sql
students (
    id UUID PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE, -- STU2024001
    user_id UUID REFERENCES users(id),
    application_id UUID REFERENCES applications(id),
    current_grade VARCHAR(50),
    academic_year INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    -- Parent and academic information
)
```

**Purpose**: Enrolled student records
**Key Features**:
- Links to user accounts and applications
- Academic progression tracking
- Parent/guardian information
- Status management (active, graduated, transferred)
- Document verification workflow

## Relationships and Constraints

### Primary Relationships

1. **User → Profile**: One-to-one relationship
   - Each user has exactly one profile
   - Profile is deleted when user is deleted (CASCADE)

2. **User → Applications**: One-to-many relationship
   - Users can have multiple applications (different years)
   - Applications are deleted when user is deleted (CASCADE)

3. **Application → Student**: One-to-one relationship
   - Approved applications can be converted to student records
   - Student record references the original application

4. **Student → Documents**: One-to-many relationship
   - Students can have multiple document types
   - Documents are deleted when student is deleted (CASCADE)

5. **Student → Enrollments**: One-to-many relationship
   - Students can have multiple enrollments (different years)
   - Tracks academic progression

### Data Integrity Constraints

1. **Email Uniqueness**: Users must have unique email addresses
2. **Application ID Format**: Auto-generated with year prefix (APP2024001)
3. **Student ID Format**: Auto-generated with year prefix (STU2024001)
4. **Status Validation**: Enum constraints on status fields
5. **Role Validation**: Enum constraints on user roles
6. **Referential Integrity**: Foreign key constraints with appropriate cascade rules

## Security Features

### Row Level Security (RLS)
- Enabled on sensitive tables (users, profiles, applications, students)
- Users can only access their own data
- Admins have full access to all records
- Implemented using PostgreSQL RLS policies

### Data Protection
- Password hashing using bcrypt
- Sensitive data stored in separate profile tables
- Audit logging for important operations
- File access control based on user permissions

## Performance Optimizations

### Indexes
```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Application indexes
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_academic_year ON applications(academic_year);

-- Student indexes
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_academic_year ON students(academic_year);
CREATE INDEX idx_students_current_grade ON students(current_grade);
```

### Views for Common Queries
```sql
-- Complete student information view
CREATE VIEW student_complete_info AS
SELECT s.*, u.email, up.first_name, up.last_name
FROM students s
JOIN users u ON s.user_id = u.id
JOIN user_profiles up ON u.id = up.user_id;

-- Application summary view
CREATE VIEW application_summary AS
SELECT a.*, u.email, a.personal_info->>'firstName' as first_name
FROM applications a
JOIN users u ON a.user_id = u.id;
```

## Business Logic Functions

### ID Generation Functions
```sql
-- Generate application ID: APP2024001, APP2024002, etc.
CREATE FUNCTION generate_application_id(year INTEGER) RETURNS VARCHAR(50);

-- Generate student ID: STU2024001, STU2024002, etc.
CREATE FUNCTION generate_student_id(year INTEGER) RETURNS VARCHAR(50);
```

### Automatic Triggers
- `updated_at` timestamp updates on record modifications
- Audit log entries for sensitive operations
- Status history tracking for applications

## Data Migration Strategy

### From File-Based to Database
The current system uses JSON files for data storage. Migration steps:

1. **Export existing data** from JSON files
2. **Transform data** to match new schema structure
3. **Import data** using Prisma migrations
4. **Verify data integrity** and relationships
5. **Update application code** to use Prisma client

### Migration Scripts
```bash
# Initialize Prisma
npx prisma init

# Generate migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database with initial data
npx prisma db seed
```

## Environment Configuration

### Required Environment Variables
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/annai_school_db"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# File Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_ALLOWED_TYPES="image/jpeg,image/png,image/gif,application/pdf"

# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## API Integration Points

### Frontend Integration
The database schema is designed to work seamlessly with the existing frontend code:

1. **User Authentication**: Compatible with NextAuth.js session structure
2. **Form Configuration**: Dynamic form rendering based on `form_configurations` table
3. **Application Management**: JSON storage matches frontend form structure
4. **File Uploads**: Integrated with existing upload API endpoints
5. **Content Management**: Supports existing admin panels for news, carousel, about page

### Key API Endpoints
- `/api/auth/*` - Authentication endpoints
- `/api/student/profile` - Student profile management
- `/api/admissions` - Application submission
- `/api/admin/applications` - Application management
- `/api/admin/students` - Student management
- `/api/upload` - File upload handling

## Backup and Recovery

### Backup Strategy
1. **Daily automated backups** of the entire database
2. **Transaction log backups** every 15 minutes
3. **Monthly full backups** stored offsite
4. **Point-in-time recovery** capability

### Recovery Procedures
1. **Database restoration** from backup files
2. **Data validation** after recovery
3. **Application testing** to ensure functionality
4. **User notification** of any data loss

## Monitoring and Maintenance

### Performance Monitoring
- Query performance analysis
- Index usage statistics
- Connection pool monitoring
- Storage usage tracking

### Regular Maintenance
- **Weekly**: Index maintenance and statistics updates
- **Monthly**: Database cleanup and archival
- **Quarterly**: Performance review and optimization
- **Annually**: Schema review and updates

## Future Enhancements

### Planned Features
1. **Multi-tenant support** for multiple schools
2. **Advanced reporting** with analytics tables
3. **Integration APIs** for third-party systems
4. **Mobile app support** with optimized queries
5. **Real-time notifications** using WebSocket connections

### Scalability Considerations
1. **Database sharding** for large datasets
2. **Read replicas** for improved performance
3. **Caching layer** with Redis
4. **CDN integration** for file storage
5. **Microservices architecture** for specific modules

## Troubleshooting Guide

### Common Issues
1. **Connection timeouts**: Check connection pool settings
2. **Slow queries**: Analyze query execution plans
3. **Lock contention**: Review transaction isolation levels
4. **Storage issues**: Monitor disk space and cleanup old files
5. **Migration failures**: Check schema compatibility and data constraints

### Debug Tools
- Prisma Studio for database visualization
- PostgreSQL logs for query analysis
- Application logs for error tracking
- Performance monitoring dashboards

## Conclusion

This database schema provides a robust foundation for the Annai School Management System, supporting all current frontend features while allowing for future expansion. The design emphasizes data integrity, security, and performance while maintaining compatibility with the existing codebase.

For implementation questions or issues, refer to the troubleshooting guide or contact the development team.
