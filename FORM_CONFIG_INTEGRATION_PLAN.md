# Form Configuration Integration Plan

## Current Situation Analysis

### ✅ What We Have

1. **Admin Form Configuration System** (`/api/admin/form-config`)
   - Allows admins to dynamically add/edit/remove form fields
   - Stores 48 default fields across 5 sections (personal, contact, parent, academic, documents, additional)
   - Fields stored in `data/form-config.json`
   - Fully functional CRUD API

2. **Hardcoded Registration Form** (`/admissions/register/page.tsx`)
   - Fixed fields that cannot be changed by admin
   - Currently submits to `/api/admissions` (JUST DELETED - BROKEN!)
   - Only for logged-in users
   - Hardcoded validation schema

3. **Signup Route** (`/api/auth/signup`)
   - For NEW users to create account + application
   - Creates entry in `student` table in MySQL
   - Requires password field

### ❌ The Problem

**The admin form configuration system is NOT connected to the actual signup/registration forms!**

Changes made by admin in form-config do not affect what students see on the forms.

### 🔧 What Was Just Done

1. **Deleted** `/api/admissions/route.ts` (unused old endpoint using file-based storage)
2. **This broke** `/admissions/register` page (it was calling that endpoint)

---

## Solutions

### Option 1: Quick Fix - Restore Basic Functionality

**Restore the application submission for logged-in users**

Create a new `/api/applications/submit` endpoint that:
- Accepts applications from logged-in users
- Stores in MySQL `student` table with status = 'submitted'
- Works with current hardcoded form

**Pros:**
- Quick to implement
- Doesn't break existing form
- Minimal changes

**Cons:**
- Admin form-config still not used
- Forms remain hardcoded

---

### Option 2: Full Dynamic Form Integration (Recommended)

**Make the signup/registration forms use admin-configured fields**

#### Step 1: Create New Application Submission API

File: `/api/applications/submit/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { query } from '@/lib/mysql'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check if user already has application
    const existing = await query(
      'SELECT id FROM student WHERE email = ? AND status IN (?, ?)',
      [session.user.email, 'submitted', 'pending', 'approved']
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'You have already submitted an application' },
        { status: 400 }
      )
    }

    const formData = await request.json()
    
    // Generate IDs
    const studentId = `STU${Date.now()}`
    const applicationId = `APP${new Date().getFullYear()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Insert application into database
    // (Use dynamic field mapping from formData)
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationId
    })

  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

#### Step 2: Create Dynamic Form Component

File: `/components/forms/dynamic-application-form.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface FormField {
  id: string
  fieldName: string
  fieldLabel: string
  fieldType: string
  isRequired: boolean
  isVisible: boolean
  section: string
  displayOrder: number
  options?: string[]
  placeholder?: string
  helpText?: string
}

export function DynamicApplicationForm() {
  const [formConfig, setFormConfig] = useState<FormField[]>([])
  const [loading, setLoading] = useState(true)
  
  // Fetch form configuration from admin
  useEffect(() => {
    fetch('/api/admin/form-config')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormConfig(data.data)
        }
        setLoading(false)
      })
  }, [])

  // Group fields by section
  const sections = {
    personal: formConfig.filter(f => f.section === 'personal' && f.isVisible),
    contact: formConfig.filter(f => f.section === 'contact' && f.isVisible),
    parent: formConfig.filter(f => f.section === 'parent' && f.isVisible),
    academic: formConfig.filter(f => f.section === 'academic' && f.isVisible),
    documents: formConfig.filter(f => f.section === 'documents' && f.isVisible),
    additional: formConfig.filter(f => f.section === 'additional' && f.isVisible),
  }

  const form = useForm()

  const onSubmit = async (data: any) => {
    const response = await fetch('/api/applications/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    // Handle response
  }

  if (loading) return <div>Loading form...</div>

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Render sections dynamically */}
      {Object.entries(sections).map(([sectionName, fields]) => (
        <div key={sectionName}>
          <h3>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Information</h3>
          {fields.map(field => (
            <div key={field.id}>
              {renderField(field, form)}
            </div>
          ))}
        </div>
      ))}
      <button type="submit">Submit Application</button>
    </form>
  )
}

function renderField(field: FormField, form: any) {
  switch (field.fieldType) {
    case 'text':
    case 'email':
    case 'phone':
      return (
        <input
          type={field.fieldType}
          {...form.register(field.fieldName, { required: field.isRequired })}
          placeholder={field.placeholder}
        />
      )
    case 'select':
      return (
        <select {...form.register(field.fieldName, { required: field.isRequired })}>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )
    case 'textarea':
      return (
        <textarea {...form.register(field.fieldName, { required: field.isRequired })} />
      )
    case 'date':
      return (
        <input type="date" {...form.register(field.fieldName, { required: field.isRequired })} />
      )
    case 'file':
      return (
        <input type="file" {...form.register(field.fieldName, { required: field.isRequired })} />
      )
    default:
      return null
  }
}
```

#### Step 3: Update Registration Page

Replace `/admissions/register/page.tsx` to use the dynamic form:

```typescript
import { DynamicApplicationForm } from '@/components/forms/dynamic-application-form'

export default function AdmissionRegisterPage() {
  return (
    <div>
      <Navbar />
      <main>
        <h1>Admission Application</h1>
        <DynamicApplicationForm />
      </main>
      <Footer />
    </div>
  )
}
```

**Pros:**
- Admin can add/remove/modify fields from dashboard
- Forms automatically reflect admin changes
- More flexible and scalable
- Follows best practices

**Cons:**
- More complex implementation
- Need to handle file uploads dynamically
- More testing required

---

### Option 3: Hybrid Approach

Keep some core fields hardcoded (name, email, etc.) but allow admin to add **optional custom fields** dynamically.

---

## Current Status & Next Steps

### ✅ Done
- Deleted unused `/api/admissions` route
- Identified the disconnect between form-config and actual forms

### ⚠️ Broken
- `/admissions/register` page now has no endpoint to submit to

### 🚀 Recommended Action

**Choose one of the following:**

1. **Quick Fix (15 minutes)**
   - I'll create `/api/applications/submit` with basic fields
   - Update register page to use new endpoint
   - Form remains hardcoded but works

2. **Full Dynamic Implementation (2-3 hours)**
   - Create dynamic form component
   - Create application submission API with field mapping
   - Update register page to use dynamic form
   - Admin changes will reflect in signup form

3. **Just Fix Current Registration**
   - Keep hardcoded form
   - Point to `/api/auth/signup` but add logic to handle existing users
   - Quick but messy

---

## What The Admin Form-Config Currently Offers

The admin can configure:

### 48 Predefined Fields Across 5 Sections:

**Personal Information (11 fields):**
- First Name, Middle Name, Last Name
- Date of Birth, Gender, Blood Group
- Nationality, Religion, Category
- Aadhar Number, Place of Birth

**Contact Information (5 fields):**
- Mobile, Alternate Mobile
- Current Address, Permanent Address
- PIN Code

**Parent/Guardian Information (13 fields):**
- Father's Name, Occupation, Mobile, Email, Qualification
- Mother's Name, Occupation, Mobile, Email, Qualification
- Guardian Name, Contact
- Annual Family Income

**Academic Information (7 fields):**
- Applying for Grade
- Previous School, Class, Board, Percentage
- Medium of Instruction
- Extracurricular Activities

**Documents (7 fields):**
- Student Photo
- Birth Certificate, Aadhar Card
- Transfer Certificate, Marksheet
- Income Certificate, Caste Certificate

**Additional Information (5 fields):**
- Siblings in School
- Transport Required
- Special Educational Needs
- Remarks

### Admin Can:
- Add new fields (POST `/api/admin/form-config`)
- Edit existing fields (PUT `/api/admin/form-config`)
- Delete fields (DELETE `/api/admin/form-config?fieldId=X`)
- Toggle field visibility (`isVisible`)
- Set required/optional (`isRequired`)
- Change display order
- Update field options (for dropdowns)

---

## Decision Time

**What would you like me to do?**

A. Quick fix - create new endpoint, keep hardcoded form
B. Full dynamic form - connect admin form-config to registration
C. Something else (please specify)

Let me know and I'll implement it!
