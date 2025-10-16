# 🚀 Railway Deployment - Quick Start

15-minute deployment guide!

---

## ✅ **What I Just Updated:**

Your `src/lib/mysql.ts` now supports **Railway's environment variables** automatically! ✨

No code changes needed - just add Railway variables to Vercel!

---

## 🎯 **Quick Steps:**

### **1. Create Railway Account (2 min)**
```
→ Go to: https://railway.app/
→ Click "Start a New Project"
→ Login with GitHub
→ Get $5 FREE credit automatically!
```

### **2. Create MySQL Database (1 min)**
```
→ Click "New Project"
→ Select "Provision MySQL"
→ Done! Database created instantly!
```

### **3. Get Your Connection Details (1 min)**
```
→ Click your MySQL service
→ Go to "Variables" tab
→ Copy these values:

MYSQLHOST = containers-us-west-xxx.railway.app
MYSQLPORT = 3306
MYSQLUSER = root
MYSQLPASSWORD = xxxxxxxxxxxxx
MYSQLDATABASE = railway
```

### **4. Import Your Database (5 min)**
```bash
# Option A: Use Railway Query interface
→ Click "Data" → "Query"
→ Paste your CREATE TABLE statements
→ Run
→ Paste your INSERT statements
→ Run

# Option B: Command line
mysqldump -u root -p annai_school > backup.sql
mysql -h [MYSQLHOST] -u root -p[MYSQLPASSWORD] railway < backup.sql
```

### **5. Push to GitHub (1 min)**
```bash
git add .
git commit -m "Added Railway support"
git push
```

### **6. Deploy to Vercel (3 min)**
```
→ Go to: https://vercel.com/
→ Sign up with GitHub
→ Import your repository
→ Add Environment Variables (see below)
→ Click "Deploy"
```

### **7. Add Environment Variables to Vercel (2 min)**
```
Copy from Railway and paste in Vercel:

MYSQLHOST = [from Railway]
MYSQLPORT = 3306
MYSQLUSER = root
MYSQLPASSWORD = [from Railway]
MYSQLDATABASE = railway

Also add:
NEXTAUTH_SECRET = [run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
NEXTAUTH_URL = https://your-project.vercel.app
```

### **8. Update NEXTAUTH_URL (1 min)**
```
→ After first deployment, copy your Vercel URL
→ Go to Vercel Settings → Environment Variables
→ Update NEXTAUTH_URL to match your real URL
→ Redeploy
```

---

## ✅ **Verification:**

Visit your site and test:
- ✅ Homepage loads
- ✅ `/auth/signin` - Admin login works
- ✅ Dashboard displays data
- ✅ Forms submit to database
- ✅ No connection errors

---

## 💰 **Cost:**

- Railway: **$5 credit/month** (auto-renews)
- Your usage: **~$0.20-0.50/month**
- Vercel: **FREE**
- **Total: $0/month** ✅

---

## 🆘 **Troubleshooting:**

### Can't connect to database?
```
→ Double-check MYSQLHOST and MYSQLPASSWORD
→ No spaces in environment variables
→ Verify Railway database is running
```

### Build fails?
```bash
npm install
git add package-lock.json
git commit -m "Update deps"
git push
```

### Admin login doesn't work?
```
→ Check NEXTAUTH_URL matches Vercel URL exactly
→ No trailing slash!
→ Redeploy after changing env vars
```

---

## 🎉 **You're Done!**

Your school website is now:
- ✅ Live on Vercel
- ✅ Using Railway MySQL
- ✅ Auto-deploys on git push
- ✅ FREE (within credits)
- ✅ HTTPS enabled
- ✅ Global CDN

---

## 📚 **Full Guide:**

See `DEPLOY_RAILWAY_GUIDE.md` for complete documentation!

---

**Your site is LIVE! Share the URL! 🌐🎓**
