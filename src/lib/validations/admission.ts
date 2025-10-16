import { z } from "zod"

export const admissionFormSchema = z.object({
  // Student Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine((date) => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime()) && parsedDate < new Date()
  }, "Please enter a valid date of birth"),
  gender: z.string().min(1, "Gender is required"),
  bloodGroup: z.string(),
  nationality: z.string().min(1, "Nationality is required"),
  religion: z.string(),
  category: z.string().min(1, "Category is required"),
  
  // Contact Information
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  alternateMobile: z.string(),
  currentAddress: z.string().min(10, "Current address must be at least 10 characters"),
  permanentAddress: z.string().min(10, "Permanent address must be at least 10 characters"),
  sameAsCurrentAddress: z.boolean(),
  
  // Parent/Guardian Information
  fatherName: z.string().min(2, "Father's name is required"),
  fatherOccupation: z.string().min(2, "Father's occupation is required"),
  fatherMobile: z.string().min(10, "Father's mobile number is required"),
  fatherEmail: z.string().email("Invalid father's email address"),
  motherName: z.string().min(2, "Mother's name is required"),
  motherOccupation: z.string().min(2, "Mother's occupation is required"),
  motherMobile: z.string().min(10, "Mother's mobile number is required"),
  motherEmail: z.string().email("Invalid mother's email address"),
  guardianName: z.string(),
  guardianContact: z.string(),
  
  // Academic Information
  previousSchool: z.string().min(2, "Previous school name is required"),
  previousClass: z.string().min(1, "Previous class is required"),
  board: z.string().min(1, "Board is required"),
  applyingForGrade: z.string().min(1, "Applying for grade is required"),
  previousPercentage: z.string(),
  
  // Additional Information
  specialNeeds: z.string(),
  interests: z.array(z.string()),
  hearAboutUs: z.string(),
  
  // Declaration
  declaration: z.boolean().refine((val) => val === true, {
    message: "You must accept the declaration",
  }),
})

export type AdmissionFormData = z.infer<typeof admissionFormSchema>
