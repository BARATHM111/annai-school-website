const fs = require('fs');
const path = require('path');

// Database file paths
const dataDir = path.join(__dirname, 'data');
const files = {
  profiles: path.join(dataDir, 'profiles.json'),
  applications: path.join(dataDir, 'applications.json'),
  students: path.join(dataDir, 'students.json'),
  enrollments: path.join(dataDir, 'enrollments.json'),
  formConfig: path.join(dataDir, 'form-config.json'),
  aboutContent: path.join(dataDir, 'about-content.json'),
  news: path.join(dataDir, 'news.json'),
  carousel: path.join(dataDir, 'carousel.json'),
  announcements: path.join(dataDir, 'announcements.json')
};

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('🔄 Resetting database...');

// Clear all existing data
Object.entries(files).forEach(([name, filePath]) => {
  if (fs.existsSync(filePath)) {
    console.log(`🗑️  Clearing ${name}.json`);
    fs.unlinkSync(filePath);
  }
});

// Initialize empty data structures
const initialData = {
  profiles: {},
  applications: {},
  students: {},
  enrollments: {},
  
  // Form configuration with comprehensive fields
  formConfig: [
    // Personal Information Section
    {
      id: "student_name",
      fieldName: "studentName",
      fieldLabel: "Student Full Name",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter student's full name",
      helpText: "Enter the complete name as per official documents",
      displayOrder: 1,
      section: "personal"
    },
    {
      id: "date_of_birth",
      fieldName: "dateOfBirth",
      fieldLabel: "Date of Birth",
      fieldType: "date",
      isRequired: true,
      isVisible: true,
      helpText: "Select the date of birth",
      displayOrder: 2,
      section: "personal"
    },
    {
      id: "gender",
      fieldName: "gender",
      fieldLabel: "Gender",
      fieldType: "select",
      isRequired: true,
      isVisible: true,
      options: ["Male", "Female", "Other"],
      displayOrder: 3,
      section: "personal"
    },
    {
      id: "blood_group",
      fieldName: "bloodGroup",
      fieldLabel: "Blood Group",
      fieldType: "select",
      isRequired: false,
      isVisible: true,
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      displayOrder: 4,
      section: "personal"
    },
    {
      id: "nationality",
      fieldName: "nationality",
      fieldLabel: "Nationality",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter nationality",
      displayOrder: 5,
      section: "personal"
    },
    {
      id: "religion",
      fieldName: "religion",
      fieldLabel: "Religion",
      fieldType: "text",
      isRequired: false,
      isVisible: true,
      placeholder: "Enter religion (optional)",
      displayOrder: 6,
      section: "personal"
    },
    {
      id: "category",
      fieldName: "category",
      fieldLabel: "Category",
      fieldType: "select",
      isRequired: true,
      isVisible: true,
      options: ["General", "OBC", "SC", "ST", "Other"],
      displayOrder: 7,
      section: "personal"
    },

    // Contact Information Section
    {
      id: "email",
      fieldName: "email",
      fieldLabel: "Email Address",
      fieldType: "email",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter email address",
      displayOrder: 8,
      section: "contact"
    },
    {
      id: "mobile",
      fieldName: "mobile",
      fieldLabel: "Mobile Number",
      fieldType: "phone",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter 10-digit mobile number",
      displayOrder: 9,
      section: "contact"
    },
    {
      id: "alternate_mobile",
      fieldName: "alternateMobile",
      fieldLabel: "Alternate Mobile",
      fieldType: "phone",
      isRequired: false,
      isVisible: true,
      placeholder: "Enter alternate mobile number",
      displayOrder: 10,
      section: "contact"
    },
    {
      id: "current_address",
      fieldName: "currentAddress",
      fieldLabel: "Current Address",
      fieldType: "textarea",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter complete current address",
      displayOrder: 11,
      section: "contact"
    },
    {
      id: "permanent_address",
      fieldName: "permanentAddress",
      fieldLabel: "Permanent Address",
      fieldType: "textarea",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter complete permanent address",
      displayOrder: 12,
      section: "contact"
    },

    // Parent/Guardian Information Section
    {
      id: "father_name",
      fieldName: "fatherName",
      fieldLabel: "Father's Name",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter father's full name",
      displayOrder: 13,
      section: "parent"
    },
    {
      id: "father_occupation",
      fieldName: "fatherOccupation",
      fieldLabel: "Father's Occupation",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter father's occupation",
      displayOrder: 14,
      section: "parent"
    },
    {
      id: "father_mobile",
      fieldName: "fatherMobile",
      fieldLabel: "Father's Mobile",
      fieldType: "phone",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter father's mobile number",
      displayOrder: 15,
      section: "parent"
    },
    {
      id: "father_email",
      fieldName: "fatherEmail",
      fieldLabel: "Father's Email",
      fieldType: "email",
      isRequired: false,
      isVisible: true,
      placeholder: "Enter father's email address",
      displayOrder: 16,
      section: "parent"
    },
    {
      id: "mother_name",
      fieldName: "motherName",
      fieldLabel: "Mother's Name",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter mother's full name",
      displayOrder: 17,
      section: "parent"
    },
    {
      id: "mother_occupation",
      fieldName: "motherOccupation",
      fieldLabel: "Mother's Occupation",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter mother's occupation",
      displayOrder: 18,
      section: "parent"
    },
    {
      id: "mother_mobile",
      fieldName: "motherMobile",
      fieldLabel: "Mother's Mobile",
      fieldType: "phone",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter mother's mobile number",
      displayOrder: 19,
      section: "parent"
    },
    {
      id: "mother_email",
      fieldName: "motherEmail",
      fieldLabel: "Mother's Email",
      fieldType: "email",
      isRequired: false,
      isVisible: true,
      placeholder: "Enter mother's email address",
      displayOrder: 20,
      section: "parent"
    },
    {
      id: "guardian_name",
      fieldName: "guardianName",
      fieldLabel: "Guardian Name (if applicable)",
      fieldType: "text",
      isRequired: false,
      isVisible: true,
      placeholder: "Enter guardian's name",
      displayOrder: 21,
      section: "parent"
    },
    {
      id: "guardian_contact",
      fieldName: "guardianContact",
      fieldLabel: "Guardian Contact",
      fieldType: "phone",
      isRequired: false,
      isVisible: true,
      placeholder: "Enter guardian's contact number",
      displayOrder: 22,
      section: "parent"
    },

    // Academic Information Section
    {
      id: "previous_school",
      fieldName: "previousSchool",
      fieldLabel: "Previous School",
      fieldType: "text",
      isRequired: true,
      isVisible: true,
      placeholder: "Enter previous school name",
      displayOrder: 23,
      section: "academic"
    },
    {
      id: "previous_class",
      fieldName: "previousClass",
      fieldLabel: "Previous Class",
      fieldType: "select",
      isRequired: true,
      isVisible: true,
      options: ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"],
      displayOrder: 24,
      section: "academic"
    },
    {
      id: "board",
      fieldName: "board",
      fieldLabel: "Previous School Board",
      fieldType: "select",
      isRequired: true,
      isVisible: true,
      options: ["CBSE", "ICSE", "State Board", "IGCSE", "IB", "Other"],
      displayOrder: 25,
      section: "academic"
    },
    {
      id: "applying_for_grade",
      fieldName: "applyingForGrade",
      fieldLabel: "Applying for Grade",
      fieldType: "select",
      isRequired: true,
      isVisible: true,
      options: ["Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"],
      displayOrder: 26,
      section: "academic"
    },
    {
      id: "previous_percentage",
      fieldName: "previousPercentage",
      fieldLabel: "Previous Academic Performance (%)",
      fieldType: "text",
      isRequired: false,
      isVisible: true,
      placeholder: "Enter percentage or grade",
      displayOrder: 27,
      section: "academic"
    },

    // Documents Section
    {
      id: "student_photo",
      fieldName: "studentPhoto",
      fieldLabel: "Student Photograph",
      fieldType: "file",
      isRequired: true,
      isVisible: true,
      helpText: "Upload recent passport size photograph",
      displayOrder: 28,
      section: "documents"
    },
    {
      id: "birth_certificate",
      fieldName: "birthCertificate",
      fieldLabel: "Birth Certificate",
      fieldType: "file",
      isRequired: true,
      isVisible: true,
      helpText: "Upload birth certificate",
      displayOrder: 29,
      section: "documents"
    },
    {
      id: "marksheet",
      fieldName: "marksheet",
      fieldLabel: "Previous Class Marksheet",
      fieldType: "file",
      isRequired: true,
      isVisible: true,
      helpText: "Upload previous class marksheet/report card",
      displayOrder: 30,
      section: "documents"
    },
    {
      id: "transfer_certificate",
      fieldName: "transferCertificate",
      fieldLabel: "Transfer Certificate",
      fieldType: "file",
      isRequired: false,
      isVisible: true,
      helpText: "Upload transfer certificate (if applicable)",
      displayOrder: 31,
      section: "documents"
    },
    {
      id: "aadhar_card",
      fieldName: "aadharCard",
      fieldLabel: "Aadhar Card",
      fieldType: "file",
      isRequired: false,
      isVisible: true,
      helpText: "Upload Aadhar card copy",
      displayOrder: 32,
      section: "documents"
    },

    // Additional Information Section
    {
      id: "special_needs",
      fieldName: "specialNeeds",
      fieldLabel: "Special Needs/Medical Conditions",
      fieldType: "textarea",
      isRequired: false,
      isVisible: true,
      placeholder: "Mention any special needs or medical conditions",
      displayOrder: 33,
      section: "additional"
    },
    {
      id: "interests",
      fieldName: "interests",
      fieldLabel: "Interests & Hobbies",
      fieldType: "select",
      isRequired: false,
      isVisible: true,
      options: ["Sports", "Music", "Dance", "Art", "Reading", "Science", "Technology", "Drama", "Other"],
      displayOrder: 34,
      section: "additional"
    },
    {
      id: "hear_about_us",
      fieldName: "hearAboutUs",
      fieldLabel: "How did you hear about us?",
      fieldType: "select",
      isRequired: false,
      isVisible: true,
      options: ["Website", "Social Media", "Friends/Family", "Advertisement", "School Visit", "Other"],
      displayOrder: 35,
      section: "additional"
    }
  ],

  // About content structure
  aboutContent: {
    title: "About Our School",
    subtitle: "Nurturing minds with motherly care since establishment",
    mainContent: "At Annai Matriculation School, we believe our school is \"THE FOUNDATION OF YOUR CHILD'S FUTURE\". Our motto is \"LOVE - SERVICE - PURITY\".\n\nThe school is being run by professionally qualified and well-experienced promoters having more than twenty years of experience in the field of Child Education, School Education, and training who are committed to leaving a mark in the educational field in twin cities.\n\nInitially, we started the School as Primary School. With our continuous effort and dedication towards education, which was well acknowledged by the parents, today we are running Classes until 10th Standard.\n\nIn 10th Standard, we have got 100% Results for the past 6 years. Also, we have got Centum in Social Science for the Academic year 2012. It is the sincere effort from the Management and staff together that we make this a success.",
    vision: "To provide quality education with moral values and create responsible citizens for tomorrow.",
    mission: "To nurture young minds with care, dedication, and excellence in education while maintaining our core values of Love, Service, and Purity.",
    showVision: true,
    showMission: true,
    facilities: [
      {
        title: "Smart Classrooms",
        description: "Modern technology-enabled classrooms for interactive learning",
        image: "/images/facilities/classroom.jpg",
        visible: true
      },
      {
        title: "Science Laboratory",
        description: "Well-equipped laboratory for hands-on science experiments",
        image: "/images/facilities/lab.jpg",
        visible: true
      },
      {
        title: "Library",
        description: "Extensive collection of books and digital resources",
        image: "/images/facilities/library.jpg",
        visible: true
      },
      {
        title: "Sports Facilities",
        description: "Playground and sports equipment for physical development",
        image: "/images/facilities/sports.jpg",
        visible: true
      }
    ]
  },

  // News structure
  news: [],

  // Carousel structure
  carousel: [
    {
      id: "slide1",
      title: "Welcome to Annai Matriculation School",
      description: "At Annai School, we believe every child has the potential to achieve greatness. Our comprehensive curriculum and dedicated faculty ensure holistic development of each student.",
      image: "/images/carousel/slide1.jpg",
      ctaText: "Apply Now",
      ctaHref: "/admissions/register",
      isActive: true,
      order: 1
    }
  ],

  // Announcements structure
  announcements: []
};

// Write initial data to files
Object.entries(initialData).forEach(([name, data]) => {
  const fileName = name === 'formConfig' ? 'form-config.json' : 
                   name === 'aboutContent' ? 'about-content.json' : 
                   `${name}.json`;
  const filePath = path.join(dataDir, fileName);
  
  console.log(`✅ Creating ${fileName}`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});

console.log('🎉 Database reset completed successfully!');
console.log('\n📊 Database Structure:');
console.log('├── profiles.json (User profiles)');
console.log('├── applications.json (Admission applications)');
console.log('├── students.json (Enrolled students)');
console.log('├── enrollments.json (Enrollment statistics)');
console.log('├── form-config.json (Dynamic form configuration)');
console.log('├── about-content.json (About page content)');
console.log('├── news.json (News & announcements)');
console.log('├── carousel.json (Homepage carousel)');
console.log('└── announcements.json (School announcements)');

console.log('\n🔧 Next Steps:');
console.log('1. Run: node reset-database.js');
console.log('2. Start your application');
console.log('3. Create admin user through signup');
console.log('4. Test the complete flow');
