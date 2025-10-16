# 🎯 Deployment Command Cheat Sheet

Quick reference for all deployment commands.

---

## 📦 **Git Commands**

```bash
# Initialize git (if not done)
git init

# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your message here"

# Add GitHub remote (first time only)
git remote add origin https://github.com/YOUR-USERNAME/school-website.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

# Future pushes (after first time)
git push
```

---

## 🔑 **Generate NextAuth Secret**

```bash
# Windows (Command Prompt)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Mac/Linux
openssl rand -base64 32
```

---

## 🗄️ **Database Export/Import**

### **Export from local MySQL:**
```bash
# Full database
mysqldump -u root -p annai_school > database_backup.sql

# Specific tables only
mysqldump -u root -p annai_school carousel_images achievers published_news > tables_backup.sql

# Schema only (no data)
mysqldump -u root -p --no-data annai_school > schema_only.sql

# Data only (no schema)
mysqldump -u root -p --no-create-info annai_school > data_only.sql
```

### **Import to MySQL:**
```bash
# Import full backup
mysql -u root -p annai_school < database_backup.sql

# Import specific file
mysql -u root -p annai_school < tables_backup.sql
```

---

## 🚀 **NPM Commands**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server (locally)
npm start

# Run linting
npm run lint

# Update all packages
npm update

# Install specific package
npm install package-name

# Remove package
npm uninstall package-name
```

---

## 🌐 **Vercel CLI (Optional)**

Install Vercel CLI:
```bash
npm install -g vercel
```

Deploy from command line:
```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Add environment variable
vercel env add

# Pull environment variables
vercel env pull
```

---

## 🗃️ **PlanetScale CLI (Optional)**

Install PlanetScale CLI:

**Windows:**
```bash
scoop install pscale
```

**Mac:**
```bash
brew install planetscale/tap/pscale
```

**Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/planetscale/cli/main/install.sh | sh
```

Use PlanetScale CLI:
```bash
# Login
pscale auth login

# List databases
pscale database list

# Create database
pscale database create annai-school --region us-east

# Connect to database
pscale shell annai-school main

# Create branch
pscale branch create annai-school dev

# Import data
pscale database restore-dump annai-school main --dump-file database_backup.sql

# Get connection string
pscale connect annai-school main
```

---

## 🔍 **Useful Check Commands**

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version

# Check what's being tracked by Git
git ls-files

# Check remote URL
git remote -v

# View commit history
git log --oneline

# Check current branch
git branch

# Check environment variables (Vercel)
vercel env ls

# Test database connection
node -e "require('mysql').createConnection({host:'localhost',user:'root',password:'',database:'annai_school'}).connect(err => console.log(err || 'Connected!'))"
```

---

## 🧪 **Testing Commands**

```bash
# Test local build
npm run build && npm start

# Check for build errors
npm run build

# Test specific page (with curl)
curl http://localhost:3000

# Check port usage (Windows)
netstat -ano | findstr :3000

# Check port usage (Mac/Linux)
lsof -i :3000

# Kill process on port 3000 (Windows)
taskkill /F /PID <pid>

# Kill process on port 3000 (Mac/Linux)
kill -9 <pid>
```

---

## 📝 **Quick Workflow**

### **Daily Development:**
```bash
# Start coding
git pull                    # Get latest changes
npm run dev                 # Start dev server
# Make changes...
git add .                   # Stage changes
git commit -m "Message"     # Commit
git push                    # Push to GitHub
# Vercel auto-deploys! ✨
```

### **After Making Changes:**
```bash
git add .
git commit -m "Updated homepage design"
git push
# Wait 2-3 minutes for auto-deployment
```

### **Checking Deployment:**
```bash
# Via Vercel dashboard
https://vercel.com/dashboard

# Or via CLI
vercel ls
vercel logs
```

---

## 🔐 **Environment Variables**

### **Local Development (.env.local):**
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=annai_school
NEXTAUTH_SECRET=local-dev-secret
NEXTAUTH_URL=http://localhost:3000
```

### **Production (Vercel Dashboard):**
```
DATABASE_URL=mysql://user:pass@host/db?ssl={"rejectUnauthorized":true}
NEXTAUTH_SECRET=production-secret-from-crypto
NEXTAUTH_URL=https://your-domain.vercel.app
```

---

## 🆘 **Emergency Commands**

### **Vercel deployment stuck:**
```bash
# Cancel current deployment
vercel rm deployment-url --yes

# Force redeploy
vercel --force
```

### **Database locked:**
```bash
# Check PlanetScale status
pscale database show annai-school

# Reconnect
pscale connect annai-school main
```

### **Node modules corrupted:**
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Git issues:**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD

# Force push (careful!)
git push --force
```

---

## 📚 **Useful Links**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **PlanetScale Dashboard:** https://app.planetscale.com/
- **GitHub Repos:** https://github.com/YOUR-USERNAME
- **Vercel Docs:** https://vercel.com/docs
- **PlanetScale Docs:** https://planetscale.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Save this file for quick reference! 📌**
