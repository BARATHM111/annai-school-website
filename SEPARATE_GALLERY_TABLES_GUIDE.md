# Separate Gallery Tables with Image Upload - Complete Guide

## 🎉 What's Been Updated

You now have **3 separate database tables** instead of one combined table:
1. **`gallery`** - School events, activities, celebrations
2. **`achievers`** - Student achievements with student name and achievement date
3. **`sports`** - Sports events with event date and location

Plus **local image upload** functionality!

---

## ✅ New Features

### Separate Tables
- ✅ **gallery** table - Basic fields (title, description, image)
- ✅ **achievers** table - Extra fields (student_name, achievement_date)
- ✅ **sports** table - Extra fields (event_date, location)
- ✅ Each table has proper indexes and constraints

### Image Upload
- ✅ **File upload** button in admin panel
- ✅ **Drag & drop** or click to upload
- ✅ **Image preview** before save
- ✅ **Auto-validation** (file type, size limit 5MB)
- ✅ **Local storage** in `/public/uploads/` folder
- ✅ **Organized by category** (uploads/gallery/, uploads/achievers/, uploads/sports/)

### Enhanced Admin Panel
- ✅ **File upload UI** with preview
- ✅ **Category-specific forms** (different fields for each type)
- ✅ **Delete uploaded image** option
- ✅ **Better card display** with all metadata

---

## 📊 Database Structure

### 1. Gallery Table
```sql
CREATE TABLE gallery (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  image_path VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by VARCHAR(255)
);
```

### 2. Achievers Table
```sql
CREATE TABLE achievers (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  student_name VARCHAR(255),         -- ← Extra field
  achievement_date DATE,             -- ← Extra field
  image_url VARCHAR(500) NOT NULL,
  image_path VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by VARCHAR(255)
);
```

### 3. Sports Table
```sql
CREATE TABLE sports (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE,                   -- ← Extra field
  location VARCHAR(255),             -- ← Extra field
  image_url VARCHAR(500) NOT NULL,
  image_path VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by VARCHAR(255)
);
```

---

## 🚀 How to Setup

### Step 1: Run Database Script
```bash
# Copy and paste this in MySQL Workbench or command line:
Get-Content scripts/create-separate-gallery-tables.sql | mysql -u root -pabishek
```

This will:
- Drop old `gallery_items` table
- Create 3 new separate tables
- Insert sample data (5 gallery, 4 achievers, 5 sports)

### Step 2: Create Upload Directories
The system will auto-create these folders when you upload:
```
public/
└── uploads/
    ├── gallery/
    ├── achievers/
    └── sports/
```

### Step 3: Test Upload
1. Go to `http://localhost:3001/admin/gallery-management`
2. Click "Add Image"
3. Click upload area or drag image
4. Fill form
5. Click "Create"

---

## 🎯 How to Use (Admin)

### Upload Image

#### Option 1: Click to Upload
1. Click **"Add Image"** / **"Add Achiever"** / **"Add Sports Item"**
2. Click the **upload area**
3. Select image from computer
4. Wait for upload (progress indicator shows)
5. Image preview appears
6. Fill remaining fields
7. Click **"Create"**

#### Option 2: Drag & Drop
1. Open dialog
2. **Drag image** from file explorer
3. **Drop** on upload area
4. Auto-uploads and shows preview
5. Continue with form

### Add Gallery Item
```
Fields:
- Image Upload (required)
- Title (required)
- Description (optional)
- Display Order (default: 0)
```

### Add Achiever
```
Fields:
- Image Upload (required)
- Title (required, e.g., "National Science Olympiad Winner")
- Description (optional)
- Student Name (e.g., "Priya Sharma")
- Achievement Date (date picker)
- Display Order (default: 0)
```

### Add Sports Item
```
Fields:
- Image Upload (required)
- Title (required, e.g., "Inter-School Cricket Tournament")
- Description (optional)
- Event Date (date picker)
- Location (e.g., "City Sports Complex")
- Display Order (default: 0)
```

---

## 🔧 API Endpoints Updated

### POST `/api/upload-image`
Upload image file to server

**Form Data**:
- `file`: Image file (JPEG, PNG, WebP, GIF)
- `category`: 'gallery', 'achievers', or 'sports'

**Validation**:
- Max size: 5MB
- Allowed: image/jpeg, image/jpg, image/png, image/webp, image/gif

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "/uploads/gallery/gallery_1234567890.jpg",
    "filename": "gallery_1234567890.jpg",
    "category": "gallery"
  }
}
```

### GET `/api/gallery?category=<category>`
Fetches from separate tables

**Examples**:
- `/api/gallery?category=gallery` → SELECT * FROM gallery
- `/api/gallery?category=achievers` → SELECT * FROM achievers
- `/api/gallery?category=sports` → SELECT * FROM sports
- `/api/gallery` → Returns all from all 3 tables

### POST `/api/gallery`
Creates item in correct table based on category

**Gallery**:
```json
{
  "category": "gallery",
  "title": "Annual Day 2024",
  "description": "...",
  "imageUrl": "/uploads/gallery/...",
  "displayOrder": 1
}
```

**Achievers**:
```json
{
  "category": "achievers",
  "title": "Chess Champion",
  "description": "...",
  "studentName": "Raj Kumar",
  "achievementDate": "2024-01-15",
  "imageUrl": "/uploads/achievers/...",
  "displayOrder": 1
}
```

**Sports**:
```json
{
  "category": "sports",
  "title": "Cricket Tournament",
  "description": "...",
  "eventDate": "2024-02-20",
  "location": "City Stadium",
  "imageUrl": "/uploads/sports/...",
  "displayOrder": 1
}
```

### PUT `/api/gallery`
Updates item (requires `id` and `category`)

### DELETE `/api/gallery?id=<id>&category=<category>`
Deletes from correct table

---

## 📁 File Storage

### Upload Path Structure
```
public/uploads/
├── gallery/
│   ├── gallery_1704567890123.jpg
│   ├── gallery_1704567891234.png
│   └── gallery_1704567892345.webp
├── achievers/
│   ├── achievers_1704567893456.jpg
│   └── achievers_1704567894567.png
└── sports/
    ├── sports_1704567895678.jpg
    └── sports_1704567896789.png
```

### Filename Format
`{category}_{timestamp}{extension}`

Example: `gallery_1704567890123.jpg`

### Public Access
Images are accessible via URL:
```
http://localhost:3001/uploads/gallery/gallery_1704567890123.jpg
```

---

## 🎨 Admin UI Features

### Upload Area
- **Dashed border** - Shows it's droppable
- **Upload icon** - Clear visual indicator
- **File size hint** - "PNG, JPG, WebP up to 5MB"
- **Preview** - Shows uploaded image immediately
- **Remove button** - X icon to clear and re-upload

### Form Validation
- **Required fields** - Title and Image
- **File type check** - Only images allowed
- **Size limit** - Max 5MB
- **Visual feedback** - Error toasts for validation failures

### Loading States
- **Upload progress** - "Uploading..." with spinner
- **Submit disabled** - Can't submit while uploading
- **Preview loading** - Smooth transition

---

## 🔒 Security Features

### File Validation
- ✅ **File type whitelist** - Only image/* MIME types
- ✅ **Extension check** - .jpg, .png, .webp, .gif
- ✅ **Size limit** - Max 5MB per file
- ✅ **Admin-only** - Authentication required

### Path Safety
- ✅ **No path traversal** - Filenames sanitized
- ✅ **UUID-based names** - Prevents overwrites
- ✅ **Organized folders** - Category separation

### Database
- ✅ **Parameterized queries** - SQL injection protection
- ✅ **Input validation** - Server-side checks
- ✅ **Admin role check** - Role-based access control

---

## 📝 Migration from Old Table

### If you already have data in `gallery_items`:

```sql
-- Export old data
SELECT * FROM gallery_items WHERE category = 'gallery' INTO OUTFILE '/tmp/gallery.csv';
SELECT * FROM gallery_items WHERE category = 'achievers' INTO OUTFILE '/tmp/achievers.csv';
SELECT * FROM gallery_items WHERE category = 'sports' INTO OUTFILE '/tmp/sports.csv';

-- Then manually import or use script provided
```

---

## ✅ Testing Checklist

### Admin Panel
- [ ] Visit `/admin/gallery-management`
- [ ] Click "Gallery" tab → Click "Add Image"
- [ ] Upload image → See preview
- [ ] Fill title → Click "Create"
- [ ] Item appears in gallery grid
- [ ] Click "Edit" → Modify → Click "Update"
- [ ] Click "Delete" → Confirm → Item removed

### Achievers Tab
- [ ] Click "Achievers" tab → Click "Add Achiever"
- [ ] Upload image
- [ ] Fill: Title, Student Name, Achievement Date
- [ ] Create → Appears with student name displayed

### Sports Tab
- [ ] Click "Sports" tab → Click "Add Sports Item"
- [ ] Upload image
- [ ] Fill: Title, Event Date, Location
- [ ] Create → Appears with event date and location

### Public Pages
- [ ] Visit `/gallery` → See uploaded images
- [ ] Visit `/achievers` → See achievers
- [ ] Visit `/sports` → See sports items
- [ ] Click image → Modal opens with full view

### File Upload
- [ ] Try uploading 6MB file → Error toast
- [ ] Try uploading .txt file → Error toast
- [ ] Try uploading valid JPG → Success
- [ ] Check `/public/uploads/gallery/` → File exists

---

## 🎊 Summary

### What Changed
| Before | After |
|--------|-------|
| 1 table `gallery_items` | 3 tables: `gallery`, `achievers`, `sports` |
| Category column (enum) | Separate tables |
| External URLs only | Local upload + preview |
| Same fields for all | Category-specific fields |
| Manual image URLs | Drag & drop upload |

### Benefits
1. **Better data organization** - Each category has its own table
2. **Category-specific fields** - Achievers have student_name, Sports have location
3. **Easier querying** - No WHERE category = needed
4. **Cleaner schema** - No null fields for irrelevant data
5. **Local file storage** - No dependency on external URLs
6. **Better admin UX** - Upload images directly

---

## 🚀 Next Steps (Optional)

1. **Image Optimization**: Add auto-resize on upload (reduce file size)
2. **Cloudinary Integration**: Upload to cloud instead of local
3. **Bulk Upload**: Allow multiple images at once
4. **Image Gallery**: Add lightbox with prev/next buttons
5. **Crop Tool**: Allow admins to crop images before upload
6. **Alt Text**: Add alt_text field for accessibility

---

## 📞 Quick Reference

### Database Tables
```sql
-- View all gallery items
SELECT * FROM gallery ORDER BY display_order;

-- View all achievers
SELECT * FROM achievers ORDER BY display_order;

-- View all sports items
SELECT * FROM sports ORDER BY display_order;

-- Count items
SELECT 
  (SELECT COUNT(*) FROM gallery) as gallery_count,
  (SELECT COUNT(*) FROM achievers) as achievers_count,
  (SELECT COUNT(*) FROM sports) as sports_count;
```

### Admin URLs
- Gallery Management: `http://localhost:3001/admin/gallery-management`
- Public Gallery: `http://localhost:3001/gallery`
- Public Achievers: `http://localhost:3001/achievers`
- Public Sports: `http://localhost:3001/sports`

---

## ✨ Your Gallery System is Upgraded!

**Now you can**:
- Upload images directly from admin panel
- Drag & drop files
- See instant previews
- Store images locally
- Have separate tables for each category
- Add category-specific fields (student name, event date, etc.)

**Test it now**: Visit `/admin/gallery-management` and upload your first image! 📸🎉
