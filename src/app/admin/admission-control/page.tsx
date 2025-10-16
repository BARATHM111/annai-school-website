'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import AdminSidebar from '@/components/admin/optimized-sidebar'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Settings,
  GripVertical,
  AlertCircle,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface FormFieldConfig {
  id: string
  fieldName: string
  fieldLabel: string
  fieldType: 'text' | 'email' | 'phone' | 'date' | 'select' | 'file' | 'textarea' | 'password' | 'number'
  isRequired: boolean
  isVisible: boolean
  options?: string[]
  placeholder?: string
  helpText?: string
  validationRules?: any
  displayOrder: number
  section: string
}

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email Input' },
  { value: 'password', label: 'Password Input' },
  { value: 'phone', label: 'Phone Input' },
  { value: 'number', label: 'Number Input' },
  { value: 'date', label: 'Date Input' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'file', label: 'File Upload' }
]

const sections = [
  { value: 'personal', label: 'Student Information' },
  { value: 'contact', label: 'Contact Information' },
  { value: 'parent', label: 'Parent/Guardian Information' },
  { value: 'academic', label: 'Academic Information' },
  { value: 'documents', label: 'Documents' },
  { value: 'additional', label: 'Additional Information' }
]

// Sortable Field Item Component
function SortableFieldItem({ 
  field, 
  toggleFieldVisibility, 
  toggleFieldRequired, 
  openEditDialog, 
  handleDeleteField 
}: {
  field: FormFieldConfig
  toggleFieldVisibility: (id: string) => void
  toggleFieldRequired: (id: string) => void
  openEditDialog: (field: FormFieldConfig) => void
  handleDeleteField: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 border rounded-lg ${!field.isVisible ? 'opacity-50 bg-gray-50' : ''} ${isDragging ? 'z-50' : ''}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {!field.isVisible && <EyeOff className="h-4 w-4 text-muted-foreground" />}
            <h4 className="font-medium">{field.fieldLabel}</h4>
            <Badge variant="outline">{field.fieldType}</Badge>
            <Badge variant="secondary">{field.section}</Badge>
            <Badge variant="outline" className="text-xs">Order: {field.displayOrder}</Badge>
            {!field.isVisible && (
              <Badge variant="outline" className="text-xs text-muted-foreground">Hidden</Badge>
            )}
            {field.isRequired && (
              <Badge variant="destructive" className="text-xs">Required</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Field Name: {field.fieldName}
            {field.placeholder && ` • Placeholder: ${field.placeholder}`}
          </p>
          {field.helpText && (
            <p className="text-xs text-muted-foreground mt-1">
              Help: {field.helpText}
            </p>
          )}
          {field.options && field.options.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {field.options.map((option, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {option}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor={`visible-${field.id}`} className="text-sm">Visible</Label>
          <Switch
            checked={field.isVisible}
            onCheckedChange={() => toggleFieldVisibility(field.id)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor={`required-${field.id}`} className="text-sm">Required</Label>
          <Switch
            checked={field.isRequired}
            onCheckedChange={() => toggleFieldRequired(field.id)}
          />
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => openEditDialog(field)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleDeleteField(field.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function AdmissionControlPage() {
  const [formFields, setFormFields] = useState<FormFieldConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<FormFieldConfig | null>(null)
  const [selectedSection, setSelectedSection] = useState<string>('all')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  const [fieldForm, setFieldForm] = useState<{
    fieldName: string
    fieldLabel: string
    fieldType: 'text' | 'email' | 'phone' | 'date' | 'select' | 'file' | 'textarea' | 'password' | 'number'
    isRequired: boolean
    isVisible: boolean
    options: string[]
    placeholder: string
    helpText: string
    section: string
    displayOrder: number
  }>({
    fieldName: '',
    fieldLabel: '',
    fieldType: 'text',
    isRequired: false,
    isVisible: true,
    options: [],
    placeholder: '',
    helpText: '',
    section: 'personal',
    displayOrder: 0
  })

  useEffect(() => {
    fetchFormConfiguration()
  }, [])

  const fetchFormConfiguration = async () => {
    try {
      setIsLoading(true)
      console.log('🔄 Fetching form configuration from API...')
      const response = await fetch('/api/admin/form-config')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }
      
      const result = await response.json()
      console.log('📦 API Response:', result)
      
      if (result.success) {
        // Options are already parsed by the API, no need to parse again
        const processedFields = result.data.map((field: any) => ({
          ...field,
          options: field.options || []
        }))
        console.log(`✅ Loaded ${processedFields.length} form fields`)
        setFormFields(processedFields)
      } else {
        console.error('❌ API returned success:false', result)
        toast.error(result.error || 'Failed to load form configuration')
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
      toast.error(`Failed to load form configuration: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const saveFormConfiguration = async () => {
    try {
      setIsSaving(true)
      
      // Separate new fields (timestamp IDs) from existing fields (UUID)
      const newFields = formFields.filter(field => /^\d+$/.test(field.id))
      const existingFields = formFields.filter(field => !/^\d+$/.test(field.id))
      
      // Create new fields first
      for (const field of newFields) {
        const response = await fetch('/api/admin/form-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fieldName: field.fieldName,
            fieldLabel: field.fieldLabel,
            fieldType: field.fieldType,
            isRequired: field.isRequired,
            isVisible: field.isVisible,
            placeholder: field.placeholder,
            helpText: field.helpText,
            options: field.options,
            section: field.section,
            displayOrder: field.displayOrder
          })
        })
        
        const result = await response.json()
        if (!result.success) {
          toast.error(`Failed to create field: ${field.fieldLabel}`)
          setIsSaving(false)
          return
        }
      }
      
      // Update existing fields
      if (existingFields.length > 0) {
        const response = await fetch('/api/admin/form-config', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ configs: existingFields })
        })
        
        const result = await response.json()
        if (!result.success) {
          toast.error('Failed to update existing fields')
          setIsSaving(false)
          return
        }
      }
      
      toast.success('Form configuration saved successfully')
      setHasUnsavedChanges(false)
      
      // Reload the form fields to get proper UUIDs for new fields
      await fetchFormConfiguration()
      
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save form configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleFieldVisibility = (fieldId: string) => {
    setFormFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, isVisible: !field.isVisible }
        : field
    ))
    setHasUnsavedChanges(true)
  }

  const toggleFieldRequired = (fieldId: string) => {
    setFormFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, isRequired: !field.isRequired }
        : field
    ))
    setHasUnsavedChanges(true)
  }

  const openEditDialog = (field?: FormFieldConfig) => {
    if (field) {
      setEditingField(field)
      setFieldForm({
        fieldName: field.fieldName,
        fieldLabel: field.fieldLabel,
        fieldType: field.fieldType,
        isRequired: field.isRequired,
        isVisible: field.isVisible,
        options: field.options || [],
        placeholder: field.placeholder || '',
        helpText: field.helpText || '',
        section: field.section,
        displayOrder: field.displayOrder
      })
    } else {
      setEditingField(null)
      setFieldForm({
        fieldName: '',
        fieldLabel: '',
        fieldType: 'text',
        isRequired: false,
        isVisible: true,
        options: [],
        placeholder: '',
        helpText: '',
        section: 'personal',
        displayOrder: formFields.length
      })
    }
    setIsDialogOpen(true)
  }

  const handleSaveField = () => {
    if (!fieldForm.fieldName || !fieldForm.fieldLabel) {
      toast.error('Field name and label are required')
      return
    }

    const newField: FormFieldConfig = {
      id: editingField?.id || Date.now().toString(),
      ...fieldForm
    }

    if (editingField) {
      setFormFields(prev => prev.map(field => 
        field.id === editingField.id ? newField : field
      ))
    } else {
      setFormFields(prev => [...prev, newField])
    }

    setHasUnsavedChanges(true)
    setIsDialogOpen(false)
    toast.success(`Field ${editingField ? 'updated' : 'created'} successfully. Don't forget to save!`)
  }

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      setFormFields(prev => prev.filter(field => field.id !== fieldId))
      setHasUnsavedChanges(true)
      toast.success('Field deleted successfully. Don\'t forget to save!')
    }
  }

  const addOption = () => {
    setFieldForm(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const updateOption = (index: number, value: string) => {
    setFieldForm(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  const removeOption = (index: number) => {
    setFieldForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const getFieldsBySection = (section: string) => {
    if (section === 'all') return formFields
    return formFields.filter(field => field.section === section)
  }

  const getSectionStats = () => {
    const stats = sections.map(section => {
      const sectionFields = formFields.filter(field => field.section === section.value)
      const visibleFields = sectionFields.filter(field => field.isVisible)
      const requiredFields = sectionFields.filter(field => field.isRequired)
      
      return {
        section: section.label,
        total: sectionFields.length,
        visible: visibleFields.length,
        required: requiredFields.length
      }
    })
    
    return stats
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = formFields.findIndex(field => field.id === active.id)
      const newIndex = formFields.findIndex(field => field.id === over.id)

      const newFields = arrayMove(formFields, oldIndex, newIndex)
      
      // Update displayOrder for all fields
      const updatedFields = newFields.map((field, index) => ({
        ...field,
        displayOrder: index
      }))
      
      setFormFields(updatedFields)
      setHasUnsavedChanges(true)
      toast.success('Field order updated. Don\'t forget to save!')
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admission control panel...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admission Form Control</h1>
              <p className="text-muted-foreground mt-2">
                Manage application form fields, visibility, and requirements
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button onClick={() => openEditDialog()} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
              <Button 
                onClick={saveFormConfiguration} 
                disabled={isSaving}
                variant={hasUnsavedChanges ? "default" : "outline"}
                className={hasUnsavedChanges ? "bg-orange-600 hover:bg-orange-700" : ""}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes *' : 'Saved'}
              </Button>
              {hasUnsavedChanges && (
                <div className="flex items-center text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Unsaved changes
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {getSectionStats().map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-muted-foreground">{stat.section}</div>
                  <div className="text-2xl font-bold">{stat.total}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.visible} visible • {stat.required} required
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section Filter */}
          <div className="mb-6">
            <Label htmlFor="section-filter">Filter by Section</Label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map(section => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Form Fields List with Drag & Drop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Form Fields Configuration
                <Badge variant="outline" className="ml-2">Drag to reorder</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={getFieldsBySection(selectedSection).map(f => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {getFieldsBySection(selectedSection).map((field) => (
                      <SortableFieldItem
                        key={field.id}
                        field={field}
                        toggleFieldVisibility={toggleFieldVisibility}
                        toggleFieldRequired={toggleFieldRequired}
                        openEditDialog={openEditDialog}
                        handleDeleteField={handleDeleteField}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>

          {/* Add/Edit Field Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingField ? 'Edit Field' : 'Add New Field'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fieldName">Field Name *</Label>
                    <Input
                      id="fieldName"
                      value={fieldForm.fieldName}
                      onChange={(e) => setFieldForm(prev => ({ ...prev, fieldName: e.target.value }))}
                      placeholder="e.g., firstName"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fieldLabel">Field Label *</Label>
                    <Input
                      id="fieldLabel"
                      value={fieldForm.fieldLabel}
                      onChange={(e) => setFieldForm(prev => ({ ...prev, fieldLabel: e.target.value }))}
                      placeholder="e.g., First Name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fieldType">Field Type</Label>
                    <Select 
                      value={fieldForm.fieldType} 
                      onValueChange={(value: any) => setFieldForm(prev => ({ ...prev, fieldType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Select 
                      value={fieldForm.section} 
                      onValueChange={(value) => setFieldForm(prev => ({ ...prev, section: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map(section => (
                          <SelectItem key={section.value} value={section.value}>
                            {section.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="placeholder">Placeholder Text</Label>
                  <Input
                    id="placeholder"
                    value={fieldForm.placeholder}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, placeholder: e.target.value }))}
                    placeholder="Enter placeholder text"
                  />
                </div>
                
                <div>
                  <Label htmlFor="helpText">Help Text</Label>
                  <Textarea
                    id="helpText"
                    value={fieldForm.helpText}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, helpText: e.target.value }))}
                    placeholder="Enter help text for users"
                    rows={2}
                  />
                </div>
                
                {fieldForm.fieldType === 'select' && (
                  <div>
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {fieldForm.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addOption}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={fieldForm.isRequired}
                      onCheckedChange={(checked) => setFieldForm(prev => ({ ...prev, isRequired: checked }))}
                    />
                    <Label htmlFor="isRequired">Required Field</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={fieldForm.isVisible}
                      onCheckedChange={(checked) => setFieldForm(prev => ({ ...prev, isVisible: checked }))}
                    />
                    <Label htmlFor="isVisible">Visible</Label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveField}>
                    {editingField ? 'Update Field' : 'Create Field'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
