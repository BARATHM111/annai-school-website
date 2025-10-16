# Annai Matriculation School - School Management System

> **THE FOUNDATION OF YOUR CHILD'S FUTURE**

A comprehensive school management system built with Next.js 15, featuring student admission management, admin portal, news & events, and more.

## 🏫 About Annai Matriculation School

**Location:** Zeebra Garden, College Road, Tirupur - 641 602  
**Contact:** 94430 83242  
**Motto:** LOVE - SERVICE - PURITY

## 🚀 Features

### Public Portal
- **Homepage** - School information, achievements, and quick links
- **About Page** - School history, promoter information, and values
- **News & Events** - Latest school news and achievements
- **Admissions** - Online application form with document upload
- **Contact** - School contact information and inquiry form

### Student Portal
- **Dashboard** - Personalized student dashboard
- **Profile Management** - Update profile information and photo
- **Application Status** - Track admission application status
- **Results** - View application results and decisions

### Admin Portal
- **Dashboard** - Overview of applications and statistics
- **Applications Management** - Review and manage student applications
- **Students Management** - Manage enrolled students
- **News Management** - Create and manage school news
- **About Page Editor** - Edit school information
- **Carousel Management** - Manage homepage carousel images
- **Admission Control** - Configure admission form fields

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 (with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Authentication:** NextAuth.js
- **Forms:** React Hook Form + Zod
- **Database:** File-based JSON storage
- **Icons:** Lucide React

## 📦 Installation

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   cd Annai_school
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

   # Application Configuration
   NODE_ENV=development
   ```

4. **Create required directories**
   ```bash
   mkdir -p public/uploads/profiles
   mkdir -p public/uploads/documents
   mkdir -p public/uploads/carousel
   mkdir -p public/uploads/promoter
   mkdir -p public/uploads/news
   mkdir -p data
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Default Admin Credentials

**Email:** admin@annaischool.com  
**Password:** admin123

⚠️ **Important:** Change the default password after first login!

## 📁 Project Structure

```
Annai_school/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── (auth)/              # Authentication routes
│   │   │   └── signin/          # Login page
│   │   ├── admin/               # Admin portal routes
│   │   │   ├── about/           # Edit about page
│   │   │   ├── applications/    # Manage applications
│   │   │   ├── carousel/        # Manage carousel
│   │   │   ├── dashboard/       # Admin dashboard
│   │   │   ├── news/            # Manage news
│   │   │   └── students/        # Manage students
│   │   ├── admissions/          # Public admission routes
│   │   │   └── register/        # Application form
│   │   ├── api/                 # API routes
│   │   │   ├── admin/           # Admin APIs
│   │   │   ├── auth/            # Authentication APIs
│   │   │   ├── student/         # Student APIs
│   │   │   └── upload/          # File upload API
│   │   ├── student/             # Student portal routes
│   │   │   ├── profile/         # Student profile
│   │   │   └── results/         # Application results
│   │   ├── about/               # About page
│   │   ├── news/                # News & events page
│   │   └── page.tsx             # Homepage
│   ├── components/              # Reusable components
│   │   ├── admin/               # Admin components
│   │   ├── home/                # Homepage components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # UI components
│   ├── lib/                     # Utility functions
│   │   ├── auth.ts              # Authentication config
│   │   └── database.ts          # Database functions
│   └── hooks/                   # Custom React hooks
├── public/                      # Static files
│   └── uploads/                 # User uploads
├── data/                        # JSON data storage
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack

# Production
npm run build           # Build for production
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint

# Database (if using Prisma in future)
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:seed         # Seed database
```

## 📸 Features Walkthrough

### 1. Homepage
- Hero carousel with school images
- School statistics (students, teachers, years)
- About section preview
- Academic programs
- Latest news (first 3 items)
- Testimonials

### 2. Admin Dashboard
Navigate to `/admin/dashboard` after login

**Features:**
- Overview statistics
- Recent applications
- Quick actions
- System status

**Admin Sections:**
- **Applications:** Review, approve, or reject applications
- **Students:** Manage enrolled students
- **About Page:** Edit school information, promoter details
- **News:** Create and manage news items
- **Carousel:** Upload and manage homepage images
- **Admission Control:** Configure form fields

### 3. Student Application
Navigate to `/admissions/register`

**Process:**
1. Fill personal information
2. Add parent/guardian details
3. Enter academic information
4. Upload required documents
5. Submit application
6. Receive application ID
7. Track status at `/student/results`

### 4. News & Events
Navigate to `/news`

**Current News:**
- 100% Results Year after Year
- National Level Yoga Competition
- State Level Karate
- Admissions Open

## 🎨 Customization

### Updating School Information

1. **Contact Details**
   - Edit `src/components/layout/footer.tsx`

2. **About Page Content**
   - Login as admin
   - Navigate to "About Page" in admin sidebar
   - Update content, images, and promoter information
   - Click "Save Changes"

3. **Homepage Carousel**
   - Login as admin
   - Navigate to "Carousel"
   - Upload images (recommended: 1920x1080px)
   - Set captions and order

4. **News & Events**
   - Login as admin
   - Navigate to "News Management"
   - Add/edit/delete news items
   - Toggle publish/draft status

### Color Theme
The application uses Tailwind CSS with custom colors defined in `tailwind.config.ts`

## 🔐 Security Features

- Session-based authentication with NextAuth.js
- Role-based access control (Admin/Student)
- Secure password hashing
- File upload validation
- API route protection
- CSRF protection

## 📊 Data Storage

Currently uses file-based JSON storage:
- Applications: `data/applications.json`
- Students: `data/students.json`
- About Content: `data/about-content.json`
- Users: `data/users.json`

**Note:** Can be migrated to a database (MySQL/PostgreSQL) in the future.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
```

### Upload Issues
Check that upload directories exist:
```bash
mkdir -p public/uploads/{profiles,documents,carousel,promoter,news}
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf .next node_modules
npm install
npm run dev
```

## 📝 Admin Tasks

### Adding a New Admin User
1. Open `src/lib/auth.ts`
2. Add user to `users` array
3. Restart the server

### Reviewing Applications
1. Login as admin
2. Go to "Applications"
3. View application details
4. Update status (Pending/Approved/Rejected/Waitlist)
5. Add notes if needed

### Managing News
1. Login as admin
2. Go to "News Management"
3. Click "Add News"
4. Fill details and upload image (optional)
5. Set status (Published/Draft)
6. Click "Create News"

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Set environment variables
4. Deploy

### Other Platforms
The application can be deployed to:
- Netlify
- Railway
- AWS
- DigitalOcean
- Any Node.js hosting

## 📧 Support

For technical support or queries:
- **Email:** info@annaischool.edu
- **Phone:** 94430 83242

## 📄 License

© 2025 Annai Matriculation School. All rights reserved.

## 🙏 Acknowledgments

Built with modern web technologies to provide the best experience for students, parents, and administrators.

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Maintained by:** Annai Matriculation School IT Team
#   a n n a i - s c h o o l - w e b s i t e  
 