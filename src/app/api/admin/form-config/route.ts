import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

// MySQL-based storage for form configuration
// Dynamic forms controlled by admin from dashboard

// Note: Default form configuration is now in migrations/001_create_form_configurations.sql
// This prevents the file from being too large
const __REMOVED_defaultFormConfig: any[] = [
  // Personal Information (11 fields)
  { id: '1', fieldName: 'firstName', fieldLabel: 'First Name', fieldType: 'text', isRequired: true, isVisible: true, section: 'personal', displayOrder: 1, placeholder: 'Enter first name', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', fieldName: 'middleName', fieldLabel: 'Middle Name', fieldType: 'text', isRequired: false, isVisible: true, section: 'personal', displayOrder: 2, placeholder: 'Enter middle name', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', fieldName: 'lastName', fieldLabel: 'Last Name', fieldType: 'text', isRequired: true, isVisible: true, section: 'personal', displayOrder: 3, placeholder: 'Enter last name', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', fieldName: 'dateOfBirth', fieldLabel: 'Date of Birth', fieldType: 'date', isRequired: true, isVisible: true, section: 'personal', displayOrder: 4, placeholder: null, options: null, helpText: 'Student must be at least 3 years old', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '5', fieldName: 'gender', fieldLabel: 'Gender', fieldType: 'select', isRequired: true, isVisible: true, section: 'personal', displayOrder: 5, placeholder: null, options: JSON.stringify(['male', 'female', 'other']), helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '6', fieldName: 'bloodGroup', fieldLabel: 'Blood Group', fieldType: 'select', isRequired: false, isVisible: true, section: 'personal', displayOrder: 6, placeholder: null, options: JSON.stringify(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']), helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '7', fieldName: 'nationality', fieldLabel: 'Nationality', fieldType: 'text', isRequired: true, isVisible: true, section: 'personal', displayOrder: 7, placeholder: 'e.g., Indian', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '8', fieldName: 'religion', fieldLabel: 'Religion', fieldType: 'select', isRequired: false, isVisible: true, section: 'personal', displayOrder: 8, placeholder: null, options: JSON.stringify(['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']), helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '9', fieldName: 'category', fieldLabel: 'Category', fieldType: 'select', isRequired: false, isVisible: true, section: 'personal', displayOrder: 9, placeholder: null, options: JSON.stringify(['General', 'OBC', 'SC', 'ST', 'Other']), helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '10', fieldName: 'aadharNumber', fieldLabel: 'Aadhar Number', fieldType: 'text', isRequired: false, isVisible: true, section: 'personal', displayOrder: 10, placeholder: 'Enter 12-digit Aadhar number', options: null, helpText: 'Optional but recommended for verification', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '11', fieldName: 'placeOfBirth', fieldLabel: 'Place of Birth', fieldType: 'text', isRequired: false, isVisible: true, section: 'personal', displayOrder: 11, placeholder: 'Enter place of birth', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  
  // Contact Information (5 fields)
  { id: '12', fieldName: 'mobile', fieldLabel: 'Mobile Number', fieldType: 'phone', isRequired: true, isVisible: true, section: 'contact', displayOrder: 1, placeholder: 'Enter 10-digit mobile number', options: null, helpText: 'Primary contact number', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '13', fieldName: 'alternateMobile', fieldLabel: 'Alternate Mobile Number', fieldType: 'phone', isRequired: false, isVisible: true, section: 'contact', displayOrder: 2, placeholder: 'Enter alternate mobile number', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '14', fieldName: 'currentAddress', fieldLabel: 'Current Address', fieldType: 'textarea', isRequired: true, isVisible: true, section: 'contact', displayOrder: 3, placeholder: 'Enter complete current address', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '15', fieldName: 'permanentAddress', fieldLabel: 'Permanent Address', fieldType: 'textarea', isRequired: true, isVisible: true, section: 'contact', displayOrder: 4, placeholder: 'Enter permanent address', options: null, helpText: 'Check "Same as Current" if addresses match', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '16', fieldName: 'pincode', fieldLabel: 'PIN Code', fieldType: 'text', isRequired: false, isVisible: true, section: 'contact', displayOrder: 5, placeholder: 'Enter 6-digit PIN code', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  
  // Parent/Guardian Information (13 fields)
  { id: '17', fieldName: 'fatherName', fieldLabel: "Father's Name", fieldType: 'text', isRequired: true, isVisible: true, section: 'parent', displayOrder: 1, placeholder: "Enter father's full name", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '18', fieldName: 'fatherOccupation', fieldLabel: "Father's Occupation", fieldType: 'text', isRequired: false, isVisible: true, section: 'parent', displayOrder: 2, placeholder: "Enter father's occupation", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '19', fieldName: 'fatherMobile', fieldLabel: "Father's Mobile Number", fieldType: 'phone', isRequired: false, isVisible: true, section: 'parent', displayOrder: 3, placeholder: "Enter father's mobile number", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '20', fieldName: 'fatherEmail', fieldLabel: "Father's Email", fieldType: 'email', isRequired: false, isVisible: true, section: 'parent', displayOrder: 4, placeholder: "Enter father's email address", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '21', fieldName: 'fatherQualification', fieldLabel: "Father's Qualification", fieldType: 'text', isRequired: false, isVisible: true, section: 'parent', displayOrder: 5, placeholder: "Enter father's educational qualification", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '22', fieldName: 'motherName', fieldLabel: "Mother's Name", fieldType: 'text', isRequired: true, isVisible: true, section: 'parent', displayOrder: 6, placeholder: "Enter mother's full name", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '23', fieldName: 'motherOccupation', fieldLabel: "Mother's Occupation", fieldType: 'text', isRequired: false, isVisible: true, section: 'parent', displayOrder: 7, placeholder: "Enter mother's occupation", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '24', fieldName: 'motherMobile', fieldLabel: "Mother's Mobile Number", fieldType: 'phone', isRequired: false, isVisible: true, section: 'parent', displayOrder: 8, placeholder: "Enter mother's mobile number", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '25', fieldName: 'motherEmail', fieldLabel: "Mother's Email", fieldType: 'email', isRequired: false, isVisible: true, section: 'parent', displayOrder: 9, placeholder: "Enter mother's email address", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '26', fieldName: 'motherQualification', fieldLabel: "Mother's Qualification", fieldType: 'text', isRequired: false, isVisible: true, section: 'parent', displayOrder: 10, placeholder: "Enter mother's educational qualification", options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '27', fieldName: 'guardianName', fieldLabel: 'Guardian Name', fieldType: 'text', isRequired: false, isVisible: true, section: 'parent', displayOrder: 11, placeholder: 'If different from parents', options: null, helpText: 'Only if guardian is different from parents', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '28', fieldName: 'guardianContact', fieldLabel: 'Guardian Contact Number', fieldType: 'phone', isRequired: false, isVisible: true, section: 'parent', displayOrder: 12, placeholder: 'Enter guardian contact number', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '29', fieldName: 'annualIncome', fieldLabel: 'Annual Family Income', fieldType: 'select', isRequired: false, isVisible: true, section: 'parent', displayOrder: 13, placeholder: null, options: JSON.stringify(['Below 1 Lakh', '1-3 Lakhs', '3-5 Lakhs', '5-10 Lakhs', 'Above 10 Lakhs']), helpText: 'For scholarship eligibility', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  
  // Academic Information (7 fields)
  { id: '30', fieldName: 'applyingForGrade', fieldLabel: 'Applying for Grade/Class', fieldType: 'select', isRequired: true, isVisible: true, section: 'academic', displayOrder: 1, placeholder: null, options: JSON.stringify(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']), helpText: 'Select the grade you are applying for', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '31', fieldName: 'previousSchool', fieldLabel: 'Previous School Name', fieldType: 'text', isRequired: false, isVisible: true, section: 'academic', displayOrder: 2, placeholder: 'Enter previous school name', options: null, helpText: 'Leave blank if applying for Grade 1', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '32', fieldName: 'previousClass', fieldLabel: 'Previous Class/Grade', fieldType: 'text', isRequired: false, isVisible: true, section: 'academic', displayOrder: 3, placeholder: 'e.g., Grade 10, Class X', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '33', fieldName: 'board', fieldLabel: 'Previous Board', fieldType: 'select', isRequired: false, isVisible: true, section: 'academic', displayOrder: 4, placeholder: null, options: JSON.stringify(['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other']), helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '34', fieldName: 'previousPercentage', fieldLabel: 'Previous Class Percentage/Grade', fieldType: 'text', isRequired: false, isVisible: true, section: 'academic', displayOrder: 5, placeholder: 'e.g., 85% or A+', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '35', fieldName: 'mediumOfInstruction', fieldLabel: 'Preferred Medium of Instruction', fieldType: 'select', isRequired: true, isVisible: true, section: 'academic', displayOrder: 6, placeholder: null, options: JSON.stringify(['English', 'Hindi', 'Regional Language']), helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '36', fieldName: 'extracurricular', fieldLabel: 'Extracurricular Activities/Achievements', fieldType: 'textarea', isRequired: false, isVisible: true, section: 'academic', displayOrder: 7, placeholder: 'Any sports, arts, or other achievements', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  
  // Documents (7 fields)
  { id: '37', fieldName: 'studentPhoto', fieldLabel: 'Student Photo', fieldType: 'file', isRequired: true, isVisible: true, section: 'documents', displayOrder: 1, placeholder: null, options: null, helpText: 'Passport size photo (JPEG/PNG, max 2MB)', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '38', fieldName: 'birthCertificate', fieldLabel: 'Birth Certificate', fieldType: 'file', isRequired: true, isVisible: true, section: 'documents', displayOrder: 2, placeholder: null, options: null, helpText: 'PDF or image file (max 5MB)', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '39', fieldName: 'aadharCard', fieldLabel: 'Aadhar Card', fieldType: 'file', isRequired: false, isVisible: true, section: 'documents', displayOrder: 3, placeholder: null, options: null, helpText: 'Student Aadhar card copy', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '40', fieldName: 'transferCertificate', fieldLabel: 'Transfer Certificate', fieldType: 'file', isRequired: false, isVisible: true, section: 'documents', displayOrder: 4, placeholder: null, options: null, helpText: 'TC from previous school (if applicable)', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '41', fieldName: 'marksheet', fieldLabel: 'Previous Marksheet/Report Card', fieldType: 'file', isRequired: false, isVisible: true, section: 'documents', displayOrder: 5, placeholder: null, options: null, helpText: 'Latest academic records', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '42', fieldName: 'incomeCertificate', fieldLabel: 'Income Certificate', fieldType: 'file', isRequired: false, isVisible: true, section: 'documents', displayOrder: 6, placeholder: null, options: null, helpText: 'For scholarship applicants', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '43', fieldName: 'casteCertificate', fieldLabel: 'Caste Certificate', fieldType: 'file', isRequired: false, isVisible: true, section: 'documents', displayOrder: 7, placeholder: null, options: null, helpText: 'If applicable for reservation benefits', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  
  // Additional Information (5 fields)
  { id: '44', fieldName: 'siblings', fieldLabel: 'Siblings Studying in School', fieldType: 'select', isRequired: false, isVisible: true, section: 'additional', displayOrder: 1, placeholder: null, options: JSON.stringify(['None', '1', '2', '3 or more']), helpText: 'Number of siblings already enrolled', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '45', fieldName: 'siblingNames', fieldLabel: 'Sibling Names and Classes', fieldType: 'textarea', isRequired: false, isVisible: true, section: 'additional', displayOrder: 2, placeholder: 'e.g., Ravi - Grade 8, Priya - Grade 5', options: null, helpText: 'If siblings are studying in this school', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '46', fieldName: 'transportRequired', fieldLabel: 'School Transport Required', fieldType: 'select', isRequired: false, isVisible: true, section: 'additional', displayOrder: 3, placeholder: null, options: JSON.stringify(['Yes', 'No']), helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '47', fieldName: 'specialNeeds', fieldLabel: 'Special Educational Needs', fieldType: 'textarea', isRequired: false, isVisible: true, section: 'additional', displayOrder: 4, placeholder: 'Any learning disabilities or special requirements', options: null, helpText: 'Please provide details if applicable', validationRules: null, createdAt: new Date(), updatedAt: new Date() },
  { id: '48', fieldName: 'remarks', fieldLabel: 'Additional Remarks/Comments', fieldType: 'textarea', isRequired: false, isVisible: true, section: 'additional', displayOrder: 5, placeholder: 'Any additional information', options: null, helpText: null, validationRules: null, createdAt: new Date(), updatedAt: new Date() }
]

// No initialization needed - data is in MySQL database

// No helper functions needed - using direct MySQL queries

// GET - Fetch form configuration from MySQL
export async function GET(request: NextRequest) {
  try {
    console.log('📡 Fetching form configuration from MySQL...')
    
    const formConfig = await query(
      'SELECT * FROM form_configurations WHERE is_visible = 1 ORDER BY section, display_order ASC'
    )
    
    console.log(`✅ Loaded ${formConfig.length} form fields from database`)
    
    // Process the data
    const processedConfig = formConfig.map((field: any) => ({
      id: field.id,
      fieldName: field.field_name,
      fieldLabel: field.field_label,
      fieldType: field.field_type,
      isRequired: field.is_required === 1,
      isVisible: field.is_visible === 1,
      placeholder: field.placeholder,
      helpText: field.help_text,
      options: field.options ? JSON.parse(field.options) : null,
      validationRules: field.validation_rules ? JSON.parse(field.validation_rules) : null,
      displayOrder: field.display_order,
      section: field.section,
      createdAt: field.created_at,
      updatedAt: field.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: processedConfig
    })
  } catch (error) {
    console.error('❌ Error fetching form configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch form configuration', details: String(error) },
      { status: 500 }
    )
  }
}

// PUT - Bulk update form configuration in MySQL (for admin page save)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { configs } = body

    if (!Array.isArray(configs)) {
      return NextResponse.json(
        { success: false, error: 'Invalid configuration data - expected array' },
        { status: 400 }
      )
    }

    console.log(`📝 Updating ${configs.length} form fields...`)

    // Update each field
    for (const config of configs) {
      await query(
        `UPDATE form_configurations 
         SET field_name = ?, field_label = ?, field_type = ?, 
             is_required = ?, is_visible = ?, 
             placeholder = ?, help_text = ?, options = ?, 
             display_order = ?, section = ?,
             updated_at = NOW()
         WHERE id = ?`,
        [
          config.fieldName,
          config.fieldLabel,
          config.fieldType,
          config.isRequired ? 1 : 0,
          config.isVisible ? 1 : 0,
          config.placeholder || null,
          config.helpText || null,
          config.options ? JSON.stringify(config.options) : null,
          config.displayOrder,
          config.section,
          config.id
        ]
      )
    }

    console.log('✅ Form configuration updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Form configuration updated successfully'
    })
  } catch (error) {
    console.error('❌ Error updating form configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update form configuration' },
      { status: 500 }
    )
  }
}

// POST - Create new form field configuration in MySQL
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    
    console.log('📝 Creating new form field:', body.fieldName)
    
    if (!body.fieldName || !body.fieldLabel || !body.fieldType || !body.section) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Let MySQL generate UUID automatically
    await query(
      `INSERT INTO form_configurations (
        id, field_name, field_label, field_type, is_required, is_visible,
        placeholder, help_text, options, validation_rules, display_order, section
      ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.fieldName,
        body.fieldLabel,
        body.fieldType,
        body.isRequired ? 1 : 0,
        body.isVisible !== false ? 1 : 0,
        body.placeholder || null,
        body.helpText || null,
        body.options ? JSON.stringify(body.options) : null,
        body.validationRules ? JSON.stringify(body.validationRules) : null,
        body.displayOrder || 0,
        body.section
      ]
    )

    console.log('✅ Form field created successfully:', body.fieldName)

    return NextResponse.json({
      success: true,
      message: 'Form field created successfully'
    })
  } catch (error) {
    console.error('Error creating form configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create form configuration' },
      { status: 500 }
    )
  }
}

// DELETE - Delete form field configuration from MySQL
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const fieldId = searchParams.get('fieldId')

    if (!fieldId) {
      return NextResponse.json(
        { success: false, error: 'Field ID is required' },
        { status: 400 }
      )
    }

    await query('DELETE FROM form_configurations WHERE id = ?', [fieldId])

    return NextResponse.json({
      success: true,
      message: 'Form field deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting form configuration:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete form configuration' },
      { status: 500 }
    )
  }
}

