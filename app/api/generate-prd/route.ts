import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real implementation, we would call OpenAI/Gemini here:
    // const completion = await openai.chat.completions.create({ ... })
    
    const mockPRD = `
# Product Requirements Document
## Overview
Based on your selection of ${Object.keys(body.selectedTech || {}).join(', ')}, this product aims to solve the core problem...

## Features
- Core functionality
- User authentication
    `;

    return NextResponse.json({ prd: mockPRD });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate PRD' }, { status: 500 });
  }
}
