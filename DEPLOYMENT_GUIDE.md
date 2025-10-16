# 🚀 Deploy to Vercel + PlanetScale (FREE)

Complete guide to deploy your school website for FREE!

---

## 📋 **Step 1: Prepare Your Code**

### **1.1 Create .env.example**
This helps others (and you) know what environment variables are needed.

```bash
# Database (PlanetScale will provide these)
DATABASE_URL=mysql://username:password@host/database

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Optional: UploadThing (for file uploads)
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

### **1.2 Make sure .gitignore includes:**
```
.env
.env.local
node_modules/
.next/
```

### **1.3 Push to GitHub**
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for deployment"

# Create GitHub repo and push
git remote add origin https://github.com/your-username/school-website.git
git branch -M main
git push -u origin main
```

---

## 🗄️ **Step 2: Set Up PlanetScale Database**

### **2.1 Create PlanetScale Account**
1. Go to: https://planetscale.com/
2. Click **"Sign up for free"**
3. Sign up with GitHub (easiest)

### **2.2 Create Database**
1. Click **"Create a database"**
2. Name: `annai-school` (or your choice)
3. Region: **AWS / us-east-1** (or closest to your users)
4. Click **"Create database"**

### **2.3 Get Connection String**
1. Click **"Connect"**
2. Select **"Prisma"** (for mysql2 format)
3. Copy the **DATABASE_URL**
4. Save it somewhere safe!

Example format:
```
mysql://username:password@aws.connect.psdb.cloud/annai-school?ssl={"rejectUnauthorized":true}
```

### **2.4 Import Your Database**

**Option A: Using PlanetScale CLI**
```bash
# Install PlanetScale CLI
# Windows: scoop install pscale
# Mac: brew install planetscale/tap/pscale

# Login
pscale auth login

# Create a branch
pscale branch create annai-school main

# Import your database
pscale database restore-dump annai-school main --dump-file your_database_backup.sql
```

**Option B: Using Web Console**
1. Click **"Console"** tab in PlanetScale
2. Run your CREATE TABLE statements
3. Run your INSERT statements (for sample data)

### **2.5 Important PlanetScale Notes**
- Free tier: 1 database, 5GB storage, 1 billion row reads/month
- No foreign key constraints (PlanetScale limitation)
- Use connection string format for Next.js

---

## 🌐 **Step 3: Deploy to Vercel**

### **3.1 Create Vercel Account**
1. Go to: https://vercel.com/
2. Click **"Sign Up"**
3. Sign up with GitHub (easiest)

### **3.2 Import Your Project**
1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Vercel will auto-detect **Next.js**

### **3.3 Configure Project**
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### **3.4 Add Environment Variables**
Click **"Environment Variables"** and add:

```
DATABASE_URL = [paste your PlanetScale connection string]
NEXTAUTH_SECRET = [generate random string - see below]
NEXTAUTH_URL = https://your-project.vercel.app
```

**Generate NEXTAUTH_SECRET:**
```bash
# In your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **3.5 Deploy!**
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site is LIVE! 🎉

---

## 🔧 **Step 4: Update Database Connection**

Your app currently uses `mysql` package. For PlanetScale, we need to update it slightly.

### **4.1 Update mysql.ts file**

Open `src/lib/mysql.ts` and ensure it handles the connection string properly:

```typescript
import mysql from 'mysql'

const pool = mysql.createPool({
  connectionLimit: 10,
  // PlanetScale connection from DATABASE_URL
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'annai_school',
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true
  } : undefined
})
```

**OR** parse DATABASE_URL:
```typescript
// Parse DATABASE_URL if provided
if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL)
  config = {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1),
    ssl: { rejectUnauthorized: true }
  }
}
```

---

## ✅ **Step 5: Verify Deployment**

### **5.1 Test Your Site**
Visit: `https://your-project.vercel.app`

Test these pages:
- ✅ Homepage loads
- ✅ About page works
- ✅ Admissions page displays
- ✅ Contact form works
- ✅ Gallery shows images
- ✅ Admin login page

### **5.2 Test Admin Functions**
1. Go to `/auth/signin`
2. Login with admin credentials
3. Test:
   - ✅ Dashboard loads
   - ✅ Can view applications
   - ✅ Can edit carousel
   - ✅ Can manage content

### **5.3 Check Database**
- ✅ Forms submit successfully
- ✅ Data saves to PlanetScale
- ✅ Admin can view data

---

## 🎯 **Step 6: Custom Domain (Optional)**

### **6.1 Add Your Domain**
1. In Vercel dashboard, click **"Settings"**
2. Click **"Domains"**
3. Add your domain: `www.annaischool.edu` or `annaischool.edu`

### **6.2 Update DNS**
Add these records in your domain provider:

**For apex domain (annaischool.edu):**
```
A Record: 76.76.21.21
```

**For www subdomain:**
```
CNAME: cname.vercel-dns.com
```

### **6.3 Update NEXTAUTH_URL**
In Vercel environment variables, update:
```
NEXTAUTH_URL = https://annaischool.edu
```

Redeploy to apply changes.

---

## 📊 **Free Tier Limits**

### **Vercel Free Tier:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Fast global CDN

### **PlanetScale Free Tier:**
- ✅ 1 database
- ✅ 5GB storage
- ✅ 1 billion row reads/month
- ✅ Automatic backups (1 day retention)

**Perfect for your school website!**

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: Build fails - "Cannot find module mysql"**
**Fix:** Make sure mysql is in dependencies, not devDependencies
```bash
npm install mysql --save
```

### **Issue 2: Database connection fails**
**Fix:** Check your DATABASE_URL format
- Include `?ssl={"rejectUnauthorized":true}`
- No spaces in the URL
- Password should be URL-encoded

### **Issue 3: NextAuth error**
**Fix:** Make sure NEXTAUTH_URL matches your domain exactly
```
# Wrong:
NEXTAUTH_URL = https://your-project.vercel.app/

# Right:
NEXTAUTH_URL = https://your-project.vercel.app
```

### **Issue 4: Images not loading**
**Fix:** Update `next.config.ts` to allow external image domains
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

### **Issue 5: 504 Timeout on API routes**
**Fix:** Vercel serverless functions have 10s timeout on free tier
- Optimize database queries
- Add indexes to frequently queried columns
- Use connection pooling

---

## 🔄 **Continuous Deployment**

Once set up, every time you push to GitHub:
1. Vercel automatically detects the push
2. Builds your app
3. Deploys to production
4. Site updates in 2-3 minutes

```bash
# Make changes
git add .
git commit -m "Update homepage"
git push

# Vercel auto-deploys! 🚀
```

---

## 📈 **Next Steps After Deployment**

1. **Monitor Usage:**
   - Check Vercel Analytics
   - Monitor PlanetScale dashboard

2. **Optimize Performance:**
   - Add database indexes
   - Optimize images
   - Cache static content

3. **Security:**
   - Regular password updates
   - Monitor failed login attempts
   - Keep dependencies updated

4. **Backup:**
   - PlanetScale auto-backs up daily
   - Export important data monthly
   - Keep local backup

---

## 💡 **Pro Tips**

1. **Use Environment Preview:**
   - Each PR gets its own preview URL
   - Test before merging to main

2. **Database Branching:**
   - PlanetScale allows database branches
   - Safe schema changes
   - Merge when ready

3. **Monitor Errors:**
   - Check Vercel deployment logs
   - Set up error notifications
   - Use console logs for debugging

---

## 🆘 **Need Help?**

### **Vercel Docs:**
- https://vercel.com/docs

### **PlanetScale Docs:**
- https://planetscale.com/docs

### **Next.js Deployment:**
- https://nextjs.org/docs/deployment

---

## ✅ **Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] PlanetScale database created
- [ ] Database tables imported
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Successful deployment
- [ ] Homepage loads correctly
- [ ] Admin panel works
- [ ] Database connection verified
- [ ] Forms submit successfully
- [ ] Images display properly
- [ ] SSL certificate active
- [ ] Custom domain added (optional)

---

**Congratulations! Your school website is now LIVE! 🎉🎓**
