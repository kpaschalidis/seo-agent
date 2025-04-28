import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://127.0.0.1:5001/api';

export async function GET() {
  try {
    console.log("Received health check request");
    
    const backendUrl = `${API_URL}/seo/health`;
    console.log(`Forwarding to backend: ${backendUrl}`);
    
    const backendResponse = await fetch(backendUrl);
    
    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`);
    }
    
    const responseData = await backendResponse.json();
    console.log("Backend health response:", responseData);
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error in health check route:", error);
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