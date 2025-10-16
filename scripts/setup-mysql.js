#!/usr/bin/env node

/**
 * MySQL Database Setup Script for Annai School Management System
 * This script sets up the MySQL database without Prisma
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

console.log('🚀 Setting up Annai School MySQL Database...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env file from env.example...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
    console.log('⚠️  Please edit .env file with your MySQL credentials before continuing\n');
    
    console.log('Required environment variables:');
    console.log('- DB_HOST: Your MySQL host (localhost)');
    console.log('- DB_PORT: MySQL port (3306)');
    console.log('- DB_USER: MySQL username (root)');
    console.log('- DB_PASSWORD: Your MySQL password');
    console.log('- DB_NAME: Database name (annai_school_db)');
    console.log('- NEXTAUTH_SECRET: A secure random string\n');
    
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

async function continueSetup() {
  try {
    // Load environment variables
    require('dotenv').config();
    
    console.log('\n🔧 Installing MySQL dependencies...');
    execSync('npm install mysql2 @types/mysql2', { stdio: 'inherit' });
    
    console.log('\n🗄️  Setting up MySQL database...');
    
    // Database connection config
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    };
    
    console.log(`Connecting to MySQL at ${dbConfig.host}:${dbConfig.port}...`);
    
    // Connect to MySQL
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('✅ Connected to MySQL');
    
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'DATABASE_SCHEMA_MYSQL.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('📄 Executing database schema...');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schema);
      console.log('✅ Database schema created successfully');
    } else {
      console.log('❌ DATABASE_SCHEMA_MYSQL.sql not found');
      process.exit(1);
    }
    
    await connection.end();
    
    console.log('\n🎉 MySQL database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Run "npm run dev" to start the development server');
    console.log('2. Visit http://localhost:3000 to see your application');
    console.log('3. Login with admin@annaischool.edu / admin123');
    console.log('4. (Optional) Run "npm run db:migrate" to migrate existing JSON data');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Ensure MySQL server is running');
    console.log('2. Check your database credentials in .env file');
    console.log('3. Verify MySQL user has CREATE DATABASE permissions');
    console.log('4. Make sure MySQL port is not blocked by firewall');
    process.exit(1);
  }
}
