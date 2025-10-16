import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/mysql'

// GET - Fetch all form fields
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const fields = await db.query(
      'SELECT * FROM admission_form_fields ORDER BY display_order ASC'
    )

    // Parse JSON fields
    const parsedFields = fields.map((field: any) => ({
      ...field,
      options: field.options ? (typeof field.options === 'string' ? JSON.parse(field.options) : field.options) : null,
      validation_rules: field.validation_rules ? (typeof field.validation_rules === 'string' ? JSON.parse(field.validation_rules) : field.validation_rules) : null
    }))

    return NextResponse.json({
      success: true,
      data: parsedFields
    })
  } catch (error) {
    console.error('Error fetching form fields:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch form fields' },
      { status: 500 }
    )
  }
}

// POST - Create new form field
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      field_name,
      field_label,
      field_type,
      field_placeholder,
      is_required,
      is_enabled,
      display_order,
      options,
      validation_rules
    } = body

    // Validation
    if (!field_name || !field_label || !field_type) {
      return NextResponse.json(
        { success: false, error: 'Field name, label, and type are required' },
        { status: 400 }
      )
    }

    // Check if field name already exists
    const existing = await db.queryOne(
      'SELECT id FROM admission_form_fields WHERE field_name = ?',
      [field_name]
    )

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Field name already exists' },
        { status: 400 }
      )
    }

    const result = await db.query(
      `INSERT INTO admission_form_fields 
      (field_name, field_label, field_type, field_placeholder, is_required, is_enabled, display_order, options, validation_rules) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        field_name,
        field_label,
        field_type,
        field_placeholder || null,
        is_required ?? true,
        is_enabled ?? true,
        display_order || 0,
        options ? JSON.stringify(options) : null,
        validation_rules ? JSON.stringify(validation_rules) : null
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Form field created successfully',
      data: result
    })
  } catch (error) {
    console.error('Error creating form field:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create form field' },
      { status: 500 }
    )
  }
}

// PUT - Update form field
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      id,
      field_name,
      field_label,
      field_type,
      field_placeholder,
      is_required,
      is_enabled,
      display_order,
      options,
      validation_rules
    } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Field ID is required' },
        { status: 400 }
      )
    }

    // Check if field exists
    const existing = await db.queryOne(
      'SELECT id FROM admission_form_fields WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Field not found' },
        { status: 404 }
      )
    }

    // If field_name is being changed, check for duplicates
    if (field_name) {
      const duplicate = await db.queryOne(
        'SELECT id FROM admission_form_fields WHERE field_name = ? AND id != ?',
        [field_name, id]
      )

      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Field name already exists' },
          { status: 400 }
        )
      }
    }

    await db.query(
      `UPDATE admission_form_fields 
      SET field_name = ?, field_label = ?, field_type = ?, field_placeholder = ?, 
          is_required = ?, is_enabled = ?, display_order = ?, options = ?, validation_rules = ?
      WHERE id = ?`,
      [
        field_name,
        field_label,
        field_type,
        field_placeholder || null,
        is_required ?? true,
        is_enabled ?? true,
        display_order || 0,
        options ? JSON.stringify(options) : null,
        validation_rules ? JSON.stringify(validation_rules) : null,
        id
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Form field updated successfully'
    })
  } catch (error) {
    console.error('Error updating form field:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update form field' },
      { status: 500 }
    )
  }
}

// DELETE - Delete form field
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Field ID is required' },
        { status: 400 }
      )
    }

    // Check if field exists
    const existing = await db.queryOne(
      'SELECT id FROM admission_form_fields WHERE id = ?',
      [id]
    )

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Field not found' },
        { status: 404 }
      )
    }

    await db.query('DELETE FROM admission_form_fields WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Form field deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting form field:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete form field' },
      { status: 500 }
    )
  }
}
