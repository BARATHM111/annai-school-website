-- Verify if branch_id column has been added to tables

-- Check student_application_form
SELECT 
    'student_application_form' as table_name,
    COLUMN_NAME, 
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'annai_school' 
  AND TABLE_NAME = 'student_application_form' 
  AND COLUMN_NAME = 'branch_id';

-- Check active_students
SELECT 
    'active_students' as table_name,
    COLUMN_NAME, 
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'annai_school' 
  AND TABLE_NAME = 'active_students' 
  AND COLUMN_NAME = 'branch_id';

-- Check all tables for branch_id
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'annai_school' 
  AND COLUMN_NAME = 'branch_id'
ORDER BY TABLE_NAME;

-- Count data by branch
SELECT 
    branch_id,
    COUNT(*) as record_count
FROM student_application_form 
GROUP BY branch_id;

-- If you see results, migration is complete!
-- If you see "Empty set" or "Unknown column", run the migration script:
-- mysql -u root -p annai_school < sql/add_branch_id_to_tables.sql
