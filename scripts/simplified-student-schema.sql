-- =====================================================
-- SIMPLIFIED STUDENT APPLICATION SCHEMA
-- =====================================================
-- Simplified schema with only essential fields
-- Run this to update your existing table

USE annai_school;

-- Drop existing table if you want to start fresh (CAUTION: This deletes all data)
-- DROP TABLE IF EXISTS student_application_form;

-- Create simplified student_application_form table
CREATE TABLE IF NOT EXISTS student_application_form (
    id VARCHAR(36) PRIMARY KEY,
    applicationId VARCHAR(50) UNIQUE NOT NULL,
    
    -- Student Information (mandatory)
    studentName VARCHAR(200) NOT NULL,
    
    -- Parent Information (mandatory)
    parentName VARCHAR(200) NOT NULL,
    
    -- Contact Information
    phoneNumber VARCHAR(20) NOT NULL UNIQUE,
    alternateNumber VARCHAR(20),
    
    -- Academic Information (mandatory)
    applyingForClass VARCHAR(50) NOT NULL,
    
    -- Authentication (auto-generated and mandatory)
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    
    -- Status and Metadata
    status ENUM('pending', 'submitted', 'under_review', 'approved', 'rejected') DEFAULT 'submitted',
    appliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for faster queries
    INDEX idx_username (username),
    INDEX idx_phone (phoneNumber),
    INDEX idx_status (status),
    INDEX idx_application_id (applicationId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- If you're modifying existing table, use ALTER TABLE instead:
/*
ALTER TABLE student_application_form 
  MODIFY COLUMN studentName VARCHAR(200) NOT NULL,
  MODIFY COLUMN parentName VARCHAR(200) NOT NULL,
  MODIFY COLUMN phoneNumber VARCHAR(20) NOT NULL,
  ADD COLUMN alternateNumber VARCHAR(20) AFTER phoneNumber,
  MODIFY COLUMN applyingForClass VARCHAR(50) NOT NULL,
  ADD COLUMN username VARCHAR(50) UNIQUE NOT NULL AFTER applyingForClass,
  ADD INDEX idx_username (username),
  ADD INDEX idx_phone (phoneNumber);
*/

SELECT 'Simplified student schema ready!' as status;
