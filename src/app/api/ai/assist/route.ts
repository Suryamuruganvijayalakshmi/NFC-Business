import { NextRequest, NextResponse } from 'next/server';

export type AIAssistMode =
  | 'profile_headline'
  | 'profile_about'
  | 'post_draft'
  | 'follow_up_draft'
  | 'discovery_reason';

/**
 * POST /api/ai/assist
 * Server-side AI drafting assistant. Never exposes API keys to the browser
 * and never auto-publishes or auto-sends without explicit user action.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, context } = body as { mode?: AIAssistMode; context?: Record<string, unknown> };

    if (!mode || !context) {
      return NextResponse.json(
        { success: false, error: 'Missing mode or context payload.' },
        { status: 400 }
      );
    }

    const geminiKey = process.env.GEMINI_API_KEY || '';
    const openAiKey = process.env.OPENAI_API_KEY || '';

    if (!geminiKey && !openAiKey) {
      return NextResponse.json(
        {
          success: false,
          configured: false,
          error:
            'AI Assistant requires GEMINI_API_KEY or OPENAI_API_KEY configured on the server. No fake output was generated.',
        },
        { status: 503 }
      );
    }

    const safeInput = JSON.stringify(context).slice(0, 2000);
    const systemPrompt =
      'You are the SignTap Professional Assistant. Produce concise, authentic, non-fabricated professional text based strictly on the provided user context. Never invent credentials, metrics, or personal facts.';
    const userPrompt = `Task: ${mode}\nContext: ${safeInput}\nReturn plain text ready for the user to review and edit before saving or sending.`;

    if (geminiKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
          }),
        }
      );

      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: 'Upstream Gemini API request failed.' },
          { status: 502 }
        );
      }

      const data = await res.json();
      const suggestion = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      return NextResponse.json({ success: true, configured: true, suggestion });
    }

    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 300,
      }),
    });

    if (!openAiRes.ok) {
      return NextResponse.json(
        { success: false, error: 'Upstream OpenAI API request failed.' },
        { status: 502 }
      );
    }

    const openAiData = await openAiRes.json();
    const suggestion = openAiData?.choices?.[0]?.message?.content?.trim() || '';
    return NextResponse.json({ success: true, configured: true, suggestion });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI assist failure';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
