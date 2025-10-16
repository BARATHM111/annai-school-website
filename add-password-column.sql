-- Add password column to student table
USE annai_school;

ALTER TABLE student 
ADD COLUMN password VARCHAR(255) NULL AFTER nationality;

-- Verify the column was added
DESCRIBE student;

SELECT 'Password column added successfully!' as status;
