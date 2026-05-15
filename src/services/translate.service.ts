import { env } from '../config/env';
import { ApiError } from '../utils/api-error';

const LOCALE_NAMES: Record<string, string> = {
  AR: 'Arabic',
  EN: 'English',
  RU: 'Russian',
  IT: 'Italian',
};

export interface TranslateInput {
  text: string;
  from: 'AR' | 'EN' | 'RU' | 'IT';
  to: Array<'AR' | 'EN' | 'RU' | 'IT'>;
  context?: string;
}

export interface TranslateResult {
  translations: Record<string, string>;
}

async function translateWithGemini(input: TranslateInput): Promise<TranslateResult> {
  if (!env.GEMINI_API_KEY) throw ApiError.badRequest('GEMINI_API_KEY not configured');
  const targetLocales = input.to.filter((t) => t !== input.from);
  if (targetLocales.length === 0) {
    return { translations: { [input.from]: input.text } };
  }

  const prompt = `You are a professional tourism copywriter and translator. Translate the following text from ${LOCALE_NAMES[input.from]} into ${targetLocales.map((t) => LOCALE_NAMES[t]).join(', ')}.
Context: ${input.context || 'Egyptian tourism trip content for Lotus Sharm tourism company'}.
Rules:
- Keep the same meaning and tone (warm, professional, tourism marketing).
- Preserve any HTML tags if present.
- Do NOT add any commentary, only return JSON.

Return EXACTLY this JSON shape and nothing else:
{${targetLocales.map((t) => `"${t}": "...translated text..."`).join(',')}}

Source text:
"""${input.text}"""`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, responseMimeType: 'application/json' },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw ApiError.internal(`Gemini API error: ${resp.status} ${errText}`);
  }

  const data = (await resp.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  let parsed: Record<string, string>;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw ApiError.internal('Failed to parse translation response');
  }

  const result: Record<string, string> = { [input.from]: input.text };
  for (const t of targetLocales) {
    if (parsed[t]) result[t] = parsed[t];
  }
  return { translations: result };
}

export async function translate(input: TranslateInput): Promise<TranslateResult> {
  if (env.TRANSLATE_PROVIDER === 'none') {
    throw ApiError.badRequest('Translation provider disabled');
  }
  // Default to Gemini (only one wired today)
  return translateWithGemini(input);
}
