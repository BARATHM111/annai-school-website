# Quick Start Guide - Annai School Management System

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
Create `.env.local` file:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

Generate secret key:
```bash
openssl rand -base64 32
```

### Step 3: Create Upload Directories
```bash
mkdir -p public/uploads/profiles public/uploads/documents public/uploads/carousel public/uploads/promoter public/uploads/news data
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Access the Application
Open [http://localhost:3000](http://localhost:3000)

## 🔑 Login Credentials

### Admin Access
- **URL:** http://localhost:3000/admin/dashboard
- **Email:** admin@annaischool.com
- **Password:** admin123

### Test Student Access
- **URL:** http://localhost:3000/dashboard
- **Email:** student@annaischool.com
- **Password:** student123

## 📋 Quick Tasks

### Update School Information
1. Login as admin
2. Go to "About Page"
3. Edit content
4. Click "Save Changes"

### Add News/Events
1. Login as admin
2. Go to "News Management"
3. Click "Add News"
4. Fill details and upload image
5. Click "Create News"

### Manage Carousel
1. Login as admin
2. Go to "Carousel"
3. Upload images
4. Set captions
5. Click "Add to Carousel"

### Review Applications
1. Login as admin
2. Go to "Applications"
3. Click on application
4. Update status
5. Add notes

## 🛠️ Common Commands

```bash
# Development
npm run dev                 # Start dev server

# Production
npm run build              # Build for production
npm start                  # Start production server

# Clean install
rm -rf node_modules .next
npm install
npm run dev

# Change port
npm run dev -- -p 3001

# Kill port
npx kill-port 3000
```

## 📁 Important Files

- `src/app/page.tsx` - Homepage
- `src/components/layout/footer.tsx` - Footer with contact info
- `src/components/layout/navbar.tsx` - Navigation
- `src/lib/auth.ts` - User credentials
- `data/` - All data storage

## 🎯 Next Steps

1. ✅ Change admin password
2. ✅ Update school contact information
3. ✅ Upload school images to carousel
4. ✅ Add news and events
5. ✅ Configure admission form fields
6. ✅ Test student application flow

## ⚠️ Important Notes

- Default credentials should be changed immediately
- Upload directories must exist before uploading files
- File size limit: 5MB for images
- Supported formats: JPG, PNG, WEBP

## 🆘 Need Help?

Check the main [README.md](README.md) for detailed documentation.

Contact: info@annaischool.edu | 94430 83242
