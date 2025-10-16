// Legacy Prisma compatibility layer - now using MySQL directly
// This file maintains compatibility with existing imports

import { dbHelpers } from './mysql'

// Stub for legacy Prisma client - prevents initialization errors
export const prisma = {
  $disconnect: async () => {},
  $connect: async () => {}
}

// Helper function to handle database errors (MySQL compatible)
export function handlePrismaError(error: any) {
  if (error.code === 'ER_DUP_ENTRY') {
    return new Error('A record with this information already exists')
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new Error('Record not found')
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return new Error('Foreign key constraint failed')
  }
  return error
}

// Helper function to generate application ID (using MySQL)
export async function generateApplicationId(year: number = new Date().getFullYear()): Promise<string> {
  return dbHelpers.generateApplicationId()
}

// Helper function to generate student ID (using MySQL)
export async function generateStudentId(year: number = new Date().getFullYear()): Promise<string> {
  return dbHelpers.generateId()
}

// Helper function for compatibility
export async function disconnectPrisma() {
  // No-op for MySQL
}
