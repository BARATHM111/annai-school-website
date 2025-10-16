# Complete Database Schema Documentation

## Overview
The Annai School Management System uses a file-based JSON database with the following structure:

## Database Files

### 1. `profiles.json` - User Profiles
Stores user profile information for students and staff.

```json
{
  "user@email.com": {
    "email": "string",
    "first_name": "string",
    "last_name": "string", 
    "phone": "string",
    "date_of_birth": "string (ISO date)",
    "address": "string",
    "profile_photo": "string (file path) | null",
    "father_name": "string",
    "mother_name": "string",
    "guardian_phone": "string",
    "guardian_email": "string",
    "emergency_name": "string",
    "emergency_relationship": "string",
    "emergency_phone": "string",
    "current_grade": "string",
    "roll_number": "string",
    "admission_date": "string (ISO date)",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)"
  }
}
```

### 2. `applications.json` - Admission Applications
Stores all admission applications submitted by prospective students.

```json
{
  "user@email.com": {
    "email": "string",
    "application_id": "string (unique)",
    "status": "submitted | pending | under_review | approved | rejected",
    "submitted_at": "string (ISO date)",
    "last_updated": "string (ISO date)",
    "personal_info": {
      "firstName": "string",
      "middleName": "string",
      "lastName": "string",
      "dateOfBirth": "string (ISO date)",
      "gender": "male | female | other",
      "bloodGroup": "string",
      "nationality": "string",
      "religion": "string",
      "category": "General | OBC | SC | ST | Other"
    },
    "contact_info": {
      "email": "string",
      "mobile": "string",
      "alternateMobile": "string",
      "currentAddress": "string",
      "permanentAddress": "string"
    },
    "parent_info": {
      "fatherName": "string",
      "fatherOccupation": "string",
      "fatherMobile": "string",
      "fatherEmail": "string",
      "motherName": "string",
      "motherOccupation": "string",
      "motherMobile": "string",
      "motherEmail": "string",
      "guardianName": "string",
      "guardianContact": "string"
    },
    "academic_info": {
      "previousSchool": "string",
      "previousClass": "string",
      "board": "CBSE | ICSE | State Board | IGCSE | IB | Other",
      "applyingForGrade": "string",
      "previousPercentage": "string"
    },
    "additional_info": {
      "specialNeeds": "string",
      "interests": ["string"],
      "hearAboutUs": "string"
    },
    "documents": {
      "photo": "string (file path)",
      "birth_certificate": "string (file path)",
      "marksheet": "string (file path)",
      "transfer_certificate": "string (file path)",
      "aadhar_card": "string (file path)"
    },
    "status_history": [
      {
        "status": "string",
        "date": "string (ISO date)",
        "comment": "string"
      }
    ],
    "notes": "string"
  }
}
```

### 3. `students.json` - Enrolled Students
Stores information about students who have been admitted and enrolled.

```json
{
  "STU20250001": {
    "student_id": "string (unique)",
    "email": "string",
    "academic_year": "number",
    "enrollment_date": "string (ISO date)",
    "status": "active | inactive | graduated | transferred",
    "personal_info": {
      "first_name": "string",
      "middle_name": "string",
      "last_name": "string",
      "date_of_birth": "string (ISO date)",
      "gender": "male | female | other",
      "blood_group": "string",
      "nationality": "string",
      "religion": "string",
      "category": "string",
      "profile_photo": "string (file path) | null"
    },
    "contact_info": {
      "email": "string",
      "mobile": "string",
      "alternate_mobile": "string",
      "current_address": "string",
      "permanent_address": "string"
    },
    "parent_info": {
      "father_name": "string",
      "father_occupation": "string",
      "father_mobile": "string",
      "father_email": "string",
      "mother_name": "string",
      "mother_occupation": "string",
      "mother_mobile": "string",
      "mother_email": "string",
      "guardian_name": "string",
      "guardian_contact": "string"
    },
    "academic_info": {
      "current_grade": "string",
      "section": "string",
      "roll_number": "string",
      "previous_school": "string",
      "previous_class": "string",
      "board": "string"
    },
    "documents": {
      "photo": "string (file path)",
      "birth_certificate": "string (file path)",
      "marksheet": "string (file path)",
      "transfer_certificate": "string (file path)",
      "aadhar_card": "string (file path)",
      "verification_status": {
        "photo": "boolean",
        "birth_certificate": "boolean",
        "marksheet": "boolean",
        "transfer_certificate": "boolean",
        "aadhar_card": "boolean"
      },
      "verified_by": "string (admin email)",
      "verified_at": "string (ISO date)"
    },
    "application_id": "string (reference to application)",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "created_by": "string (admin email)"
  }
}
```

### 4. `enrollments.json` - Enrollment Statistics
Stores enrollment statistics by year and other metrics.

```json
{
  "2025": {
    "year": 2025,
    "total_students": "number",
    "by_grade": {
      "Grade 1": "number",
      "Grade 2": "number"
    },
    "by_gender": {
      "male": "number",
      "female": "number",
      "other": "number"
    },
    "by_category": {
      "General": "number",
      "OBC": "number"
    },
    "student_ids": ["string"]
  }
}
```

### 5. `form-config.json` - Dynamic Form Configuration
Stores the configuration for the admission form fields.

```json
[
  {
    "id": "string (unique)",
    "fieldName": "string (API field name)",
    "fieldLabel": "string (display label)",
    "fieldType": "text | email | phone | date | select | file | textarea",
    "isRequired": "boolean",
    "isVisible": "boolean",
    "options": ["string"] | null,
    "placeholder": "string",
    "helpText": "string",
    "displayOrder": "number",
    "section": "personal | contact | parent | academic | documents | additional"
  }
]
```

### 6. `about-content.json` - About Page Content
Stores the content for the About page.

```json
{
  "title": "string",
  "subtitle": "string",
  "mainContent": "string",
  "vision": "string",
  "mission": "string",
  "showVision": "boolean",
  "showMission": "boolean",
  "facilities": [
    {
      "title": "string",
      "description": "string",
      "image": "string (file path)",
      "visible": "boolean"
    }
  ]
}
```

### 7. `news.json` - News & Announcements
Stores news articles and announcements.

```json
[
  {
    "id": "string (unique)",
    "title": "string",
    "content": "string",
    "excerpt": "string",
    "image": "string (file path)",
    "category": "news | announcement | event",
    "status": "draft | published",
    "publishedAt": "string (ISO date)",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)",
    "author": "string (admin email)"
  }
]
```

### 8. `carousel.json` - Homepage Carousel
Stores carousel slides for the homepage.

```json
[
  {
    "id": "string (unique)",
    "title": "string",
    "description": "string",
    "image": "string (file path)",
    "ctaText": "string",
    "ctaHref": "string (URL)",
    "isActive": "boolean",
    "order": "number"
  }
]
```

### 9. `announcements.json` - School Announcements
Stores general school announcements.

```json
[
  {
    "id": "string (unique)",
    "title": "string",
    "message": "string",
    "type": "info | warning | success | error",
    "priority": "high | medium | low",
    "targetAudience": "all | students | parents | staff",
    "isActive": "boolean",
    "startDate": "string (ISO date)",
    "endDate": "string (ISO date)",
    "createdAt": "string (ISO date)",
    "createdBy": "string (admin email)"
  }
]
```

## Database Functions

### Profile Functions (`profileDb`)
- `getProfile(email)` - Get user profile
- `upsertProfile(email, profileData)` - Create/update profile
- `updateProfilePhoto(email, photoUrl)` - Update profile photo

### Application Functions (`applicationDb`)
- `getApplication(email)` - Get application by email
- `createApplication(email, applicationData)` - Create new application
- `updateApplicationStatus(email, status, comment, notes)` - Update status
- `getAllApplications()` - Get all applications
- `deleteApplication(email)` - Delete application

### Student Functions (`studentDb`)
- `createStudent(studentData)` - Create student record
- `getStudent(studentId)` - Get student by ID
- `getStudentByEmail(email)` - Get student by email
- `getAllStudents()` - Get all students
- `getStudentsByYear(year)` - Get students by academic year
- `getStudentsByGrade(grade)` - Get students by grade
- `getStudentsByStatus(status)` - Get students by status
- `updateStudent(studentId, updateData)` - Update student
- `verifyDocument(studentId, documentType, verifiedBy)` - Verify document
- `updateStudentStatus(studentId, status, reason)` - Update status
- `deleteStudent(studentId)` - Delete student
- `searchStudents(query)` - Search students

### Enrollment Functions (`enrollmentDb`)
- `addEnrollment(studentId, year, grade)` - Add enrollment record
- `getEnrollmentByYear(year)` - Get enrollment by year
- `getAllEnrollments()` - Get all enrollments
- `getStatistics()` - Get enrollment statistics

## API Routes

### Student Routes
- `GET /api/student/profile` - Get student profile
- `POST /api/student/profile` - Update student profile
- `GET /api/student/application-status` - Get application status

### Admin Routes
- `GET /api/admin/applications` - Get all applications
- `POST /api/admin/update-application-status` - Update application status
- `GET /api/admin/students` - Get all students
- `GET /api/admin/form-config` - Get form configuration
- `PUT /api/admin/form-config` - Update form configuration
- `GET /api/admin/about` - Get about content
- `POST /api/admin/about` - Update about content

### General Routes
- `POST /api/admissions` - Submit admission application
- `POST /api/upload` - Upload files
- `GET /api/about` - Get public about content

## File Upload Structure

```
public/uploads/
├── profiles/          # Profile photos
├── documents/         # Application documents
├── news/             # News images
├── about/            # About page images
├── carousel/         # Carousel images
└── general/          # General uploads
```

## Status Values

### Application Status
- `submitted` - Initial submission
- `pending` - Awaiting review
- `under_review` - Being reviewed
- `approved` - Approved for admission
- `rejected` - Application rejected

### Student Status
- `active` - Currently enrolled
- `inactive` - Temporarily inactive
- `graduated` - Completed studies
- `transferred` - Transferred to another school

## Security Considerations

1. **Session-based Authentication** - All API routes require valid session
2. **Role-based Access Control** - Admin vs Student permissions
3. **File Upload Validation** - Type and size restrictions
4. **Data Sanitization** - Input validation and sanitization
5. **Error Handling** - Proper error messages without data exposure

## Usage Instructions

1. **Reset Database**: Run `node reset-database.js`
2. **Start Application**: Use your normal startup command
3. **Create Admin**: Sign up with admin credentials
4. **Test Flow**: Submit applications and manage through admin panel

This schema supports all admin routes and provides a complete student management system.
