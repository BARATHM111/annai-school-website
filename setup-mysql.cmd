@echo off
echo 🚀 Setting up MySQL Database for Annai School Management System
echo.

echo 📦 Installing MySQL dependencies...
npm install mysql2 @types/mysql2

echo.
echo 🔧 Running database setup...
npm run db:setup

echo.
echo ✅ Setup complete! 
echo.
echo Next steps:
echo 1. Configure your .env file with MySQL credentials
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.
pause
