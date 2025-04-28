import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:5001/api';

export async function GET(
  request: NextRequest,
  { params } : { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    console.log(`Checking status for ID: ${id}`);

    const backendUrl = `${API_URL}/seo/status/${id}`;
    console.log(`Forwarding to backend: ${backendUrl}`);
    
    const backendResponse = await fetch(backendUrl);
    
    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`);
    }
    
    const responseData = await backendResponse.json();
    console.log("Backend response:", responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error(`Error in /api/seo/status/${id} route:`, error);
    
    const errorDetails = error instanceof Error 
      ? {
          message: error.message,
          cause: error.cause && typeof error.cause === 'string' ? error.cause : undefined,
          stack: error.stack
        }
      : String(error);

    return NextResponse.json(
      { 
        error: 'Failed to connect to API server', 
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}