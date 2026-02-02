import { NextRequest } from 'next/server';
import { z } from 'zod';

// Input validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  ),
  phone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
});

export const orderSchema = z.object({
  customerName: z.string().min(1, 'Name is required').max(100),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().regex(/^[0-9+\-\s()]+$/, 'Invalid phone number'),
  customerAddress: z.string().max(500),
  deliveryMethod: z.enum(['delivery', 'pickup', 'instore']),
  paymentMethod: z.enum(['cash', 'visa', 'click']),
  orderItems: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })),
  total: z.number().min(0),
});

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript:
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Check for SQL injection patterns
export function containsSQLInjection(input: string): boolean {
  const patterns = [
    /(\bUNION\b.*\bSELECT\b)/gi,
    /(\bSELECT\b.*\bFROM\b)/gi,
    /(\bINSERT\b.*\bINTO\b)/gi,
    /(\bUPDATE\b.*\bSET\b)/gi,
    /(\bDELETE\b.*\bFROM\b)/gi,
    /(\bDROP\b.*\bTABLE\b)/gi,
    /(--|#|\/\*|\*\/)/g,
  ];
  
  return patterns.some(pattern => pattern.test(input));
}

// Validate and sanitize email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number; // 0-4 (0=weak, 4=very strong)
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  return { score, feedback };
}

