import { NextResponse } from 'next/server';

export async function POST() {
  // In a production app, you would invalidate the session/token here
  // For now, we'll just return success - the client will clear localStorage
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}
