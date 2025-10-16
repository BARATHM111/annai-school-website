-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: annai_school
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `about_content`
--

DROP TABLE IF EXISTS `about_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_content` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isVisible` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_about_section` (`section`),
  KEY `idx_about_isVisible` (`isVisible`),
  KEY `idx_about_displayOrder` (`displayOrder`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_content`
--

LOCK TABLES `about_content` WRITE;
/*!40000 ALTER TABLE `about_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `about_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_facilities`
--

DROP TABLE IF EXISTS `about_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_facilities` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `visible` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `about_facilities_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_facilities`
--

LOCK TABLES `about_facilities` WRITE;
/*!40000 ALTER TABLE `about_facilities` DISABLE KEYS */;
INSERT INTO `about_facilities` VALUES ('40d819eb-aa50-11f0-85b6-0ec6b53a0158','tirupur','Computer Lab','Modern computer lab equipped with latest technology to help students develop digital literacy and coding skills.','/images/about/computer-lab.jpg',1,1,'2025-10-16 05:23:31'),('40d81f30-aa50-11f0-85b6-0ec6b53a0158','tirupur','Library','Well-stocked library with a wide collection of books, magazines, and digital resources to foster a love for reading.','/images/about/library.jpg',2,1,'2025-10-16 05:23:31'),('40d820ef-aa50-11f0-85b6-0ec6b53a0158','tirupur','Chemistry Lab','Fully equipped science laboratory where students conduct experiments and explore scientific concepts hands-on.','/images/about/chemistry-lab.jpg',3,1,'2025-10-16 05:23:31'),('40d821f4-aa50-11f0-85b6-0ec6b53a0158','tirupur','Play Area','Safe and spacious playground for physical activities, sports, and recreation to ensure overall development.','/images/about/play-area.jpg',4,1,'2025-10-16 05:23:31'),('799f1177-aa50-11f0-85b6-0ec6b53a0158','uthukuli','Computer Lab','Modern computer lab equipped with latest technology to help students develop digital literacy and coding skills.','/images/about/computer-lab.jpg',1,1,'2025-10-16 05:25:06'),('799fe747-aa50-11f0-85b6-0ec6b53a0158','uthukuli','Library','Well-stocked library with a wide collection of books, magazines, and digital resources to foster a love for reading.','/images/about/library.jpg',2,1,'2025-10-16 05:25:06'),('79a0b16a-aa50-11f0-85b6-0ec6b53a0158','uthukuli','Chemistry Lab','Fully equipped science laboratory where students conduct experiments and explore scientific concepts hands-on.','/images/about/chemistry-lab.jpg',3,1,'2025-10-16 05:25:06'),('79a1a99d-aa50-11f0-85b6-0ec6b53a0158','uthukuli','Play Area','Safe and spacious playground for physical activities, sports, and recreation to ensure overall development.','/images/about/play-area.jpg',4,1,'2025-10-16 05:25:06');
/*!40000 ALTER TABLE `about_facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_sections`
--

DROP TABLE IF EXISTS `about_sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_sections` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` text COLLATE utf8mb4_unicode_ci,
  `main_content` text COLLATE utf8mb4_unicode_ci,
  `vision` text COLLATE utf8mb4_unicode_ci,
  `mission` text COLLATE utf8mb4_unicode_ci,
  `show_vision` tinyint(1) DEFAULT '1',
  `show_mission` tinyint(1) DEFAULT '1',
  `show_timeline` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_branch_about` (`branch_id`),
  CONSTRAINT `about_sections_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_sections`
--

LOCK TABLES `about_sections` WRITE;
/*!40000 ALTER TABLE `about_sections` DISABLE KEYS */;
INSERT INTO `about_sections` VALUES ('40d53db6-aa50-11f0-85b6-0ec6b53a0158','tirupur','About Our School - Tirupur Campus','Nurturing minds with motherly care since establishment','At Annai Matriculation School, we believe our school is \"THE FOUNDATION OF YOUR CHILD\'S FUTURE\". Our motto is \"LOVE - SERVICE - PURITY\".\n\nThe school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education, and training who are committed to leaving a mark in the educational field in twin cities.\n\nInitially, we started the School as Primary School. With our continuous effort and dedication towards education, which was well acknowledged by the parents, today we are running Classes until 10th Standard.\n\nIn 10th Standard, we have got 100% Results for the past 6 years. Also, we have got Centum in Social Science for the Academic year 2012. It is the sincere effort from the Management and staff together that we make this a success.','To provide quality education with motherly care, nurturing every child to reach their full potential and become responsible citizens of tomorrow.','To create a learning environment that fosters academic excellence, character development, and holistic growth through innovative teaching methods and personalized attention.',1,1,1,'2025-10-16 05:23:31','2025-10-16 05:23:31'),('40d67fda-aa50-11f0-85b6-0ec6b53a0158','uthukuli','About Our School - Uthukuli Campus','Nurturing minds with motherly care since establishment','At Annai Matriculation School, we believe our school is \"THE FOUNDATION OF YOUR CHILD\'S FUTURE\". Our motto is \"LOVE - SERVICE - PURITY\".\n\nThe school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education, and training who are committed to leaving a mark in the educational field in twin cities.\n\nInitially, we started the School as Primary School. With our continuous effort and dedication towards education, which was well acknowledged by the parents, today we are running Classes until 10th Standard.\n\nIn 10th Standard, we have got 100% Results for the past 6 years. Also, we have got Centum in Social Science for the Academic year 2012. It is the sincere effort from the Management and staff together that we make this a success.','To provide quality education with motherly care, nurturing every child to reach their full potential and become responsible citizens of tomorrow.','To create a learning environment that fosters academic excellence, character development, and holistic growth through innovative teaching methods and personalized attention.',1,1,1,'2025-10-16 05:23:31','2025-10-16 05:25:06');
/*!40000 ALTER TABLE `about_sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `about_timeline`
--

DROP TABLE IF EXISTS `about_timeline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `about_timeline` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `year` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `visible` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `about_timeline_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `about_timeline`
--

LOCK TABLES `about_timeline` WRITE;
/*!40000 ALTER TABLE `about_timeline` DISABLE KEYS */;
INSERT INTO `about_timeline` VALUES ('40da8719-aa50-11f0-85b6-0ec6b53a0158','tirupur','2000','Foundation','Annai Matriculation School was established with a vision to provide quality education with motherly care.',1,1,'2025-10-16 05:23:31'),('40da8b62-aa50-11f0-85b6-0ec6b53a0158','tirupur','2005','Expansion to Primary','Expanded from Pre-KG to Primary classes, welcoming more students into our loving environment.',2,1,'2025-10-16 05:23:31'),('40da8cd4-aa50-11f0-85b6-0ec6b53a0158','tirupur','2010','Secondary Education','Extended our services to include secondary education up to 10th Standard.',3,1,'2025-10-16 05:23:31'),('40da8dd5-aa50-11f0-85b6-0ec6b53a0158','tirupur','2012','First Centum Achievement','Achieved Centum in Social Science, marking our commitment to academic excellence.',4,1,'2025-10-16 05:23:31'),('40da8ee6-aa50-11f0-85b6-0ec6b53a0158','tirupur','2018','100% Success Rate','Achieved 100% pass rate in 10th Standard board exams, a record maintained for 6 consecutive years.',5,1,'2025-10-16 05:23:31'),('40da8f88-aa50-11f0-85b6-0ec6b53a0158','tirupur','2025','Today','Continuing our legacy with 1200+ students and 25+ years of educational excellence.',6,1,'2025-10-16 05:23:31'),('79a3337c-aa50-11f0-85b6-0ec6b53a0158','uthukuli','2000','Milestone','Annai Matriculation School was established with a vision to provide quality education with motherly care.',1,1,'2025-10-16 05:25:06'),('79a3d59b-aa50-11f0-85b6-0ec6b53a0158','uthukuli','2005','Expansion to Primary','Expanded from Pre-KG to Primary classes, welcoming more students into our loving environment.',2,1,'2025-10-16 05:25:06'),('79a4c010-aa50-11f0-85b6-0ec6b53a0158','uthukuli','2010','Secondary Education','Extended our services to include secondary education up to 10th Standard.',3,1,'2025-10-16 05:25:06'),('79a58ccd-aa50-11f0-85b6-0ec6b53a0158','uthukuli','2012','First Centum Achievement','Achieved Centum in Social Science, marking our commitment to academic excellence.',4,1,'2025-10-16 05:25:06'),('79a6402e-aa50-11f0-85b6-0ec6b53a0158','uthukuli','2018','100% Success Rate','Achieved 100% pass rate in 10th Standard board exams, a record maintained for 6 consecutive years.',5,1,'2025-10-16 05:25:06'),('79a71585-aa50-11f0-85b6-0ec6b53a0158','uthukuli','2025','Today','Continuing our legacy with 1200+ students and 25+ years of educational excellence.',6,1,'2025-10-16 05:25:06');
/*!40000 ALTER TABLE `about_timeline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `academics`
--

DROP TABLE IF EXISTS `academics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academics` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grades` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `features` text COLLATE utf8mb4_unicode_ci,
  `displayOrder` int DEFAULT '0',
  `published` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_academics_published` (`published`),
  KEY `idx_academics_displayOrder` (`displayOrder`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `academics_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academics`
--

LOCK TABLES `academics` WRITE;
/*!40000 ALTER TABLE `academics` DISABLE KEYS */;
INSERT INTO `academics` VALUES ('ACAD001','tirupur','Primary Education','Grades 1-5','Foundational learning with focus on creativity, critical thinking, and character development. Our primary education program nurtures young minds through interactive learning and hands-on activities.','Interactive Learning,Character Development,Creative Activities,Basic Literacy & Numeracy',1,1,'2025-10-12 11:24:30','2025-10-16 01:35:44'),('ACAD002','tirupur','Middle School','Grades 6-8','Comprehensive curriculum with emphasis on skill development, subject mastery, and personality growth. Students are prepared for higher education with strong academic foundation.','Subject Specialization,Skill Development,Laboratory Work,Extra-curricular Activities',2,1,'2025-10-12 11:24:30','2025-10-12 11:24:30'),('ACAD003','tirupur','High School','Grades 9-12','Specialized streams and career guidance to prepare students for board examinations and future careers. Focus on academic excellence and competitive exam preparation.','Stream Selection,Career Counseling,Board Exam Preparation,College Guidance',3,1,'2025-10-12 11:24:30','2025-10-12 11:24:30'),('ACAD1760558762541','uthukuli','jin','jin','jin','',0,1,'2025-10-16 01:36:02','2025-10-16 01:36:02'),('ACAD1760559307700','uthukuli','jink','jink','jink','',1,1,'2025-10-16 01:45:07','2025-10-16 01:45:07');
/*!40000 ALTER TABLE `academics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `achievers`
--

DROP TABLE IF EXISTS `achievers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `achievers` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `student_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `achievement_date` date DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_active` (`is_active`),
  KEY `idx_order` (`display_order`),
  KEY `idx_date` (`achievement_date`),
  KEY `idx_created` (`created_at`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `achievers_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `achievers`
--

LOCK TABLES `achievers` WRITE;
/*!40000 ALTER TABLE `achievers` DISABLE KEYS */;
INSERT INTO `achievers` VALUES ('622c537e-a760-11f0-85b6-0ec6b53a0158','tirupur','State Level Chess Champion','Gold Medal winner at State Chess Championship','Raj Kumar','2024-01-15','https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800',NULL,1,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622c57e7-a760-11f0-85b6-0ec6b53a0158','tirupur','National Science Olympiad Winner','Secured 1st rank in National Science Olympiad','Priya Sharma','2024-02-20','https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800',NULL,2,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622c595e-a760-11f0-85b6-0ec6b53a0158','tirupur','Best Student Award 2024','Overall excellence in academics and sports','Arjun Patel','2024-03-10','https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',NULL,3,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622c5a80-a760-11f0-85b6-0ec6b53a0158','tirupur','Art Competition Winner','First prize in State Level Art Competition','Ananya Singh','2024-04-05','https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',NULL,4,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('7632b996-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','State Rank 3 - Class 10 Board Exams','Secured 98.5% marks in CBSE Board Exams 2024 and achieved State Rank 3. Her dedication and hard work are truly inspiring.','Priya Ramesh','2025-10-03','/uploads/achievers/achievers_1760613943849.jpg',NULL,1,1,'2025-10-16 10:54:17','2025-10-16 11:25:55',NULL),('7632d499-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Gold Medal - District Chess Championship','Won Gold Medal in Under-14 District Chess Championship. He defeated 50+ participants to clinch the top position.','Arun Kumar','2024-11-20','/images/uthukuli/achievers/arun-kumar.jpg',NULL,2,1,'2025-10-16 10:54:17','2025-10-16 10:54:17',NULL),('7632d7f4-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','National Level Science Olympiad Winner','Secured All India Rank 15 in National Science Olympiad. Her project on \"Water Conservation\" received special recognition.','Divya Lakshmi','2024-09-10','/images/uthukuli/achievers/divya-lakshmi.jpg',NULL,3,1,'2025-10-16 10:54:17','2025-10-16 10:54:17',NULL),('7632e085-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Best Speaker - State Level Debate','Awarded Best Speaker at Tamil Nadu State Level Debate Competition. His eloquence and knowledge impressed all judges.','Karthik Selvam','2024-10-05','/images/uthukuli/achievers/karthik-selvam.jpg',NULL,4,1,'2025-10-16 10:54:17','2025-10-16 10:54:17',NULL),('7632e9de-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','100% in Mathematics - Class 12','Achieved perfect 100/100 score in Mathematics in CBSE Class 12 Board Exams. She is passionate about pursuing engineering.','Meera Krishnan','2024-05-15','/images/uthukuli/achievers/meera-krishnan.jpg',NULL,5,1,'2025-10-16 10:54:17','2025-10-16 10:54:17',NULL),('7632ed31-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Silver Medal - State Athletics Meet','Won Silver Medal in 100m sprint at State Level Athletics Championship. He completed the race in 11.2 seconds.','Rahul Venkat','2024-12-02','/images/uthukuli/achievers/rahul-venkat.jpg',NULL,6,1,'2025-10-16 10:54:17','2025-10-16 10:54:17',NULL),('7632efd5-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Best Performer - Bharatanatyam Competition','Won First Prize in District Level Bharatanatyam Competition. Her graceful performance mesmerized the audience.','Anjali Devi','2024-08-15','/images/uthukuli/achievers/anjali-devi.jpg',NULL,7,1,'2025-10-16 10:54:17','2025-10-16 10:54:17',NULL),('7632f232-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Young Scientist Award','Received Young Scientist Award for innovative project on \"Solar Energy Harvesting\". The project was displayed at state exhibition.','Suresh Babu','2024-10-20','/images/uthukuli/achievers/suresh-babu.jpg',NULL,8,1,'2025-10-16 10:54:17','2025-10-16 10:54:17',NULL);
/*!40000 ALTER TABLE `achievers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `image_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('ADMIN001','School Administrator','admin@annaischool.edu','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL.ckstG.','admin','/uploads/admin-profiles/1760624755245_corres.jpg','2025-10-12 11:24:29','2025-10-16 19:55:55');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admission_form_fields`
--

DROP TABLE IF EXISTS `admission_form_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admission_form_fields` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `field_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_type` enum('text','email','tel','number','select','textarea','date') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `field_placeholder` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_required` tinyint(1) DEFAULT '1',
  `is_enabled` tinyint(1) DEFAULT '1',
  `display_order` int NOT NULL DEFAULT '0',
  `options` json DEFAULT NULL,
  `validation_rules` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `field_name` (`field_name`),
  KEY `idx_enabled` (`is_enabled`),
  KEY `idx_order` (`display_order`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `admission_form_fields_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admission_form_fields`
--

LOCK TABLES `admission_form_fields` WRITE;
/*!40000 ALTER TABLE `admission_form_fields` DISABLE KEYS */;
INSERT INTO `admission_form_fields` VALUES ('db5cf898-a9f8-11f0-85b6-0ec6b53a0158',NULL,'studentName','Student Name','text','Enter student full name',1,1,1,NULL,'{\"maxLength\": 200, \"minLength\": 2}','2025-10-15 18:57:54','2025-10-15 18:57:54'),('db5d58e9-a9f8-11f0-85b6-0ec6b53a0158',NULL,'parentName','Parent/Guardian Name','text','Enter parent/guardian name',1,1,2,NULL,'{\"maxLength\": 200, \"minLength\": 2}','2025-10-15 18:57:54','2025-10-15 18:59:20'),('db5d5ba4-a9f8-11f0-85b6-0ec6b53a0158',NULL,'phoneNumber','Phone Number','tel','Enter primary contact number',1,1,3,NULL,'{\"message\": \"Please enter a valid 10-digit phone number\", \"pattern\": \"^[0-9]{10}$\"}','2025-10-15 18:57:54','2025-10-15 18:59:20'),('db5d5d82-a9f8-11f0-85b6-0ec6b53a0158',NULL,'alternateNumber','Alternate Phone Number','tel','Enter alternate contact number (optional)',0,1,4,NULL,'{\"message\": \"Please enter a valid 10-digit phone number\", \"pattern\": \"^[0-9]{10}$\"}','2025-10-15 18:57:54','2025-10-15 18:57:54'),('db5d5fb7-a9f8-11f0-85b6-0ec6b53a0158',NULL,'applyingForClass','Applying for Class','select','Select class',1,1,5,'[\"Pre-KG\", \"LKG\", \"UKG\", \"Class 1\", \"Class 2\", \"Class 3\", \"Class 4\", \"Class 5\", \"Class 6\", \"Class 7\", \"Class 8\", \"Class 9\", \"Class 10\"]',NULL,'2025-10-15 18:57:54','2025-10-15 18:57:54');
/*!40000 ALTER TABLE `admission_form_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `published` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_announcement_published` (`published`),
  KEY `idx_announcement_createdAt` (`createdAt`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `announcement_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
INSERT INTO `announcement` VALUES ('ANN001','tirupur','New Academic Year 2025-26','The new academic year 2025-26 will commence from June 1st, 2025. All students are requested to complete their registration formalities before the deadline.',1,'2025-10-12 11:24:30','2025-10-12 11:24:30'),('ANN002','tirupur','Parent-Teacher Meeting','A parent-teacher meeting is scheduled for all classes on the last Saturday of this month. Parents are requested to attend the meeting without fail.',1,'2025-10-12 11:24:30','2025-10-12 11:24:30');
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch_contact_info`
--

DROP TABLE IF EXISTS `branch_contact_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch_contact_info` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_secondary` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_secondary` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_hours` text COLLATE utf8mb4_unicode_ci,
  `google_maps_embed_url` text COLLATE utf8mb4_unicode_ci,
  `google_maps_lat` decimal(10,8) DEFAULT NULL,
  `google_maps_lng` decimal(11,8) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_branch_contact` (`branch_id`),
  CONSTRAINT `branch_contact_info_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch_contact_info`
--

LOCK TABLES `branch_contact_info` WRITE;
/*!40000 ALTER TABLE `branch_contact_info` DISABLE KEYS */;
INSERT INTO `branch_contact_info` VALUES ('6f0b7af0-aa53-11f0-85b6-0ec6b53a0158','tirupur','College Rd, Masco Nagar, Shivshakthi Nagar, Kozhi Ponnai Thottam, Tiruppur, Tamil Nadu 641602','Tirupur','Tamil Nadu','641602','094430 83242',NULL,'annai.tirupur@school.com',NULL,NULL,'Mon - Fri: 8:00 AM - 4:00 PM\nSat: 8:00 AM - 1:00 PM','https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d221.43007532195878!2d77.32285476704243!3d11.11254487780464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x3ba907af6b2d6db9%3A0x16007c27dc81fc1f!2sTiruppur%2C%20Railways%20Ticket%20Booking%20Office%2C%20Sirupooluvapatti%2C%20Khaderpet%2C%20Rayapuram%2C%20Tiruppur%2C%20Tamil%20Nadu!3m2!1d11.1085741!2d77.3397627!4m5!1s0x3ba907018eac662d%3A0x859cc72daeef8563!2sCollege%20Rd%2C%20Masco%20Nagar%2C%20Shivshakthi%20Nagar%2C%20Kozhi%20Ponnai%20Thottam%2C%20Tiruppur%2C%20Tamil%20Nadu%20641602!3m2!1d11.1123659!2d77.3232811!5e1!3m2!1sen!2sin!4v1760610471008!5m2!1sen!2sin',11.11236590,77.32328110,'2025-10-16 05:46:17','2025-10-16 10:31:37'),('6f0cb536-aa53-11f0-85b6-0ec6b53a0158','uthukuli','4CPX+FX9, Gobichettipalayam - Uthukuli - Kangeyam Rd, Tamil Nadu 638752','Uthukuli','Tamil Nadu','638752','094430 83242',NULL,'annai.uthukuli@school.com',NULL,NULL,'Mon - Fri: 8:00 AM - 4:00 PM\nSat: 8:00 AM - 1:00 PM','https://www.google.com/maps/embed?pb=!4v1760610952788!6m8!1m7!1sQRuZZLAdZghvliQSlAIHoA!2m2!1d11.13586230007473!2d77.44992371108717!3f12.732299!4f0!5f0.7820865974627469',11.13586200,77.44992400,'2025-10-16 05:46:17','2025-10-16 10:38:07');
/*!40000 ALTER TABLE `branch_contact_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_enabled` tinyint(1) DEFAULT '1',
  `is_default` tinyint(1) DEFAULT '0',
  `display_order` int DEFAULT '0',
  `logo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_default` (`is_default`),
  KEY `idx_enabled` (`is_enabled`),
  KEY `idx_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES ('tirupur','Tirupur Campus','Annai Matriculation School - Tirupur','Tirupur, Tamil Nadu','+91 1234567890','tirupur@annaischool.edu',1,1,1,NULL,'2025-10-15 19:11:45','2025-10-15 19:11:45'),('uthukuli','Uthukuli Campus','Annai Matriculation School - Uthukuli','Uthukuli, Tamil Nadu','+91 0987654321','uthukuli@annaischool.edu',1,0,2,NULL,'2025-10-15 19:11:45','2025-10-15 19:11:45');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `career_applications`
--

DROP TABLE IF EXISTS `career_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `career_applications` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `branch` enum('Tiruppur','Uthukuli') COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_applied` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualification` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience_years` int DEFAULT '0',
  `subject_specialization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previous_school` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resume_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resume_filename` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_letter` text COLLATE utf8mb4_unicode_ci,
  `expected_salary` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `available_from` date DEFAULT NULL,
  `languages_known` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certifications` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','under_review','shortlisted','rejected','hired') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `reviewed_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_branch` (`branch`),
  KEY `idx_status` (`status`),
  KEY `idx_position` (`position_applied`),
  KEY `idx_applied_at` (`applied_at`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `career_applications_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `career_applications`
--

LOCK TABLES `career_applications` WRITE;
/*!40000 ALTER TABLE `career_applications` DISABLE KEYS */;
INSERT INTO `career_applications` VALUES ('c23c9d65-a769-11f0-85b6-0ec6b53a0158','tirupur','barath','barathm111@gmail.com','+91 9344341883','2002-11-01','Male','boston usa','Tiruppur','maths','MSC',5,'Mathemaics','annai school','/uploads/resumes/resume_1760273250360.pdf','resume_1760273250360.pdf',NULL,'200000','2025-06-05','english','ms excel','hired',NULL,'admin@annaischool.edu','2025-10-13 08:30:16','2025-10-12 12:48:32','2025-10-13 08:30:16');
/*!40000 ALTER TABLE `career_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `career_stats`
--

DROP TABLE IF EXISTS `career_stats`;
/*!50001 DROP VIEW IF EXISTS `career_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `career_stats` AS SELECT 
 1 AS `total_applications`,
 1 AS `pending_count`,
 1 AS `under_review_count`,
 1 AS `shortlisted_count`,
 1 AS `rejected_count`,
 1 AS `hired_count`,
 1 AS `tiruppur_count`,
 1 AS `uthukuli_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `careers_page_content`
--

DROP TABLE IF EXISTS `careers_page_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `careers_page_content` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_value` text COLLATE utf8mb4_unicode_ci,
  `content_type` enum('text','number','image','url','json') COLLATE utf8mb4_unicode_ci DEFAULT 'text',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_section_key` (`section`,`content_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `careers_page_content`
--

LOCK TABLES `careers_page_content` WRITE;
/*!40000 ALTER TABLE `careers_page_content` DISABLE KEYS */;
INSERT INTO `careers_page_content` VALUES ('9fbc633f-aa78-11f0-85b6-0ec6b53a0158','header','title','Join Our Teaching Team','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbc683b-aa78-11f0-85b6-0ec6b53a0158','header','description','Be part of our mission to provide quality education. Apply now for teaching positions at our Tiruppur or Uthukuli branches.','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbd4adc-aa78-11f0-85b6-0ec6b53a0158','status','heading','Already Applied?','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbd52a2-aa78-11f0-85b6-0ec6b53a0158','status','subheading','Check your application status','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbd542d-aa78-11f0-85b6-0ec6b53a0158','status','button_text','Check Status','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbe0bd4-aa78-11f0-85b6-0ec6b53a0158','branch_tiruppur','name','Tiruppur Branch','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbe12ad-aa78-11f0-85b6-0ec6b53a0158','branch_tiruppur','description','Main campus with state-of-the-art facilities and experienced faculty','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbed9cd-aa78-11f0-85b6-0ec6b53a0158','branch_uthukuli','name','Uthukuli Branch','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fbef27f-aa78-11f0-85b6-0ec6b53a0158','branch_uthukuli','description','Growing campus with modern infrastructure and collaborative environment','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc018b6-aa78-11f0-85b6-0ec6b53a0158','success','title','Application Submitted Successfully!','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc0203f-aa78-11f0-85b6-0ec6b53a0158','success','message','Thank you for applying to Annai School. We will review your application and get back to you soon.','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc02161-aa78-11f0-85b6-0ec6b53a0158','success','status_message','You can check your application status using your email:','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc02257-aa78-11f0-85b6-0ec6b53a0158','success','button_text','Check Application Status','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24137-aa78-11f0-85b6-0ec6b53a0158','form_labels','personal_info_heading','Personal Information','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc248d9-aa78-11f0-85b6-0ec6b53a0158','form_labels','full_name','Full Name','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24a05-aa78-11f0-85b6-0ec6b53a0158','form_labels','email','Email','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24af2-aa78-11f0-85b6-0ec6b53a0158','form_labels','phone','Phone','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24be8-aa78-11f0-85b6-0ec6b53a0158','form_labels','date_of_birth','Date of Birth','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24cc3-aa78-11f0-85b6-0ec6b53a0158','form_labels','gender','Gender','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24da4-aa78-11f0-85b6-0ec6b53a0158','form_labels','address','Address','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24e7f-aa78-11f0-85b6-0ec6b53a0158','form_labels','professional_info_heading','Professional Information','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc24f70-aa78-11f0-85b6-0ec6b53a0158','form_labels','branch','Preferred Branch','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc2504a-aa78-11f0-85b6-0ec6b53a0158','form_labels','position','Position Applied For','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25131-aa78-11f0-85b6-0ec6b53a0158','form_labels','qualification','Highest Qualification','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc2523c-aa78-11f0-85b6-0ec6b53a0158','form_labels','experience','Years of Experience','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc2540b-aa78-11f0-85b6-0ec6b53a0158','form_labels','subject','Subject Specialization','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25599-aa78-11f0-85b6-0ec6b53a0158','form_labels','previous_school','Previous School/Institution','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc257cf-aa78-11f0-85b6-0ec6b53a0158','form_labels','additional_info_heading','Additional Information','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc259ae-aa78-11f0-85b6-0ec6b53a0158','form_labels','resume','Resume/CV','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25aa9-aa78-11f0-85b6-0ec6b53a0158','form_labels','cover_letter','Cover Letter','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25b86-aa78-11f0-85b6-0ec6b53a0158','form_labels','expected_salary','Expected Salary','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25c69-aa78-11f0-85b6-0ec6b53a0158','form_labels','available_from','Available From','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25d46-aa78-11f0-85b6-0ec6b53a0158','form_labels','languages','Languages Known','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25e24-aa78-11f0-85b6-0ec6b53a0158','form_labels','certifications','Certifications','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30'),('9fc25f32-aa78-11f0-85b6-0ec6b53a0158','form_labels','submit_button','Submit Application','text',0,'2025-10-16 10:12:30','2025-10-16 10:12:30');
/*!40000 ALTER TABLE `careers_page_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carousel_images`
--

DROP TABLE IF EXISTS `carousel_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carousel_images` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `imageUrl` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `linkUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `displayOrder` int DEFAULT '0',
  `isActive` tinyint(1) DEFAULT '1',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_carousel_isActive` (`isActive`),
  KEY `idx_carousel_displayOrder` (`displayOrder`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `carousel_images_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carousel_images`
--

LOCK TABLES `carousel_images` WRITE;
/*!40000 ALTER TABLE `carousel_images` DISABLE KEYS */;
INSERT INTO `carousel_images` VALUES ('1760557436165','tirupur','Love... Service... Purity','Annai Means Mother. We Provide Motherly care towards all our children studying here. We enrich your childs thinking capability and we find the unique talent they have, promote it and nurture your childs growth. We teach moral, obedience and great characteristics along with quality education for their better placement in life.','/uploads/carousel/carousel-1760557436161.jpg',NULL,NULL,1,'2025-10-16 01:13:56','2025-10-16 19:33:17'),('7617bdd9-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Welcome to Annai School Uthukuli','Where Excellence Meets Innovation','/images/uthukuli/carousel/campus-entrance.jpg',NULL,1,1,'2025-10-16 16:24:17','2025-10-16 16:24:17'),('7617d778-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Modern Learning Environment','State-of-the-art Classrooms & Smart Boards','/images/uthukuli/carousel/classroom.jpg',NULL,2,1,'2025-10-16 16:24:17','2025-10-16 16:24:17'),('7617dcbd-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Sports & Physical Education','Building Strong Minds & Bodies','/images/uthukuli/carousel/sports-day.jpg',NULL,3,1,'2025-10-16 16:24:17','2025-10-16 16:24:17'),('7617df59-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Advanced Laboratory Facilities','Hands-on Learning Experience','/images/uthukuli/carousel/science-lab.jpg',NULL,4,1,'2025-10-16 16:24:17','2025-10-16 16:24:17'),('7617e13b-aa7e-11f0-85b6-0ec6b53a0158','uthukuli','Rich Library Collection','Over 5,000 Books & Digital Resources','/images/uthukuli/carousel/library.jpg',NULL,5,1,'2025-10-16 16:24:17','2025-10-16 16:24:17');
/*!40000 ALTER TABLE `carousel_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('new','read','responded','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `response` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contacts_email` (`email`),
  KEY `idx_contacts_status` (`status`),
  KEY `idx_contacts_createdAt` (`createdAt`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES ('CONTACT1760593735669','uthukuli','Barath Madesh','barathm111@gmail.com','9344341883','admissions','hi','read',NULL,'2025-10-16 11:18:55','2025-10-16 11:57:06');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_uploads`
--

DROP TABLE IF EXISTS `file_uploads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_uploads` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `originalName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filePath` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int NOT NULL,
  `mimeType` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploadType` enum('profile','document','news','carousel','about','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploadedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relatedEntityType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relatedEntityId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isPublic` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_file_uploads_uploadType` (`uploadType`),
  KEY `idx_file_uploads_uploadedBy` (`uploadedBy`),
  KEY `idx_file_uploads_entity` (`relatedEntityType`,`relatedEntityId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_uploads`
--

LOCK TABLES `file_uploads` WRITE;
/*!40000 ALTER TABLE `file_uploads` DISABLE KEYS */;
/*!40000 ALTER TABLE `file_uploads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `form_configurations`
--

DROP TABLE IF EXISTS `form_configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `form_configurations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_label` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `field_type` enum('text','email','phone','date','select','textarea','file','checkbox','radio','number') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_required` tinyint(1) DEFAULT '0',
  `is_visible` tinyint(1) DEFAULT '1',
  `placeholder` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `help_text` text COLLATE utf8mb4_unicode_ci,
  `options` json DEFAULT NULL,
  `validation_rules` json DEFAULT NULL,
  `display_order` int NOT NULL,
  `section` enum('personal','contact','parent','academic','documents','additional') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_field_name` (`field_name`),
  KEY `idx_section` (`section`),
  KEY `idx_display_order` (`display_order`),
  KEY `idx_visible` (`is_visible`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `form_configurations`
--

LOCK TABLES `form_configurations` WRITE;
/*!40000 ALTER TABLE `form_configurations` DISABLE KEYS */;
INSERT INTO `form_configurations` VALUES ('1eae19e3-a7ed-11f0-85b6-0ec6b53a0158','intakeYear','Year of Intake','select',1,1,'Select your intake year','Choose the academic year when the student joined or will join the school.\n','[\"2026–2027\", \"2027–2028\", \"2028-2029\", \"2029-2030\"]',NULL,33,'personal','2025-10-13 04:28:51','2025-10-13 04:35:06'),('3d3a055a-a73a-11f0-8a22-b6ed7eaff3b4','firstName','First Name','text',0,0,'Enter first name',NULL,'[]',NULL,1,'personal','2025-10-12 07:08:22','2025-10-12 07:35:32'),('3d3a1893-a73a-11f0-8a22-b6ed7eaff3b4','middleName','Middle Name','text',0,0,'Enter middle name',NULL,'[]',NULL,2,'personal','2025-10-12 07:08:22','2025-10-12 07:33:15'),('3d3a20a0-a73a-11f0-8a22-b6ed7eaff3b4','lastName','Last Name','text',0,0,'Enter last name',NULL,'[]',NULL,3,'personal','2025-10-12 07:08:22','2025-10-12 07:35:32'),('3d3a25c4-a73a-11f0-8a22-b6ed7eaff3b4','dateOfBirth','Date of Birth','date',1,0,NULL,'Student must be at least 3 years old','[]',NULL,4,'personal','2025-10-12 07:08:22','2025-10-12 08:26:14'),('3d3a2ae8-a73a-11f0-8a22-b6ed7eaff3b4','gender','Gender','select',1,1,NULL,NULL,'[\"Male\", \"Female\", \"Other\"]',NULL,2,'personal','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a4ae5-a73a-11f0-8a22-b6ed7eaff3b4','bloodGroup','Blood Group','select',0,1,NULL,NULL,'[\"A+\", \"A-\", \"B+\", \"B-\", \"O+\", \"O-\", \"AB+\", \"AB-\"]',NULL,3,'personal','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a550f-a73a-11f0-8a22-b6ed7eaff3b4','nationality','Nationality','select',1,1,'e.g., Indian',NULL,'[\"Indian\", \"NRI\"]',NULL,5,'personal','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a5a3d-a73a-11f0-8a22-b6ed7eaff3b4','religion','Religion','select',0,1,NULL,NULL,'[\"Hindu\", \"Muslim\", \"Christian\", \"Sikh\", \"Buddhist\", \"Jain\", \"Other\"]',NULL,7,'personal','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a5f52-a73a-11f0-8a22-b6ed7eaff3b4','category','Category','select',0,0,NULL,NULL,'[\"General\", \"OBC\", \"SC\", \"ST\", \"Other\"]',NULL,7,'personal','2025-10-12 07:08:22','2025-10-12 10:09:37'),('3d3a642a-a73a-11f0-8a22-b6ed7eaff3b4','email','Email Address','email',0,0,'Enter email address','Will be used for login','[]',NULL,1,'contact','2025-10-12 07:08:22','2025-10-12 07:39:13'),('3d3a6a2f-a73a-11f0-8a22-b6ed7eaff3b4','mobile','Mobile Number','phone',1,1,'Enter 10-digit mobile number','Primary contact number','[]',NULL,8,'contact','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a6fce-a73a-11f0-8a22-b6ed7eaff3b4','alternateMobile','Alternate Mobile','phone',0,1,'Enter alternate mobile number',NULL,'[]',NULL,9,'contact','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a74d4-a73a-11f0-8a22-b6ed7eaff3b4','currentAddress','Current Address','textarea',0,0,'Enter complete current address',NULL,'[]',NULL,10,'contact','2025-10-12 07:08:22','2025-10-12 10:12:29'),('3d3a796a-a73a-11f0-8a22-b6ed7eaff3b4','Address','Address','textarea',1,1,'Enter  address',NULL,'[]',NULL,10,'contact','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a7e3a-a73a-11f0-8a22-b6ed7eaff3b4','pincode','PIN Code','text',0,1,'Enter 6-digit PIN code',NULL,'[]',NULL,11,'contact','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a81b1-a73a-11f0-8a22-b6ed7eaff3b4','fatherName','Father\'s Name','text',1,1,'Enter father\'s full name',NULL,'[]',NULL,12,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a8714-a73a-11f0-8a22-b6ed7eaff3b4','fatherOccupation','Father\'s Occupation','text',0,1,'Enter father\'s occupation',NULL,'[]',NULL,13,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a8cd9-a73a-11f0-8a22-b6ed7eaff3b4','fatherMobile','Father\'s Mobile','phone',1,1,'Enter father\'s mobile number',NULL,'[]',NULL,14,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a92a7-a73a-11f0-8a22-b6ed7eaff3b4','fatherEmail','Father\'s Email','email',0,1,'Enter father\'s email address',NULL,'[]',NULL,15,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a96fb-a73a-11f0-8a22-b6ed7eaff3b4','motherName','Mother\'s Name','text',1,1,'Enter mother\'s full name',NULL,'[]',NULL,16,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a9b48-a73a-11f0-8a22-b6ed7eaff3b4','motherOccupation','Mother\'s Occupation','text',0,1,'Enter mother\'s occupation',NULL,'[]',NULL,17,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3a9ea5-a73a-11f0-8a22-b6ed7eaff3b4','motherMobile','Mother\'s Mobile','phone',1,1,'Enter mother\'s mobile number',NULL,'[]',NULL,18,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3aa1e0-a73a-11f0-8a22-b6ed7eaff3b4','motherEmail','Mother\'s Email','email',0,1,'Enter mother\'s email address',NULL,'[]',NULL,19,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3aa5ac-a73a-11f0-8a22-b6ed7eaff3b4','guardianName','Guardian Name','text',0,1,'If different from parents','Only if guardian is different','[]',NULL,20,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3aaa14-a73a-11f0-8a22-b6ed7eaff3b4','guardianContact','Guardian Contact','phone',0,1,'Enter guardian contact number',NULL,'[]',NULL,21,'parent','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3aae7e-a73a-11f0-8a22-b6ed7eaff3b4','applyingForGrade','Applying for Grade/Class','select',1,1,NULL,'Select the grade you are applying for','[\"LKG\", \"UKG\", \"Grade 1\", \"Grade 2\", \"Grade 3\", \"Grade 4\", \"Grade 5\", \"Grade 6\", \"Grade 7\", \"Grade 8\", \"Grade 9\", \"Grade 10\", \"Grade 11\", \"Grade 12\"]',NULL,22,'academic','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ab4f1-a73a-11f0-8a22-b6ed7eaff3b4','previousSchool','Previous School Name','text',0,1,'Enter previous school name','Leave blank if applying for Nursery/LKG','[]',NULL,23,'academic','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ab911-a73a-11f0-8a22-b6ed7eaff3b4','previousClass','Previous Class/Grade','text',0,1,'e.g., Grade 10, Class X',NULL,'[]',NULL,24,'academic','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3abc86-a73a-11f0-8a22-b6ed7eaff3b4','board','Previous Board','select',0,1,NULL,NULL,'[\"CBSE\", \"ICSE\", \"State Board\", \"IB\", \"IGCSE\", \"Other\"]',NULL,25,'academic','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ac03c-a73a-11f0-8a22-b6ed7eaff3b4','previousPercentage','Previous Class Percentage/Grade','text',0,1,'e.g., 85% or A+',NULL,'[]',NULL,26,'academic','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ac39d-a73a-11f0-8a22-b6ed7eaff3b4','studentPhoto','Student Photo','file',1,1,NULL,'Passport size photo (JPEG/PNG, max 2MB)','[]',NULL,27,'documents','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ac6f5-a73a-11f0-8a22-b6ed7eaff3b4','birthCertificate','Birth Certificate','file',1,1,NULL,'PDF or image file (max 5MB)','[]',NULL,28,'documents','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3aca6d-a73a-11f0-8a22-b6ed7eaff3b4','marksheet','Previous Marksheet','file',0,1,NULL,'Latest academic records','[]',NULL,29,'documents','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ad60f-a73a-11f0-8a22-b6ed7eaff3b4','transferCertificate','Transfer Certificate','file',0,1,NULL,'TC from previous school (if applicable)','[]',NULL,30,'documents','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3adac8-a73a-11f0-8a22-b6ed7eaff3b4','specialNeeds','Special Educational Needs','textarea',0,1,'Any learning disabilities or special requirements','Please provide details if applicable','[]',NULL,31,'additional','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ade98-a73a-11f0-8a22-b6ed7eaff3b4','medicalConditions','Medical Conditions','textarea',0,1,'Please mention any medical conditions or allergies',NULL,'[]',NULL,32,'additional','2025-10-12 07:08:22','2025-10-13 04:35:06'),('3d3ae264-a73a-11f0-8a22-b6ed7eaff3b4','transportRequired','School Transport Required','select',0,0,NULL,NULL,'[\"Yes\", \"No\"]',NULL,33,'additional','2025-10-12 07:08:22','2025-10-12 09:19:15'),('49ec9631-a79f-11f0-85b6-0ec6b53a0158','Branch','Branch','select',1,1,'select the branch',NULL,'[\"Tiruppur\", \"Uthukuli\"]',NULL,6,'personal','2025-10-12 19:11:43','2025-10-13 04:35:06'),('856cf1d8-a74c-11f0-85b6-0ec6b53a0158','last name ','last name','text',0,1,'last name',NULL,'[]',NULL,1,'personal','2025-10-12 09:19:14','2025-10-13 04:35:06'),('c8d4609b-a745-11f0-85b6-0ec6b53a0158','First Name','First name','text',1,1,'first name',NULL,'[]',NULL,0,'personal','2025-10-12 08:31:01','2025-10-13 04:35:06'),('f2cf0499-a745-11f0-85b6-0ec6b53a0158','DOB','DOB','date',1,1,'DOB',NULL,'[]',NULL,4,'personal','2025-10-12 08:32:11','2025-10-13 04:35:06');
/*!40000 ALTER TABLE `form_configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_active` (`is_active`),
  KEY `idx_order` (`display_order`),
  KEY `idx_created` (`created_at`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `gallery_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES ('622b493b-a760-11f0-85b6-0ec6b53a0158','tirupur','Annual Day Celebration 2024','Students performing cultural dance at annual day','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',NULL,1,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622b4e76-a760-11f0-85b6-0ec6b53a0158','tirupur','Science Exhibition','Students showcasing their innovative science projects','https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',NULL,2,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622b50b3-a760-11f0-85b6-0ec6b53a0158','tirupur','Independence Day 2024','Flag hoisting ceremony and celebrations','https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800',NULL,3,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622b51d3-a760-11f0-85b6-0ec6b53a0158','tirupur','Classroom Activities','Interactive learning sessions in progress','https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',NULL,4,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622b5313-a760-11f0-85b6-0ec6b53a0158','tirupur','Cultural Festival','Students celebrating cultural diversity','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',NULL,5,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('d284c892-aa82-11f0-85b6-0ec6b53a0158','uthukuli','prize ',NULL,'/uploads/gallery/gallery_1760613917664.jpg',NULL,1,1,'2025-10-16 11:25:30','2025-10-16 11:25:30','admin@annaischool.edu');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `homepage_content`
--

DROP TABLE IF EXISTS `homepage_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `homepage_content` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_value` text COLLATE utf8mb4_unicode_ci,
  `content_type` enum('text','number','image','url','json') COLLATE utf8mb4_unicode_ci DEFAULT 'text',
  `display_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_branch_section_key` (`branch_id`,`section`,`content_key`),
  CONSTRAINT `homepage_content_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `homepage_content`
--

LOCK TABLES `homepage_content` WRITE;
/*!40000 ALTER TABLE `homepage_content` DISABLE KEYS */;
INSERT INTO `homepage_content` VALUES ('5b90e7d1-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat1_value','1,500+','text',1,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b90f677-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat1_label','Students Enrolled','text',1,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b90f9b2-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat2_value','80+','text',2,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b90fc5e-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat2_label','Qualified Teachers','text',2,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b90fedc-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat3_value','25+','text',3,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b910148-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat3_label','Years of Excellence','text',3,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b910408-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat4_value','15+','text',4,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b9105f8-aa74-11f0-85b6-0ec6b53a0158','tirupur','stats','stat4_label','Academic Programs','text',4,'2025-10-16 09:41:57','2025-10-16 09:45:33'),('5b92320b-aa74-11f0-85b6-0ec6b53a0158','tirupur','about','heading','About Annai School','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b923914-aa74-11f0-85b6-0ec6b53a0158','tirupur','about','description','For over 25 years, Annai School has been a beacon of educational excellence, committed to providing quality education that shapes character, builds confidence, and prepares students for a successful future.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b923a8b-aa74-11f0-85b6-0ec6b53a0158','tirupur','about','image_url','/uploads/carousel/carousel-1759697591466.jpg','image',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b923b95-aa74-11f0-85b6-0ec6b53a0158','tirupur','about','button_text','Learn More About Us','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b923ca2-aa74-11f0-85b6-0ec6b53a0158','tirupur','about','button_url','/about','url',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b932029-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','heading','About Our Founder','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9326d5-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','subheading','Leadership with Experience and Dedication','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b932816-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','name','Mrs. Lakshmi Kathiresan','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9329e1-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','title','Founder & Principal','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b932b35-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','image_url','/images/founder/corres (1).jpg','image',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b932c2a-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','excellence_text','The school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education and training who are committed to leave a mark in the educational field in twin cities.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b932d96-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','supervision_text','The school is being run under the direct supervision of the promoters on a day to day basis.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b933d97-aa74-11f0-85b6-0ec6b53a0158','tirupur','founder','academician_text','Mrs. Lakshmi Kathiresan is a renowned academician with more than 20 years of experience in the field of education.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b93fdc2-aa74-11f0-85b6-0ec6b53a0158','tirupur','cta','heading','Ready to Join Our School Family?','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94031b-aa74-11f0-85b6-0ec6b53a0158','tirupur','cta','description','Take the first step towards your child\'s bright future. Apply for admission today!','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b940447-aa74-11f0-85b6-0ec6b53a0158','tirupur','cta','primary_button_text','Apply Now','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94054f-aa74-11f0-85b6-0ec6b53a0158','tirupur','cta','primary_button_url','/admissions/register','url',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b940646-aa74-11f0-85b6-0ec6b53a0158','tirupur','cta','secondary_button_text','Contact Us','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b940739-aa74-11f0-85b6-0ec6b53a0158','tirupur','cta','secondary_button_url','/contact','url',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94c0c5-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat1_value','800+','text',1,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94c5bf-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat1_label','Students Enrolled','text',1,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94c6fd-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat2_value','50+','text',2,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94c7fc-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat2_label','Qualified Teachers','text',2,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94c8fb-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat3_value','20+','text',3,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94c9f3-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat3_label','Years of Excellence','text',3,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94caec-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat4_value','12+','text',4,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b94cbe7-aa74-11f0-85b6-0ec6b53a0158','uthukuli','stats','stat4_label','Academic Programs','text',4,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b959a96-aa74-11f0-85b6-0ec6b53a0158','uthukuli','about','heading','About Annai School - Uthukuli','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b95a28c-aa74-11f0-85b6-0ec6b53a0158','uthukuli','about','description','For over 20 years, Annai School Uthukuli Campus has been committed to providing quality education that shapes character, builds confidence, and prepares students for a successful future.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b95a3cf-aa74-11f0-85b6-0ec6b53a0158','uthukuli','about','image_url','/uploads/carousel/carousel-1759697591466.jpg','image',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b95a4d4-aa74-11f0-85b6-0ec6b53a0158','uthukuli','about','button_text','Learn More About Us','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b95a5f2-aa74-11f0-85b6-0ec6b53a0158','uthukuli','about','button_url','/about','url',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b96687d-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','heading','About Our Founder','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b966f61-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','subheading','Leadership with Experience and Dedication','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9670bb-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','name','Mrs. Lakshmi Kathiresan','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9671b7-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','title','Founder & Principal','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9672b4-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','image_url','/images/founder/corres (1).jpg','image',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9673ab-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','excellence_text','The school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education and training who are committed to leave a mark in the educational field.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b96749c-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','supervision_text','The school is being run under the direct supervision of the promoters on a day to day basis.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9675b0-aa74-11f0-85b6-0ec6b53a0158','uthukuli','founder','academician_text','Mrs. Lakshmi Kathiresan is a renowned academician with more than 20 years of experience in the field of education.','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b970f2a-aa74-11f0-85b6-0ec6b53a0158','uthukuli','cta','heading','Ready to Join Our School Family?','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b971558-aa74-11f0-85b6-0ec6b53a0158','uthukuli','cta','description','Take the first step towards your child\'s bright future. Apply for admission today!','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b97169c-aa74-11f0-85b6-0ec6b53a0158','uthukuli','cta','primary_button_text','Apply Now','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9717a9-aa74-11f0-85b6-0ec6b53a0158','uthukuli','cta','primary_button_url','/admissions/register','url',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9718ad-aa74-11f0-85b6-0ec6b53a0158','uthukuli','cta','secondary_button_text','Contact Us','text',0,'2025-10-16 09:41:57','2025-10-16 09:41:57'),('5b9719a8-aa74-11f0-85b6-0ec6b53a0158','uthukuli','cta','secondary_button_url','/contact','url',0,'2025-10-16 09:41:57','2025-10-16 09:41:57');
/*!40000 ALTER TABLE `homepage_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsevent`
--

DROP TABLE IF EXISTS `newsevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsevent` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'news',
  `imageUrl` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `published` tinyint(1) DEFAULT '1',
  `date` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_newsevent_published` (`published`),
  KEY `idx_newsevent_category` (`category`),
  KEY `idx_newsevent_date` (`date`),
  KEY `idx_newsevent_createdAt` (`createdAt`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `newsevent_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsevent`
--

LOCK TABLES `newsevent` WRITE;
/*!40000 ALTER TABLE `newsevent` DISABLE KEYS */;
INSERT INTO `newsevent` VALUES ('NEWS001','tirupur','Welcome to Annai School - uthukuli','We are pleased to welcome you to our school management system.','Dear Students and Parents,\n\nWelcome to Annai School Management System. This platform will help you manage admissions, track academic progress, and stay updated with school news and events.\n\nThank you for choosing Annai School.','announcement',NULL,1,'2025-10-12 11:24:30','2025-10-12 11:24:30','2025-10-16 01:24:11'),('NEWS002','tirupur','Admission Process 2025-26','Admissions are now open for the academic year 2025-26','We are pleased to announce that admissions for the academic year 2025-26 are now open.\n\nParents can register their wards through our online admission portal. For any queries, please contact the school office.\n\nImportant Dates:\n- Application Start: June 1, 2025\n- Application End: July 15, 2025\n- Entrance Test: July 20, 2025\n- Results: July 25, 2025','news',NULL,1,'2025-10-12 11:24:30','2025-10-12 11:24:30','2025-10-12 11:24:30');
/*!40000 ALTER TABLE `newsevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `published_news`
--

DROP TABLE IF EXISTS `published_news`;
/*!50001 DROP VIEW IF EXISTS `published_news`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `published_news` AS SELECT 
 1 AS `id`,
 1 AS `title`,
 1 AS `description`,
 1 AS `content`,
 1 AS `category`,
 1 AS `imageUrl`,
 1 AS `date`,
 1 AS `createdAt`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `sports`
--

DROP TABLE IF EXISTS `sports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sports` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `event_date` date DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_active` (`is_active`),
  KEY `idx_order` (`display_order`),
  KEY `idx_date` (`event_date`),
  KEY `idx_created` (`created_at`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `sports_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sports`
--

LOCK TABLES `sports` WRITE;
/*!40000 ALTER TABLE `sports` DISABLE KEYS */;
INSERT INTO `sports` VALUES ('622dd1b4-a760-11f0-85b6-0ec6b53a0158','tirupur','Inter-School Cricket Tournament','Won district level cricket championship','2024-01-25','City Sports Complex','https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',NULL,1,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622dd6b6-a760-11f0-85b6-0ec6b53a0158','tirupur','Annual Sports Day','Students participating in track and field events','2024-02-15','School Ground','https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',NULL,2,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622dd827-a760-11f0-85b6-0ec6b53a0158','tirupur','Basketball Championship','Girls team secured runner-up position','2024-03-20','State Stadium','https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',NULL,3,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622dd964-a760-11f0-85b6-0ec6b53a0158','tirupur','Swimming Competition','Multiple medals in inter-school swimming meet','2024-04-10','Aquatic Center','https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800',NULL,4,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL),('622dda8d-a760-11f0-85b6-0ec6b53a0158','tirupur','Football Tournament','Boys team won regional football championship','2024-05-05','Regional Stadium','https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',NULL,5,1,'2025-10-12 11:41:25','2025-10-12 11:41:25',NULL);
/*!40000 ALTER TABLE `sports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_application_form`
--

DROP TABLE IF EXISTS `student_application_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_application_form` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `branch_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicationId` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `studentName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parentName` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alternateNumber` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `applyingForClass` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','submitted','under_review','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'submitted',
  `appliedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `applicationId` (`applicationId`),
  UNIQUE KEY `phoneNumber` (`phoneNumber`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_username` (`username`),
  KEY `idx_phone` (`phoneNumber`),
  KEY `idx_status` (`status`),
  KEY `idx_application_id` (`applicationId`),
  KEY `idx_branch_id` (`branch_id`),
  CONSTRAINT `student_application_form_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_application_form`
--

LOCK TABLES `student_application_form` WRITE;
/*!40000 ALTER TABLE `student_application_form` DISABLE KEYS */;
INSERT INTO `student_application_form` VALUES ('STU1760513045001','tirupur','APP2025M7I8C4','Barath Madesh','madesh','9344341883',NULL,'Class 8','barath.madesh.2944','$2b$12$gon8r0oV6WgClCX2B32AI.DRGHaHtTU5/0WCVlFvCPbW1lpd8ia1y','submitted','2025-10-15 07:24:05','2025-10-15 07:24:05'),('STU1760531096172','tirupur','APP2025WLU169','Barath','madesh','9894511515',NULL,'Class 9','barath.2388','$2b$12$y7pPpoRH4edecU.X9Vofle/H20ts387a1st/0P39gJgX7aTSR8aJG','submitted','2025-10-15 12:24:56','2025-10-15 12:24:56'),('STU1760532124000','tirupur','APP2025BBUBIM','barathtest','madesh01','9789456125',NULL,'Class 7','barathtest.2314','$2b$12$m21wdLFY7YlkHFam5Ma.PO9l0qEIO.hXx61jv3nWbUyVthl1KxQnq','submitted','2025-10-15 12:42:04','2025-10-15 12:42:04'),('STU1760532302523','tirupur','APP2025F39NP5','Barath','madesh','7894561234',NULL,'Class 10','barath.4538','$2b$12$kjg8PVNP14TVTcMaMCLRDerJYnCLbP57a1hTfJ9ZZqEtDw.WVHMEi','submitted','2025-10-15 12:45:02','2025-10-15 12:45:02'),('STU1760626913239','tirupur','APP2025DK1ET7','Barath','madesh','8794561234',NULL,'Class 6','barath.6882','$2b$12$d1QLODsk9z/3hnF/hPvUI.UM4AVsav7qeaXTDcgFtm1/Tf3slG/yK','submitted','2025-10-16 15:01:53','2025-10-16 15:01:53');
/*!40000 ALTER TABLE `student_application_form` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settingKey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `settingValue` text COLLATE utf8mb4_unicode_ci,
  `settingType` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `description` text COLLATE utf8mb4_unicode_ci,
  `isPublic` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settingKey` (`settingKey`),
  KEY `idx_system_settings_key` (`settingKey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES ('SET001','school_name','Annai School','string','Name of the school',1,'2025-10-12 11:24:29','2025-10-12 11:24:29'),('SET002','school_address','School Address, City, State - Pincode','string','School physical address',1,'2025-10-12 11:24:29','2025-10-12 11:24:29'),('SET003','school_phone','+91-XXXXXXXXXX','string','School contact number',1,'2025-10-12 11:24:29','2025-10-12 11:24:29'),('SET004','school_email','info@annaischool.edu','string','School email address',1,'2025-10-12 11:24:29','2025-10-12 11:24:29'),('SET005','admission_open','true','boolean','Whether admissions are currently open',1,'2025-10-12 11:24:29','2025-10-12 11:24:29'),('SET006','current_academic_year','2025','number','Current academic year',1,'2025-10-12 11:24:29','2025-10-12 11:24:29'),('SET007','max_file_size','5242880','number','Maximum file upload size in bytes (5MB)',0,'2025-10-12 11:24:29','2025-10-12 11:24:29'),('SET008','allowed_file_types','[\"image/jpeg\",\"image/png\",\"image/gif\",\"application/pdf\"]','json','Allowed file types for upload',0,'2025-10-12 11:24:29','2025-10-12 11:24:29');
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `career_stats`
--

/*!50001 DROP VIEW IF EXISTS `career_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `career_stats` AS select count(0) AS `total_applications`,sum((case when (`career_applications`.`status` = 'pending') then 1 else 0 end)) AS `pending_count`,sum((case when (`career_applications`.`status` = 'under_review') then 1 else 0 end)) AS `under_review_count`,sum((case when (`career_applications`.`status` = 'shortlisted') then 1 else 0 end)) AS `shortlisted_count`,sum((case when (`career_applications`.`status` = 'rejected') then 1 else 0 end)) AS `rejected_count`,sum((case when (`career_applications`.`status` = 'hired') then 1 else 0 end)) AS `hired_count`,sum((case when (`career_applications`.`branch` = 'Tiruppur') then 1 else 0 end)) AS `tiruppur_count`,sum((case when (`career_applications`.`branch` = 'Uthukuli') then 1 else 0 end)) AS `uthukuli_count` from `career_applications` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `published_news`
--

/*!50001 DROP VIEW IF EXISTS `published_news`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `published_news` AS select `newsevent`.`id` AS `id`,`newsevent`.`title` AS `title`,`newsevent`.`description` AS `description`,`newsevent`.`content` AS `content`,`newsevent`.`category` AS `category`,`newsevent`.`imageUrl` AS `imageUrl`,`newsevent`.`date` AS `date`,`newsevent`.`createdAt` AS `createdAt` from `newsevent` where (`newsevent`.`published` = true) order by `newsevent`.`date` desc,`newsevent`.`createdAt` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-16 23:46:06
