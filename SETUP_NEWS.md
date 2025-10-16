# News & Events Management Setup Guide

## ✅ What's Been Created

### 1. **Admin News Page** ✅
- **File**: `src/app/admin/news/page.tsx`
- **Features**:
  - Create, Edit, Delete news items
  - Publish/Unpublish toggle
  - Category selection (News, Event, Announcement, Achievement)
  - Image URL support
  - Rich text content editor

### 2. **API Routes** ✅
- **File**: `src/app/api/admin/news/route.ts` (GET, POST)
- **File**: `src/app/api/admin/news/[id]/route.ts` (PUT, DELETE)
- **Features**:
  - Session authentication
  - Admin-only access
  - MySQL database integration

### 3. **Database Setup** ✅
- **SQL File**: `scripts/create-news-table.sql`
- **Setup Script**: `scripts/setup-news-table.js`
- **Sample Data**: 3 news items included

### 4. **Navigation** ✅
- Already added to Admin Sidebar as "News Management"

---

## 🚀 Setup Instructions

### Step 1: Create the News Table

Run the setup script to create the database table:

```bash
node scripts/setup-news-table.js
```

**Expected Output:**
```
📡 Connecting to MySQL...
✅ Connected to MySQL
📝 Creating news table...
✅ News table created successfully!
✅ Sample news items inserted!
🎉 Setup complete! You can now use the News Management page.
```

### Step 2: Access the News Management Page

1. Login as admin
2. Go to: **http://localhost:3000/admin/news**
3. Or click "News Management" in the admin sidebar

---

## 📊 Database Schema

### Table: `news`

| Column | Type | Description |
|--------|------|-------------|
| `id` | VARCHAR(50) | Primary key (e.g., NEWS1760068800001) |
| `title` | VARCHAR(255) | News title |
| `description` | TEXT | Short description |
| `content` | TEXT | Full content |
| `category` | VARCHAR(50) | news, event, announcement, achievement |
| `imageUrl` | VARCHAR(500) | Optional image URL |
| `published` | BOOLEAN | Publish status (true/false) |
| `date` | DATETIME | Display date |
| `createdAt` | DATETIME | Creation timestamp |
| `updatedAt` | DATETIME | Last update timestamp |

---

## 🎯 Features

### Admin Features:
- ✅ **Create News**: Add new news items with title, description, content
- ✅ **Edit News**: Update existing news items
- ✅ **Delete News**: Remove news items
- ✅ **Publish/Unpublish**: Toggle visibility
- ✅ **Categories**: Organize by type (News, Event, Announcement, Achievement)
- ✅ **Image Support**: Add image URLs
- ✅ **Draft Mode**: Save as draft before publishing

### UI Features:
- ✅ **Card Layout**: Visual grid display
- ✅ **Status Badges**: Published/Draft indicators
- ✅ **Category Badges**: Visual category tags
- ✅ **Quick Actions**: Edit, Delete, Publish/Unpublish buttons
- ✅ **Modal Form**: Clean editing interface
- ✅ **Responsive Design**: Works on all devices

---

## 📝 Sample News Items

After running the setup, you'll have 3 sample news items:

1. **School Reopening Announcement** (Announcement)
2. **Annual Sports Day** (Event)
3. **Academic Excellence Awards** (Achievement)

---

## 🔧 Troubleshooting

### Error: "Failed to fetch news"
**Cause**: Database table doesn't exist
**Solution**: Run `node scripts/setup-news-table.js`

### Error: "Admin access required"
**Cause**: Not logged in as admin
**Solution**: Login with admin credentials

### Error: "Cannot connect to MySQL"
**Cause**: Database credentials incorrect
**Solution**: Check `.env` file for correct MySQL credentials

---

## 🎨 Customization

### Add More Categories
Edit the form in `src/app/admin/news/page.tsx`:
```typescript
<option value="news">News</option>
<option value="event">Event</option>
<option value="announcement">Announcement</option>
<option value="achievement">Achievement</option>
<option value="your-category">Your Category</option> // Add here
```

### Change Card Layout
Modify the grid classes:
```typescript
// Current: 3 columns on large screens
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// 4 columns:
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
```

---

## ✨ Next Steps

1. ✅ Run database setup script
2. ✅ Access admin news page
3. ✅ Create your first news item
4. 📄 Create public news page (if needed) at `/news`
5. 🔗 Link news to homepage

---

## 🎉 You're All Set!

The news management system is now ready to use. Visit `/admin/news` to start creating content!
