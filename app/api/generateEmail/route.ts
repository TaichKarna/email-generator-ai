import { NextResponse } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

interface EmailRequest {
  recipientName: string;
  emailPurpose: string;
  keyPoints: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { recipientName, emailPurpose, keyPoints }: EmailRequest =
      await request.json();

    if (!recipientName || !emailPurpose || !keyPoints) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const googleApiKey = process.env.GEMINI_API_KEY;

    if (!googleApiKey) {
      return NextResponse.json(
        { error: 'Google API key is missing in environment variables' },
        { status: 400 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-1.5-flash',
      apiKey: googleApiKey,
      maxOutputTokens: 2048,
    });

    const input = [
      [
        'human',
        `Write a complete, professional, and formal email based on these details:
        
        - Recipient: ${recipientName}
        - Purpose: ${emailPurpose}
        - Key Points: ${keyPoints}
        
        The email should include:
        1. A clear and appropriate subject line.
        2. A greeting using the recipient's name.
        3. A structured body addressing the purpose and key points.
        4. A polite closing statement.
        5. Email should atleas be 200 words.
        Return only the email content without placeholders or suggestions.`,
      ],
    ];

    const res = await model.invoke(input[0]);

    const emailContent = res.content;

    if (!emailContent) {
      return NextResponse.json(
        { error: 'No email content generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ email: emailContent });
  } catch (error) {
    console.error('Error generating email:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
