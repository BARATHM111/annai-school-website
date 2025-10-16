# 🚂 Deploy to Railway + Vercel (FREE)

Complete guide - keeps your MySQL database as-is!

---

## 🎯 **The Setup:**

- **Railway:** MySQL Database (free $5 credit/month)
- **Vercel:** Next.js Hosting (free)
- **Total Time:** 15-20 minutes
- **No code changes needed!** ✅

---

## 📋 **Step 1: Create Railway Account (2 minutes)**

### **1.1 Sign Up**
1. Go to: **https://railway.app/**
2. Click **"Start a New Project"** or **"Login"**
3. Choose **"Login with GitHub"** (easiest)
4. Authorize Railway

### **1.2 Verify Email** (if asked)
- Check your email
- Click verification link
- You get **$5 FREE credit** automatically! 💰

**✅ Done when:** You see the Railway dashboard

---

## 🗄️ **Step 2: Create MySQL Database (3 minutes)**

### **2.1 Create New Project**
1. Click **"New Project"**
2. Select **"Provision MySQL"**
3. Railway instantly creates your database! ⚡

### **2.2 Get Connection Details**
1. Click on your **MySQL** service
2. Go to **"Variables"** tab
3. You'll see:
```
MYSQLHOST = containers-us-west-xxx.railway.app
MYSQLPORT = 3306
MYSQLUSER = root
MYSQLPASSWORD = xxxxxxxxxxxxxxxxxx
MYSQLDATABASE = railway
```

### **2.3 Get Connection String**
In the Variables tab, look for or create:
```
DATABASE_URL = mysql://root:password@host:3306/railway
```

**Copy this entire connection string!** Save it for later.

**✅ Done when:** You have your DATABASE_URL saved

---

## 📊 **Step 3: Import Your Database (5 minutes)**

### **Option A: Using Railway's MySQL Console (Easiest)**

1. In Railway, click your **MySQL service**
2. Click **"Data"** tab
3. Click **"Query"** 
4. Paste your CREATE TABLE statements
5. Click **"Run"**
6. Then paste your INSERT statements
7. Click **"Run"** again

### **Option B: Using MySQL Workbench**

1. In Railway, click your **MySQL service**
2. Click **"Connect"** tab
3. Copy the connection command
4. Use MySQL Workbench to connect:
```
Host: [MYSQLHOST from Railway]
Port: 3306
Username: root
Password: [MYSQLPASSWORD from Railway]
Database: railway
```

5. Import your SQL file

### **Option C: Using Command Line**

1. Export your local database:
```bash
mysqldump -u root -p annai_school > backup.sql
```

2. Connect to Railway:
```bash
mysql -h [MYSQLHOST] -P 3306 -u root -p[MYSQLPASSWORD] railway < backup.sql
```

**⚠️ Important:** Replace `[MYSQLHOST]` and `[MYSQLPASSWORD]` with your actual values!

**✅ Done when:** Your tables and data are in Railway

---

## 🔧 **Step 4: Update Environment Variables Format (Optional)**

Railway provides variables in this format:
```
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=xxxxxxxxxx
MYSQLDATABASE=railway
```

Your app uses:
```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

**Solution:** Update your `mysql.ts` to support both formats!

### **4.1 Update src/lib/mysql.ts**

Add this at the top of your config:

```typescript
// Support both Railway and custom env var formats
const config = {
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'annai_school',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : undefined
}
```

This way it works with Railway's variable names!

**✅ Done when:** mysql.ts supports Railway variables

---

## 🌐 **Step 5: Deploy to Vercel (5 minutes)**

### **5.1 Push to GitHub**
```bash
git add .
git commit -m "Ready for Railway deployment"
git push
```

### **5.2 Sign Up on Vercel**
1. Go to: **https://vercel.com/**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### **5.3 Import Project**
1. Click **"Add New..."** → **"Project"**
2. Select your **school-website** repository
3. Click **"Import"**

### **5.4 Add Environment Variables**

Click **"Environment Variables"** and add these:

**From Railway (copy from Railway Variables tab):**
```
MYSQLHOST = [your Railway MySQL host]
MYSQLPORT = 3306
MYSQLUSER = root
MYSQLPASSWORD = [your Railway MySQL password]
MYSQLDATABASE = railway
```

**Generate NextAuth Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then add:
```
NEXTAUTH_SECRET = [paste generated secret]
NEXTAUTH_URL = https://your-project.vercel.app
```

*(You'll update NEXTAUTH_URL after first deployment)*

### **5.5 Deploy!**
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://your-project-abc123.vercel.app`

### **5.6 Update NEXTAUTH_URL**
1. Go to Vercel **Settings** → **Environment Variables**
2. Edit **NEXTAUTH_URL**
3. Update to your actual Vercel URL
4. Click **"Save"**
5. Redeploy (click **"Deployments"** → **"Redeploy"**)

**✅ Done when:** Your site is live!

---

## ✅ **Step 6: Test Everything (3 minutes)**

### **6.1 Test Public Pages**
Visit: `https://your-project.vercel.app`

- ✅ Homepage loads
- ✅ About page works
- ✅ Contact page loads
- ✅ Gallery displays
- ✅ Forms work

### **6.2 Test Admin Panel**
1. Go to: `https://your-project.vercel.app/auth/signin`
2. Login with admin credentials
3. Check:
   - ✅ Dashboard displays
   - ✅ Can view data
   - ✅ Can edit content
   - ✅ Database connections work

### **6.3 Check Railway Usage**
1. Go to Railway dashboard
2. Click **"Usage"**
3. Should show minimal usage (~$0.10-0.50)

**✅ Done when:** Everything works perfectly!

---

## 💰 **Railway Free Credits**

### **What You Get:**
- **$5 FREE credit** per month
- Renews automatically every month
- No credit card required for starter

### **What Your App Uses:**
- **MySQL database:** ~$0.20-0.50/month
- **Your total:** Stays well within $5! ✅

### **Upgrade Later (Optional):**
- Add credit card to remove usage limits
- Pay only what you use beyond $5
- Typical cost: $1-3/month for small school site

---

## 🔄 **Continuous Deployment**

### **How it Works:**
Every time you push to GitHub:
1. Vercel automatically detects the push
2. Builds your Next.js app
3. Deploys to production
4. Updates in 2-3 minutes

### **Make Updates:**
```bash
# Make your changes
git add .
git commit -m "Updated homepage"
git push

# Vercel auto-deploys! 🚀
# Database stays on Railway
```

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: "Cannot connect to database"**

**Check:**
- Environment variables are correct in Vercel
- Railway MySQL is running (check dashboard)
- No typos in MYSQLHOST or MYSQLPASSWORD

**Fix:**
```bash
# Test connection locally:
mysql -h [MYSQLHOST] -u root -p[MYSQLPASSWORD] railway
```

### **Issue 2: "Tables not found"**

**Fix:** Import your database schema to Railway
```bash
# Export from local:
mysqldump -u root -p annai_school > schema.sql

# Import to Railway:
mysql -h [MYSQLHOST] -u root -p[MYSQLPASSWORD] railway < schema.sql
```

### **Issue 3: "Build fails on Vercel"**

**Fix:** Make sure all dependencies are installed
```bash
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### **Issue 4: "Railway suspended my database"**

**Cause:** Exceeded $5 credit (rare for small apps)

**Fix:** 
- Check Railway usage dashboard
- Optimize queries if needed
- Add credit card (pay only excess)

### **Issue 5: "Admin login doesn't work"**

**Check:**
- NEXTAUTH_URL matches your Vercel domain exactly
- No trailing slash
- NEXTAUTH_SECRET is set

**Fix:** Redeploy after updating environment variables

---

## 📈 **Monitor Your Deployment**

### **Railway Dashboard:**
- Check database usage
- View logs
- Monitor uptime
- See credit usage

### **Vercel Dashboard:**
- View deployment status
- Check analytics
- See build logs
- Monitor performance

---

## 🎯 **Production Checklist**

- [ ] Railway MySQL database created
- [ ] Database schema imported
- [ ] Sample data imported
- [ ] Connection tested
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] NEXTAUTH_URL updated
- [ ] Redeployed with correct URL
- [ ] Homepage loads correctly
- [ ] Admin panel works
- [ ] Forms submit successfully
- [ ] Database queries work
- [ ] Images display properly

---

## 🚀 **Next Steps**

### **1. Add Custom Domain (Optional)**
- Buy domain from Hostinger/GoDaddy
- Add to Vercel settings
- Update DNS records
- Update NEXTAUTH_URL

### **2. Optimize Performance**
- Add database indexes
- Enable Railway connection pooling
- Optimize images
- Cache static content

### **3. Monitor Usage**
- Check Railway credits weekly
- Monitor Vercel bandwidth
- Watch for errors in logs

### **4. Backup Data**
- Railway auto-backs up daily
- Export important data monthly
- Keep local backup

---

## 💡 **Pro Tips**

1. **Railway Sleeps Database:**
   - Free tier databases sleep after inactivity
   - First query might be slower (cold start)
   - Add health check to keep it warm

2. **Vercel Preview Deployments:**
   - Every branch gets preview URL
   - Test before merging
   - Share with team

3. **Environment Variables:**
   - Use Railway environment variables
   - Don't hardcode credentials
   - Different values for preview/production

4. **Database Optimization:**
   - Add indexes to frequently queried columns
   - Use connection pooling
   - Limit query results

---

## 📞 **Get Help**

### **Railway Docs:**
https://docs.railway.app/

### **Vercel Docs:**
https://vercel.com/docs

### **Railway Discord:**
https://discord.gg/railway

### **Vercel Support:**
https://vercel.com/support

---

## ✅ **Summary**

**What You Did:**
1. ✅ Created Railway MySQL database
2. ✅ Imported your school data
3. ✅ Connected to Vercel
4. ✅ Deployed Next.js app
5. ✅ Site is LIVE!

**What You Get:**
- ✅ FREE hosting (Vercel)
- ✅ FREE database (Railway $5 credit)
- ✅ Automatic deployments
- ✅ HTTPS included
- ✅ Global CDN

**Cost:** $0/month (within free credits) 💰

---

**Congratulations! Your school website is LIVE! 🎓🎉**

Share it with the world! 🌐
