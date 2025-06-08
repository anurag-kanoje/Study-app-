import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export function securityMiddleware(request: NextRequest) {
  // Check for authentication token
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, config.security.jwtSecret);
    request.user = decoded;
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid token' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return null;
}

export function encryptData(data: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(config.security.encryptionKey), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

export function decryptData(encryptedData: string): string {
  const [ivHex, encrypted, authTagHex] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(config.security.encryptionKey), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Extend NextRequest type to include user property
declare module 'next/server' {
  interface NextRequest {
    user?: any;
  }
} 