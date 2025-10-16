#!/usr/bin/env node

/**
 * Database Setup Script for Annai School Management System
 * This script helps set up the database without TypeScript compilation issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Annai School Database...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env file from env.example...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
    console.log('⚠️  Please edit .env file with your database credentials before continuing\n');
    
    console.log('Required environment variables:');
    console.log('- DATABASE_URL: Your PostgreSQL connection string');
    console.log('- NEXTAUTH_SECRET: A secure random string');
    console.log('- NEXTAUTH_URL: Your application URL (http://localhost:3000 for development)\n');
    
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Have you configured your .env file? (y/N): ', (answer) => {
      readline.close();
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('Please configure your .env file and run this script again.');
        process.exit(0);
      }
      continueSetup();
    });
  } else {
    console.log('❌ env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
  continueSetup();
}

function continueSetup() {
  try {
    console.log('\n🔧 Installing Prisma dependencies...');
    execSync('npm install @prisma/client prisma', { stdio: 'inherit' });
    
    console.log('\n📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('\n🗄️  Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('\n🌱 Seeding database with initial data...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run "npm run dev" to start the development server');
    console.log('2. Visit http://localhost:3000 to see your application');
    console.log('3. Login with admin@annaischool.edu / admin123');
    console.log('4. (Optional) Run "npx tsx scripts/migrate-data.ts" to migrate existing JSON data');
    console.log('5. (Optional) Run "npx prisma studio" to view your database');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure PostgreSQL is running');
    console.log('2. Check your DATABASE_URL in .env file');
    console.log('3. Verify database credentials and permissions');
    console.log('4. Make sure the database exists');
    process.exit(1);
  }
}
