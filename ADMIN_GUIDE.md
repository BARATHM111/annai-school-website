# Admin Guide - Annai School Management System

## 📋 Table of Contents
1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Managing Applications](#managing-applications)
4. [Managing Students](#managing-students)
5. [Content Management](#content-management)
6. [System Configuration](#system-configuration)

---

## Getting Started

### Logging In
1. Navigate to: `http://localhost:3000/auth/signin`
2. Enter admin credentials:
   - Email: `admin@annaischool.com`
   - Password: `admin123`
3. Click "Sign In"

### Changing Your Password
⚠️ **Important:** Change default password immediately!

1. Open `src/lib/auth.ts`
2. Update the password hash
3. Restart the server

---

## Dashboard Overview

### URL
`http://localhost:3000/admin/dashboard`

### Features
- **Application Statistics** - Total, pending, approved, rejected
- **Recent Applications** - Last 5 applications with quick actions
- **Quick Links** - Fast access to common tasks
- **System Status** - Server health check

---

## Managing Applications

### URL
`http://localhost:3000/admin/applications`

### Viewing Applications

**Application List Shows:**
- Application ID
- Student name
- Email and phone
- Class applying for
- Current status
- Submission date

**Status Types:**
- 🔵 **Pending** - Awaiting review
- ✅ **Approved** - Accepted for admission
- ❌ **Rejected** - Not accepted
- ⏳ **Waitlist** - On waiting list

### Reviewing an Application

1. Click on any application row
2. Review application details:
   - Personal information
   - Parent/guardian details
   - Academic information
   - Uploaded documents

3. **Update Status:**
   - Select new status from dropdown
   - Add notes (optional but recommended)
   - Click "Update Status"

4. **Add Notes:**
   - Use notes to record interview details
   - Document reasons for decisions
   - Track communication with parents

### Exporting Applications

Click "Export to CSV" to download all applications in Excel-compatible format.

### Filtering Applications

Use status filter dropdown to show:
- All applications
- Only pending
- Only approved
- Only rejected
- Only waitlisted

---

## Managing Students

### URL
`http://localhost:3000/admin/students`

### Student Management Features

**View Student Information:**
- Personal details
- Contact information
- Guardian details
- Academic records
- Application history

**Actions Available:**
- View full student profile
- Update student information
- View application documents
- Track student progress

---

## Content Management

### 1. About Page Editor

**URL:** `/admin/about`

**Editable Sections:**
- **Basic Information:**
  - Page title
  - Subtitle
  - Tagline
  - School motto

- **Content Paragraphs:**
  - First paragraph
  - Second paragraph
  - Character counts displayed

- **School Building Image:**
  - Upload new image (max 5MB)
  - Or enter image URL
  - Preview displayed

- **Promoter Information:**
  - Section title
  - Description (background and experience)
  - Name and details
  - Photo upload

**How to Edit:**
1. Navigate to "About Page" in sidebar
2. Edit any field
3. "Unsaved Changes" indicator appears
4. Click "Save Changes"
5. Click "Preview Page" to see live version

---

### 2. News Management

**URL:** `/admin/news`

**Features:**
- Create news items
- Edit existing news
- Delete news
- Toggle publish/draft status
- Upload news images

**Creating News:**
1. Click "Add News"
2. Fill in:
   - Title
   - Description
   - Date
   - Image (optional, max 5MB)
   - Status (Published/Draft)
3. Click "Create News"

**Editing News:**
1. Click edit icon on news card
2. Update information
3. Click "Update News"

**Publishing Control:**
- **Published:** Visible to public
- **Draft:** Only visible to admins

**Deleting News:**
1. Click delete icon
2. Confirm deletion
3. News permanently removed

---

### 3. Carousel Management

**URL:** `/admin/carousel`

**Managing Homepage Carousel:**
1. Click "Add New Slide"
2. Upload image (1920x1080px recommended)
3. Enter caption (optional)
4. Set display order
5. Click "Add to Carousel"

**Editing Slides:**
- Update caption
- Change order
- Replace image
- Enable/disable slide

**Deleting Slides:**
- Click delete icon
- Confirm removal

**Best Practices:**
- Use high-quality images
- Keep captions short (50 characters max)
- Maintain 3-5 slides for optimal UX
- Update regularly with school events

---

### 4. Admission Control

**URL:** `/admin/admission-control`

**Configure Application Form:**
- Enable/disable form fields
- Mark fields as required/optional
- Customize field options
- Set validation rules

**Available Sections:**
- Personal Information
- Parent/Guardian Details
- Academic Information
- Document Upload

**Making Changes:**
1. Toggle field visibility
2. Set required status
3. Click "Save Configuration"
4. Changes apply immediately to form

---

## System Configuration

### User Management

**Location:** `src/lib/auth.ts`

**Adding New Admin:**
```typescript
{
  id: "new-admin-id",
  name: "Admin Name",
  email: "admin@annaischool.com",
  password: "hashed-password",
  role: "admin"
}
```

**Password Hashing:**
Use bcrypt to hash passwords before adding to auth file.

---

### File Upload Settings

**Location:** `src/app/api/upload/route.ts`

**Current Limits:**
- Max file size: 5MB
- Allowed types: Images (JPG, PNG, WEBP)
- Upload directories:
  - `/public/uploads/profiles/` - Student photos
  - `/public/uploads/documents/` - Application docs
  - `/public/uploads/carousel/` - Carousel images
  - `/public/uploads/promoter/` - Promoter photos
  - `/public/uploads/news/` - News images

**Changing Limits:**
1. Open `src/app/api/upload/route.ts`
2. Update `maxFileSize` constant
3. Restart server

---

### Data Storage

**Location:** `data/` directory

**Files:**
- `applications.json` - All applications
- `students.json` - Enrolled students
- `users.json` - System users
- `about-content.json` - About page content

**Backup:**
Regularly backup the `data/` directory to prevent data loss.

---

## Best Practices

### Daily Tasks
- ✅ Review new applications
- ✅ Respond to pending applications
- ✅ Update application statuses
- ✅ Check for duplicate applications

### Weekly Tasks
- ✅ Update news and events
- ✅ Review carousel images
- ✅ Backup data directory
- ✅ Check system logs

### Monthly Tasks
- ✅ Update about page content
- ✅ Review admission form configuration
- ✅ Clean up old draft news
- ✅ Archive processed applications

---

## Security Guidelines

1. **Change Default Credentials**
   - Use strong passwords
   - Update immediately after setup

2. **Regular Backups**
   - Backup `data/` directory weekly
   - Store backups securely

3. **Access Control**
   - Don't share admin credentials
   - Log out after use
   - Use secure connections

4. **Data Privacy**
   - Handle student data responsibly
   - Follow data protection regulations
   - Delete unnecessary files

---

## Troubleshooting

### Cannot Login
- Verify credentials in `src/lib/auth.ts`
- Check if server is running
- Clear browser cache

### Cannot Upload Files
- Check upload directory exists
- Verify file size is under 5MB
- Ensure correct file format

### Changes Not Saving
- Check console for errors
- Verify API endpoints working
- Restart server if needed

### Application Not Showing
- Check status filter
- Verify application was submitted
- Refresh the page

---

## Support

For technical assistance:
- **Email:** info@annaischool.edu
- **Phone:** 94430 83242

---

**Last Updated:** January 2025  
**Version:** 1.0.0
