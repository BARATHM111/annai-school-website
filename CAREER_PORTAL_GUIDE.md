# Teacher Career Portal - Complete Guide

## 🎉 What's Been Created

A comprehensive **Career Portal System** for teachers to apply for jobs at Annai School with:
- **Two School Branches**: Tiruppur and Uthukuli
- **Resume Upload**: Direct PDF/DOC upload functionality
- **Application Tracking**: Teachers can check their application status
- **Admin Management**: Full control panel for HR/Admin to review applications
- **Status Updates**: Multi-stage application workflow

---

## ✅ Features Implemented

### For Teachers (Public)
- ✅ **Career Application Page** (`/careers`) - Apply for teaching positions
- ✅ **Resume Upload** - Upload PDF, DOC, DOCX (max 5MB)
- ✅ **Branch Selection** - Choose Tiruppur or Uthukuli branch
- ✅ **Application Dashboard** (`/careers/status`) - Check application status
- ✅ **Email-based Tracking** - Track application using email
- ✅ **Real-time Status** - See current application status

### For Admin
- ✅ **Admin Career Portal** (`/admin/careers`) - Manage all applications
- ✅ **Statistics Dashboard** - See application counts by status
- ✅ **Filter by Status** - View pending, under review, shortlisted, etc.
- ✅ **View Applications** - See complete applicant details
- ✅ **Update Status** - Change application status with notes
- ✅ **View Resumes** - Download/view uploaded resumes
- ✅ **Delete Applications** - Remove applications if needed

### Navbar & Navigation
- ✅ **Careers Link** added to main navbar
- ✅ **Careers** section in admin sidebar

---

## 📊 Database Schema

### Table: `career_applications`

```sql
CREATE TABLE career_applications (
  id VARCHAR(36) PRIMARY KEY,
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  date_of_birth DATE,
  gender ENUM('Male', 'Female', 'Other'),
  address TEXT,
  
  -- Branch Selection
  branch ENUM('Tiruppur', 'Uthukuli') NOT NULL,
  
  -- Professional Information
  position_applied VARCHAR(255) NOT NULL,
  qualification VARCHAR(255),
  experience_years INT DEFAULT 0,
  subject_specialization VARCHAR(255),
  previous_school VARCHAR(255),
  
  -- Resume/Documents
  resume_url VARCHAR(500) NOT NULL,
  resume_filename VARCHAR(255),
  cover_letter TEXT,
  
  -- Additional Information
  expected_salary VARCHAR(100),
  available_from DATE,
  languages_known VARCHAR(255),
  certifications TEXT,
  
  -- Application Status
  status ENUM('pending', 'under_review', 'shortlisted', 'rejected', 'hired') DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP NULL,
  
  -- Timestamps
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Application Status Flow

```
pending → under_review → shortlisted → hired
            ↓
         rejected
```

---

## 🚀 Setup Instructions

### Step 1: Run Database Script

```powershell
# Run this command in PowerShell
Get-Content scripts/create-career-table.sql | mysql -u root -pabishek
```

This will:
- Create `career_applications` table
- Insert 3 sample applications
- Create statistics view

### Step 2: Verify Setup

Check tables in MySQL:
```sql
USE annai_school;
SELECT * FROM career_applications;
SELECT * FROM career_stats;
```

### Step 3: Test the System

**Public Application:**
1. Visit: `http://localhost:3001/careers`
2. Fill the application form
3. Upload resume (PDF/DOC)
4. Submit application

**Check Status:**
1. Visit: `http://localhost:3001/careers/status`
2. Enter your email
3. View application status

**Admin Management:**
1. Login as admin
2. Visit: `http://localhost:3001/admin/careers`
3. View, update, and manage applications

---

## 🎯 How to Use (Teacher/Applicant)

### Apply for a Job

1. **Visit Careers Page**
   ```
   http://localhost:3001/careers
   ```

2. **Fill Personal Information**
   - Full Name (required)
   - Email (required) - Used for tracking
   - Phone (required)
   - Date of Birth
   - Gender
   - Address

3. **Fill Professional Information**
   - Preferred Branch (required) - Tiruppur or Uthukuli
   - Position Applied (required) - e.g., "Mathematics Teacher"
   - Highest Qualification - e.g., "M.Sc, B.Ed"
   - Years of Experience
   - Subject Specialization
   - Previous School

4. **Upload Resume** (required)
   - Click upload area
   - Select PDF, DOC, or DOCX file (max 5MB)
   - Wait for upload confirmation

5. **Write Cover Letter** (optional)
   - Explain why you're a good fit

6. **Additional Information** (optional)
   - Expected Salary
   - Available From date
   - Languages Known
   - Certifications

7. **Submit Application**
   - Click "Submit Application"
   - Success message appears
   - Auto-redirect to status page

### Check Application Status

**Method 1: After Submission**
- Automatically redirected to status page

**Method 2: Manual Check**
1. Visit: `http://localhost:3001/careers/status`
2. Enter your email address
3. Click "Check Status"
4. View application details and current status

**What You'll See:**
- ✅ Current status badge
- ✅ Status message
- ✅ Admin notes (if any)
- ✅ Application details
- ✅ Link to view your resume

---

## 🔧 How to Use (Admin)

### Access Admin Panel

```
http://localhost:3001/admin/careers
```

### Dashboard Overview

**Statistics Cards:**
- **Total**: All applications
- **Pending**: New applications awaiting review
- **Under Review**: Currently being reviewed
- **Shortlisted**: Selected for next round
- **Rejected**: Not selected
- **Hired**: Successfully hired

### Filter Applications

Use tabs to filter:
- **All** - See all applications
- **Pending** - New applications
- **Under Review** - In review process
- **Shortlisted** - Selected candidates
- **Rejected** - Not selected
- **Hired** - Hired candidates

### View Application Details

1. **Click "View" button** on any application
2. **See complete information:**
   - Personal details
   - Professional information
   - Cover letter
   - Resume link
   - Application date

### Update Application Status

1. **Open application** (click View)
2. **Scroll to "Update Application Status"**
3. **Select new status:**
   - Pending
   - Under Review
   - Shortlisted
   - Rejected
   - Hired
4. **Add admin notes** (visible to applicant)
   - e.g., "Scheduled for interview on..."
5. **Click "Update Status"**
6. Applicant can see this update on their dashboard

### Delete Application

1. **Click trash icon** on application card
2. **Confirm deletion**
3. Application removed permanently

---

## 📁 File Structure

```
src/
├── app/
│   ├── careers/
│   │   ├── page.tsx                    # Public application form
│   │   └── status/
│   │       └── page.tsx                # Teacher status dashboard
│   ├── admin/
│   │   └── careers/
│   │       └── page.tsx                # Admin management panel
│   └── api/
│       ├── career/
│       │   └── route.ts                # Career CRUD API
│       ├── upload-resume/
│       │   └── route.ts                # Resume upload API
│       └── upload-image/
│           └── route.ts                # Image upload (existing)
├── components/
│   ├── layout/
│   │   └── navbar.tsx                  # Updated with Careers link
│   └── admin/
│       └── optimized-sidebar.tsx       # Updated with Careers link
└── scripts/
    └── create-career-table.sql         # Database migration
```

---

## 🔒 API Endpoints

### POST `/api/upload-resume`
Upload resume file

**Form Data:**
- `file`: PDF, DOC, or DOCX file (max 5MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/resumes/resume_1234567890.pdf",
    "filename": "resume_1234567890.pdf",
    "originalName": "john_doe_resume.pdf"
  }
}
```

### GET `/api/career?email=<email>`
Fetch applications (by email for applicant, all for admin)

**Query Parameters:**
- `email` (optional) - Filter by applicant email
- `status` (optional) - Filter by status
- `branch` (optional) - Filter by branch

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+91 9876543210",
      "branch": "Tiruppur",
      "position_applied": "Mathematics Teacher",
      "status": "pending",
      "applied_at": "2024-01-15T10:30:00Z",
      ...
    }
  ]
}
```

### POST `/api/career`
Create new career application

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "branch": "Tiruppur",
  "positionApplied": "Mathematics Teacher",
  "qualification": "M.Sc Mathematics, B.Ed",
  "experienceYears": 5,
  "resumeUrl": "/uploads/resumes/resume_123.pdf",
  "coverLetter": "I am passionate about...",
  ...
}
```

**Validation:**
- ✅ Checks if email already applied
- ✅ Required fields validation
- ✅ Returns error if duplicate

### PUT `/api/career` (Admin only)
Update application status

**Request Body:**
```json
{
  "id": "application-uuid",
  "status": "shortlisted",
  "adminNotes": "Scheduled for interview on Jan 20th"
}
```

### DELETE `/api/career?id=<id>` (Admin only)
Delete application

---

## 🎨 Application Status Badges

### Status Colors & Meanings

| Status | Color | Meaning |
|--------|-------|---------|
| **Pending** | Yellow | Application received, awaiting review |
| **Under Review** | Blue | HR is reviewing the application |
| **Shortlisted** | Green | Selected for next round/interview |
| **Rejected** | Red | Not selected this time |
| **Hired** | Purple | Successfully hired! |

---

## 📧 Email Tracking System

### How It Works

1. **Teacher applies** with email: `teacher@example.com`
2. **Email stored** in database
3. **Teacher can check status** anytime using same email
4. **No account needed** - just email address
5. **Admin can update** and add notes
6. **Teacher sees updates** on status page

### Privacy & Security

- ✅ Email is required and unique (one application per email)
- ✅ No password needed for status check
- ✅ Admin-only access for updates
- ✅ Resume files stored securely

---

## 💼 Branch Information

### Tiruppur Branch
- Main campus
- State-of-the-art facilities
- Experienced faculty
- Larger capacity

### Uthukuli Branch
- Growing campus
- Modern infrastructure
- Collaborative environment
- Expansion opportunities

**Teachers select preferred branch during application**

---

## 📝 Sample Workflow

### Teacher Perspective

```
1. Visit /careers
   ↓
2. Fill application form
   ↓
3. Upload resume (PDF)
   ↓
4. Submit application
   ↓
5. Receive confirmation
   ↓
6. Visit /careers/status
   ↓
7. Enter email → See status
   ↓
8. Check periodically for updates
```

### Admin Perspective

```
1. Visit /admin/careers
   ↓
2. See new applications (Pending)
   ↓
3. Click "View" to see details
   ↓
4. View resume
   ↓
5. Update status to "Under Review"
   ↓
6. Add notes: "Good qualifications"
   ↓
7. Update to "Shortlisted"
   ↓
8. Add notes: "Scheduled for interview"
   ↓
9. After interview → "Hired" or "Rejected"
```

---

## ✅ Testing Checklist

### Public Features
- [ ] Visit `/careers` - Page loads
- [ ] Fill form - All fields work
- [ ] Upload PDF resume - Upload successful
- [ ] Upload DOC resume - Upload successful
- [ ] Try 6MB file - Error shown (max 5MB)
- [ ] Try image file - Error shown (PDF/DOC only)
- [ ] Submit form - Success message
- [ ] Auto-redirect to status page
- [ ] Status page shows application details

### Teacher Dashboard
- [ ] Visit `/careers/status`
- [ ] Enter email - Application found
- [ ] See correct status badge
- [ ] See admin notes (if any)
- [ ] View resume link works
- [ ] Check non-existent email - Error shown

### Admin Features
- [ ] Visit `/admin/careers`
- [ ] See statistics cards
- [ ] All tabs work (All, Pending, etc.)
- [ ] Click "View" - Dialog opens
- [ ] See all applicant details
- [ ] View resume - Opens in new tab
- [ ] Update status - Success message
- [ ] Add admin notes - Saved correctly
- [ ] Delete application - Confirmation works
- [ ] Filter by branch works
- [ ] Filter by status works

### Navbar & Navigation
- [ ] "Careers" link in navbar
- [ ] Link works on all pages
- [ ] "Careers" in admin sidebar
- [ ] Admin link works

---

## 🎊 Summary

### What Was Built

1. **Database**: `career_applications` table with comprehensive fields
2. **APIs**: 3 endpoints (career, upload-resume, image upload)
3. **Public Pages**: 
   - Application form (`/careers`)
   - Status dashboard (`/careers/status`)
4. **Admin Panel**: Career management (`/admin/careers`)
5. **Navigation**: Updated navbar and admin sidebar

### Key Features

- ✅ Two-branch system (Tiruppur, Uthukuli)
- ✅ Resume upload (PDF, DOC, DOCX)
- ✅ Email-based tracking
- ✅ Multi-status workflow
- ✅ Admin notes visible to applicants
- ✅ Statistics dashboard
- ✅ No login required for status check

### File Uploads

**Resume Storage:**
```
public/uploads/resumes/
├── resume_1704567890123.pdf
├── resume_1704567891234.doc
└── resume_1704567892345.docx
```

**Accessible via:**
```
http://localhost:3001/uploads/resumes/resume_123.pdf
```

---

## 🚀 Next Steps (Optional Enhancements)

1. **Email Notifications**: Send emails on status change
2. **Interview Scheduling**: Add calendar integration
3. **Bulk Actions**: Update multiple applications at once
4. **Export Data**: Download applications as CSV/Excel
5. **Advanced Filters**: Search by name, date range, qualification
6. **Document Verification**: Mark documents as verified
7. **Interview Notes**: Separate section for interview feedback
8. **Rating System**: Rate applicants on various criteria
9. **Multiple Resumes**: Allow updating resume
10. **Video Interviews**: Integrate video call links

---

## 📞 Quick Reference

### URLs

**Public:**
- Apply: `http://localhost:3001/careers`
- Check Status: `http://localhost:3001/careers/status`

**Admin:**
- Manage Applications: `http://localhost:3001/admin/careers`

### Database Queries

```sql
-- View all applications
SELECT * FROM career_applications ORDER BY applied_at DESC;

-- Count by status
SELECT status, COUNT(*) as count 
FROM career_applications 
GROUP BY status;

-- View by branch
SELECT * FROM career_applications 
WHERE branch = 'Tiruppur';

-- Recent applications
SELECT * FROM career_applications 
WHERE applied_at >= DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Statistics view
SELECT * FROM career_stats;
```

---

## ✨ Your Career Portal is Ready!

**Teachers can now:**
- ✅ Apply for teaching positions
- ✅ Upload resumes directly
- ✅ Choose preferred branch
- ✅ Track application status

**Admins can now:**
- ✅ View all applications
- ✅ See statistics dashboard
- ✅ Update application status
- ✅ Add feedback notes
- ✅ Download resumes
- ✅ Manage hiring workflow

**Visit `/careers` to start accepting applications!** 💼🎉
