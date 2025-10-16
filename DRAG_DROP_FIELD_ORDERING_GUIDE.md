# Drag & Drop Field Ordering - Complete Guide

## ✅ What Was Added

### 1. **Installed Drag & Drop Library**
- **Package**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Modern, accessible drag-and-drop for React

### 2. **Enhanced Admin Panel**
- **Drag handle** (≡ icon) on each field
- **Visual feedback** when dragging (field becomes transparent)
- **Order badge** showing current position
- **Auto-updates** `displayOrder` when fields are moved

### 3. **Updated Signup Form**
- **Respects displayOrder** from database
- **Automatically sorts** fields by position within each section
- **Real-time updates** when admin changes order

---

## 🎯 How to Use (Admin)

### Step 1: Go to Admin Panel
```
http://localhost:3001/admin/admission-control
```

### Step 2: Drag to Reorder
1. **Hover** over a field
2. **Click and hold** the grip icon (≡) on the left side
3. **Drag** up or down to desired position
4. **Release** to drop in new position
5. Toast notification: "Field order updated. Don't forget to save!"

### Step 3: Save Changes
- Click **"Save Changes"** button (orange when unsaved)
- All field positions saved to database
- Signup form automatically reflects new order

---

## 📊 How It Works

### Admin Panel Flow
```
1. Admin drags field from position 5 → position 2
2. arrayMove() reorders the array
3. displayOrder updated: [0, 1, 2, 3, 4, ...] for all fields
4. setHasUnsavedChanges(true) → Button turns orange
5. Admin clicks "Save Changes"
6. New displayOrder sent to database
7. Database updated via PUT /api/admin/form-config
```

### Signup Form Flow
```
1. Form fetches fields: GET /api/admin/form-config
2. Fields grouped by section (personal, contact, etc.)
3. Within each section, sorted by displayOrder (ascending)
4. Renders fields in correct order
```

### Database
```sql
-- displayOrder column in form_configurations table
SELECT field_name, display_order FROM form_configurations 
WHERE section = 'personal' 
ORDER BY display_order ASC;

+----------------+---------------+
| field_name     | display_order |
+----------------+---------------+
| firstName      |             0 |
| middleName     |             1 |
| lastName       |             2 |
| dateOfBirth    |             3 |
| gender         |             4 |
+----------------+---------------+
```

---

## 🎨 Visual Features

### Drag Handle
- **Icon**: Grip Vertical (≡)
- **Location**: Left side of each field
- **Cursor**: Changes to "grab" on hover, "grabbing" when dragging
- **Color**: Muted gray

### Dragging State
- **Opacity**: Field becomes 50% transparent
- **Z-index**: Elevated above other fields
- **Smooth**: CSS transitions for movement

### Order Badge
- **Shows**: "Order: 5" 
- **Updates**: Instantly when you drag and drop
- **Style**: Small outline badge

### Unsaved Changes Indicator
- **Save button**: Turns orange
- **Icon**: Alert circle
- **Text**: "Unsaved changes"

---

## 🧪 Test the Feature

### Test 1: Reorder Within Section
```
1. Go to admin panel
2. Filter by "Personal Information"
3. Drag "Last Name" field above "First Name"
4. Click "Save Changes"
5. Visit signup form
6. Check: Last Name field now appears before First Name
```

### Test 2: Reorder Across All Sections
```
1. Admin panel → "All Sections" filter
2. Drag any field to a different position
3. Note the "Order" badge number changes
4. Save
5. Signup form reflects the new order
```

### Test 3: Multiple Reorders
```
1. Drag field A to position 1
2. Drag field B to position 3  
3. Drag field C to position 5
4. All "Order" badges update instantly
5. Click "Save Changes" once
6. All changes saved in one batch
```

---

## 💡 Key Features

### 1. **Smart Positioning**
- When you drag a field between two others, it slots in perfectly
- All other fields automatically adjust their order
- No manual number entry needed

### 2. **Section Awareness**
- Fields stay within their sections (can't drag Personal → Contact)
- Order is maintained per section
- Filter view doesn't affect ordering

### 3. **Visual Feedback**
```
Before Drag:
┌─────────────────────────┐
│ ≡ First Name   Order: 0 │
│ ≡ Last Name    Order: 1 │
│ ≡ Date of Birth Order: 2│
└─────────────────────────┘

During Drag (Last Name):
┌─────────────────────────┐
│ ≡ First Name   Order: 0 │
│                         │ ← Drop zone
│ 👻 Last Name (dragging) │
│ ≡ Date of Birth Order: 2│
└─────────────────────────┘

After Drop:
┌─────────────────────────┐
│ ≡ Last Name    Order: 0 │ ✓
│ ≡ First Name   Order: 1 │
│ ≡ Date of Birth Order: 2│
└─────────────────────────┘
```

### 4. **Accessibility**
- Keyboard support (Tab, Space, Arrow keys)
- Screen reader announcements
- Focus management

---

## 🔧 Technical Implementation

### Components
```typescript
// SortableFieldItem - Individual draggable field
const SortableFieldItem = ({ field, ... }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })
  
  return (
    <div ref={setNodeRef} style={{ transform, transition }}>
      <div {...attributes} {...listeners}>
        <GripVertical /> {/* Drag handle */}
      </div>
      {/* Field content */}
    </div>
  )
}

// Main component
<DndContext onDragEnd={handleDragEnd}>
  <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
    {fields.map(field => (
      <SortableFieldItem key={field.id} field={field} />
    ))}
  </SortableContext>
</DndContext>
```

### Drag End Handler
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event
  
  if (over && active.id !== over.id) {
    const oldIndex = formFields.findIndex(f => f.id === active.id)
    const newIndex = formFields.findIndex(f => f.id === over.id)
    
    // Reorder array
    const newFields = arrayMove(formFields, oldIndex, newIndex)
    
    // Update displayOrder for all
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      displayOrder: index
    }))
    
    setFormFields(updatedFields)
    setHasUnsavedChanges(true)
  }
}
```

---

## 📝 API Changes

### PUT `/api/admin/form-config`
Now includes `displayOrder` in bulk updates:

```json
{
  "configs": [
    {
      "id": "uuid-1",
      "fieldName": "lastName",
      "displayOrder": 0,  // ← Updated
      ...
    },
    {
      "id": "uuid-2",
      "fieldName": "firstName",
      "displayOrder": 1,  // ← Updated
      ...
    }
  ]
}
```

### GET `/api/admin/form-config`
Returns fields with `displayOrder`:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "fieldName": "firstName",
      "displayOrder": 0,
      "section": "personal",
      ...
    }
  ]
}
```

---

## 🚀 Benefits

### For Admins
- **No manual numbering** - just drag and drop
- **Instant visual feedback** - see changes immediately
- **Bulk save** - change multiple orders, save once
- **Undo-friendly** - just drag back or refresh before saving

### For Students
- **Logical flow** - fields in sensible order
- **Consistent experience** - order matches admin's intent
- **Better UX** - most important fields first

### For Developers
- **Easy maintenance** - no hardcoded positions
- **Flexible** - admin controls everything
- **Type-safe** - TypeScript ensures correctness

---

## 🎉 Summary

Your admin panel now has **professional drag-and-drop field ordering**:

✅ **Drag handle** - Visual grip icon  
✅ **Smooth animations** - Professional feel  
✅ **Order badges** - Always know position  
✅ **Auto-save indicator** - Orange button when unsaved  
✅ **Database-backed** - Permanent order changes  
✅ **Signup form sync** - Order reflects immediately  

**Try it now**: Go to `/admin/admission-control` and start dragging fields! 🎊
