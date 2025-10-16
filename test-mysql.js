// Quick test to verify MySQL connection
const { db, dbHelpers } = require('./src/lib/mysql.ts');

async function testMySQL() {
  console.log('🔍 Testing MySQL connection...');
  
  try {
    // Test admin function
    const admin = await dbHelpers.getAdminByEmail('admin@annaischool.edu');
    console.log('✅ Admin test:', admin ? 'Found admin user' : 'No admin found');
    
    // Test student function
    const student = await dbHelpers.getStudentByEmail('test@example.com');
    console.log('✅ Student test:', student ? 'Found student' : 'No student found (expected)');
    
    console.log('🎉 MySQL integration test completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMySQL();
