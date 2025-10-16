const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Database Structure...\n');

const dataDir = path.join(__dirname, 'data');
const requiredFiles = [
  'profiles.json',
  'applications.json', 
  'students.json',
  'enrollments.json',
  'form-config.json',
  'about-content.json',
  'news.json',
  'carousel.json',
  'announcements.json'
];

let allValid = true;

requiredFiles.forEach(fileName => {
  const filePath = path.join(dataDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Missing: ${fileName}`);
    allValid = false;
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Check specific structures
    if (fileName === 'form-config.json') {
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ ${fileName} - ${data.length} form fields configured`);
      } else {
        console.log(`⚠️  ${fileName} - No form fields found`);
      }
    } else if (fileName === 'about-content.json') {
      if (data.title && data.subtitle) {
        console.log(`✅ ${fileName} - About content configured`);
      } else {
        console.log(`⚠️  ${fileName} - About content incomplete`);
      }
    } else if (fileName === 'carousel.json') {
      if (Array.isArray(data) && data.length > 0) {
        console.log(`✅ ${fileName} - ${data.length} carousel slides`);
      } else {
        console.log(`✅ ${fileName} - Empty (ready for content)`);
      }
    } else {
      console.log(`✅ ${fileName} - Valid JSON structure`);
    }
    
  } catch (error) {
    console.log(`❌ ${fileName} - Invalid JSON: ${error.message}`);
    allValid = false;
  }
});

console.log('\n📊 Database Status:');
if (allValid) {
  console.log('🎉 All database files are valid and ready!');
  console.log('\n🚀 Ready to start the application:');
  console.log('1. npm run dev (or your start command)');
  console.log('2. Navigate to /auth/signup to create admin user');
  console.log('3. Test the complete admission flow');
} else {
  console.log('❌ Some issues found. Please run: node reset-database.js');
}

console.log('\n📋 Form Configuration Summary:');
try {
  const formConfig = JSON.parse(fs.readFileSync(path.join(dataDir, 'form-config.json'), 'utf8'));
  const sections = {};
  
  formConfig.forEach(field => {
    if (!sections[field.section]) {
      sections[field.section] = 0;
    }
    sections[field.section]++;
  });
  
  Object.entries(sections).forEach(([section, count]) => {
    console.log(`   ${section}: ${count} fields`);
  });
} catch (error) {
  console.log('   Could not read form configuration');
}
