# 🚀 QUICK DEPLOYMENT - Start Here!

Follow these steps in order. Takes about 15-20 minutes total.

---

## ✅ **Step 1: Push to GitHub (5 minutes)**

### Open terminal in your project folder:

```bash
# Check if git is initialized
git status

# If not initialized:
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/school-website.git
git branch -M main
git push -u origin main
```

**✅ Done when:** Your code is on GitHub

---

## ✅ **Step 2: Create PlanetScale Database (10 minutes)**

### **2.1 Sign Up**
1. Go to: **https://planetscale.com/**
2. Click **"Sign up for free"**
3. Choose **"Sign up with GitHub"** (easiest)
4. Authorize PlanetScale

### **2.2 Create Database**
1. Click **"Create a database"** button
2. Name: `annai-school`
3. Region: Select **AWS / us-east** (or closest to India)
4. Click **"Create database"**
5. Wait 30 seconds for creation

### **2.3 Get Connection String**
1. Click **"Connect"** button
2. In "Connect with" dropdown, select **"Node.js"**
3. You'll see something like:
```
Host: aws.connect.psdb.cloud
Username: xxxxxxxxx
Password: ************************
Database: annai-school
```
4. **COPY** the full connection URL
5. Save it in a text file for now

### **2.4 Import Your Database**

**Option A: Using Console (Easiest)**
1. Click **"Console"** tab
2. Copy your database schema from local MySQL
3. Paste and run each CREATE TABLE statement
4. Then run your sample data INSERT statements

**Option B: Export/Import**
```bash
# Export from your local MySQL
mysqldump -u root -p annai_school > database_backup.sql

# Then import via PlanetScale CLI or console
```

**✅ Done when:** You have your connection string saved

---

## ✅ **Step 3: Deploy to Vercel (5 minutes)**

### **3.1 Sign Up**
1. Go to: **https://vercel.com/**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### **3.2 Import Project**
1. Click **"Add New..."** → **"Project"**
2. Find your `school-website` repository
3. Click **"Import"**

### **3.3 Configure**
Vercel will auto-detect Next.js. Just click **"Deploy"**!

Wait... it will fail! That's expected. We need environment variables.

### **3.4 Add Environment Variables**
1. Go to your project settings
2. Click **"Settings"** → **"Environment Variables"**
3. Add these THREE variables:

**Variable 1:**
```
Name: DATABASE_URL
Value: [paste your PlanetScale connection string]
```

**Variable 2:**
Generate a random secret:
```bash
# Run this in your terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Then:
```
Name: NEXTAUTH_SECRET
Value: [paste the generated string]
```

**Variable 3:**
```
Name: NEXTAUTH_URL
Value: https://your-project-name.vercel.app
```
(You'll see your exact URL after first deployment)

### **3.5 Redeploy**
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the failed deployment
3. Or push a new commit to GitHub

**✅ Done when:** Deployment shows ✅ Success

---

## ✅ **Step 4: Test Your Site (2 minutes)**

### Visit your site:
```
https://your-project-name.vercel.app
```

### Test these pages:
- ✅ Homepage loads
- ✅ `/about` works
- ✅ `/admissions` works  
- ✅ `/contact` works
- ✅ `/auth/signin` loads

### Test admin:
1. Go to `/auth/signin`
2. Login with your admin credentials
3. Check dashboard works

**✅ Done when:** Everything works!

---

## 🎉 **You're LIVE!**

Your school website is now deployed for FREE on:
- ✅ Vercel (Frontend & API)
- ✅ PlanetScale (Database)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Auto-deployments on git push

---

## 🔄 **Making Updates**

From now on, to update your site:

```bash
# Make your changes
# Then:
git add .
git commit -m "Update xyz"
git push

# Vercel auto-deploys in 2 minutes! 🚀
```

---

## ❓ **Troubleshooting**

### **Build fails with "Cannot find module"**
```bash
# Make sure all dependencies are installed:
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### **Database connection error**
- Double-check your DATABASE_URL in Vercel
- Make sure PlanetScale database is active
- Try regenerating the connection string

### **NextAuth error**
- Make sure NEXTAUTH_URL exactly matches your Vercel URL
- No trailing slash!
- Redeploy after changing env vars

### **Site works but admin doesn't**
- Check that database tables were imported
- Verify admin user exists in database
- Check browser console for errors

---

## 📞 **Need Help?**

Check the full guide: **DEPLOYMENT_GUIDE.md**

Or common issues:
1. **Database schema not imported** → Run SQL in PlanetScale Console
2. **Env variables wrong** → Double check in Vercel Settings
3. **Build timeout** → Contact me, might need optimization

---

## ✨ **Next Steps**

Once everything works:

1. **Add custom domain** (optional)
   - Buy domain from Hostinger/GoDaddy
   - Point to Vercel
   - Update NEXTAUTH_URL

2. **Monitor usage**
   - Check Vercel Analytics
   - Watch PlanetScale metrics

3. **Optimize**
   - Add database indexes
   - Compress images
   - Cache static content

---

**Your school website is now LIVE and FREE! 🎓🌐**

Share it with the world! 🚀
