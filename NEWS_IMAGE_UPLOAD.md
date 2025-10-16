# News Image Upload Guide

## ✅ Image Upload Feature Added

The news management system now supports **direct image uploads** instead of just image URLs.

---

## 🎯 Features

### **Admin Panel Features:**
- ✅ **File Upload Field** - Browse and select images from your computer
- ✅ **Image Preview** - See uploaded image before saving
- ✅ **Remove Button** - Clear uploaded image if needed
- ✅ **File Validation** - Only accepts JPG, PNG, WebP formats
- ✅ **Size Limit** - Maximum 5MB per image
- ✅ **Upload Progress** - Shows "Uploading..." status during upload
- ✅ **Auto-Save** - Images saved to `/public/uploads/news/`

---

## 📊 How It Works

### **Data Flow:**

```
User Selects Image
       ↓
Image Preview Shown
       ↓
User Clicks "Create/Update"
       ↓
1. Upload Image → POST /api/upload (type=news)
       ↓
2. Get Image URL → /uploads/news/1760068800001_image.jpg
       ↓
3. Save News → POST /api/admin/news (with imageUrl)
       ↓
4. Stored in MySQL → news.imageUrl column
       ↓
5. Displayed on Homepage → <img src="/uploads/news/...">
```

---

## 🚀 Usage Instructions

### **Step 1: Navigate to News Management**
1. Login as admin
2. Go to: `/admin/news`
3. Click "Add News" or edit existing news

### **Step 2: Upload Image**
1. Click "Choose File" under "News Image"
2. Select an image (JPG, PNG, or WebP)
3. ✅ **Preview appears immediately**

### **Step 3: Review & Submit**
1. Fill in other fields (Title, Content, etc.)
2. Review image preview
3. Click "Create" or "Update"
4. ✅ **Image uploads automatically**
5. ✅ **News saves with image URL**

### **Step 4: See Result**
1. Visit homepage: `http://localhost:3000`
2. Scroll to "Latest News & Events"
3. ✅ **Your uploaded image displays!**

---

## 📁 File Storage

### **Upload Location:**
```
public/
└── uploads/
    └── news/
        ├── 1760068800001_sports-day.jpg
        ├── 1760068900002_achievement.png
        └── 1760069000003_announcement.webp
```

### **File Naming:**
- Format: `{timestamp}_{original_filename}`
- Example: `1760068800001_annual-sports-day.jpg`
- Prevents naming conflicts
- Preserves original filename

### **Public URL:**
- Stored path: `/uploads/news/1760068800001_sports-day.jpg`
- Full URL: `http://localhost:3000/uploads/news/1760068800001_sports-day.jpg`
- Accessible from anywhere in the app

---

## 🎨 UI Features

### **1. File Input**
```
┌────────────────────────────────────┐
│ News Image (optional)              │
│ ┌────────────────────────────────┐ │
│ │ [Choose File] No file chosen   │ │
│ └────────────────────────────────┘ │
│ Max size: 5MB. Formats: JPG, PNG  │
└────────────────────────────────────┘
```

### **2. Image Preview**
```
┌────────────────────────────────────┐
│ Image Preview                      │
│ ┌────────────────────────────────┐ │
│ │                          [✕]   │ │
│ │                                │ │
│ │      [Your Image Shows Here]   │ │
│ │                                │ │
│ │                                │ │
│ └────────────────────────────────┘ │
└────────────────────────────────────┘
```

### **3. Remove Button**
- Red X button in top-right corner
- Clears image preview
- Resets file input
- Can upload different image

### **4. Submit Button States**
- Normal: "Create" / "Update"
- Uploading: "Uploading..." (disabled)
- After upload: Returns to normal

---

## 🔧 Technical Details

### **Accepted Formats:**
```javascript
accept="image/jpeg,image/jpg,image/png,image/webp"
```

### **File Validation:**
- **Max Size**: 5MB (5,242,880 bytes)
- **Formats**: JPEG, JPG, PNG, WebP
- **Validation Location**: `/api/upload` route

### **Upload API:**
- **Endpoint**: `POST /api/upload`
- **Body**: FormData with file + type
- **Response**: `{ success: true, data: { url: "/uploads/news/..." } }`

### **State Management:**
```typescript
const [imageFile, setImageFile] = useState<File | null>(null)
const [imagePreview, setImagePreview] = useState<string | null>(null)
const [uploading, setUploading] = useState(false)
```

---

## ✨ Example Usage

### **Creating News with Image:**

**1. Admin Input:**
```
Title: Annual Sports Day 2025
Content: Join us for an exciting day of sports...
Category: Event
Image: [Upload sports-day.jpg]
```

**2. Upload Process:**
```
✅ Image selected: sports-day.jpg (2.3 MB)
✅ Preview shown
✅ Upload started...
✅ Uploaded to: /uploads/news/1760068800001_sports-day.jpg
✅ News created with image
```

**3. Result in Database:**
```sql
INSERT INTO news VALUES (
  'NEWS1760068800001',
  'Annual Sports Day 2025',
  '...',
  'event',
  '/uploads/news/1760068800001_sports-day.jpg',  -- ← Image URL
  1,
  NOW()
);
```

**4. Homepage Display:**
```html
<img src="/uploads/news/1760068800001_sports-day.jpg" 
     alt="Annual Sports Day 2025" 
     class="w-full h-full object-cover" />
```

---

## 🛠️ Troubleshooting

### **Issue: Upload fails**
**Cause**: Directory permissions
**Solution**: 
```bash
# Create directory manually
mkdir -p public/uploads/news
chmod 755 public/uploads/news
```

### **Issue: Image too large**
**Error**: "File size too large. Maximum 5MB allowed"
**Solution**: 
- Compress image before uploading
- Use online tools: TinyPNG, Compressor.io
- Or use image editing software

### **Issue: Wrong format**
**Error**: "Invalid file type for news"
**Solution**:
- Convert image to JPG, PNG, or WebP
- Use online converters or image editors

### **Issue: Preview not showing**
**Cause**: File read error
**Solution**:
- Ensure file is valid image
- Try different image
- Check browser console for errors

---

## 📋 Comparison: Before vs After

### **Before (URL Only):**
```
❌ Had to upload image elsewhere first
❌ Copy/paste URL manually
❌ No preview before saving
❌ Risk of broken links
❌ External dependency
```

### **After (Upload Feature):**
```
✅ Upload directly in admin panel
✅ No external hosting needed
✅ Instant preview
✅ All images in one place
✅ Full control over images
```

---

## 🎉 Summary

**Complete Image Upload Flow:**
```
Admin Panel → Upload Image → Save to Server → Store URL → Display on Homepage
     ↓              ↓              ↓              ↓              ↓
  Browse File   /api/upload    /uploads/news/   MySQL DB      Shows Image
```

**Key Benefits:**
- ✅ **No external hosting** - Images stored locally
- ✅ **Easy management** - All images in one directory
- ✅ **Fast uploads** - Direct to server
- ✅ **Automatic URLs** - No manual entry needed
- ✅ **Image preview** - See before saving
- ✅ **Validation** - Size and format checks
- ✅ **Professional UI** - Clean, modern interface

**Your news management system now has full image upload capabilities!** 🚀
