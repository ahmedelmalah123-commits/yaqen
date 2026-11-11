import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAmmBarakaFallback } from '../src/lib/ammBarakaFallback';

const generateContentMock = vi.hoisted(() => vi.fn());

vi.mock('@google/genai', () => {
  class GoogleGenAI {
    models = {
      generateContent: generateContentMock,
    };
  }
  return {
    GoogleGenAI,
    ThinkingLevel: {
      THINKING_LEVEL_UNSPECIFIED: 'THINKING_LEVEL_UNSPECIFIED',
      MINIMAL: 'MINIMAL',
      LOW: 'LOW',
      MEDIUM: 'MEDIUM',
      HIGH: 'HIGH',
    },
  };
});

import handler, { sanitizeChatHistory } from '../api/chat.js';

function createMockRes() {
  const res: Record<string, any> = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k: string, v: string) {
      this.headers[k] = v;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(data: unknown) {
      this.body = data;
      return this;
    },
  };
  return res;
}

describe('/api/chat serverless handler & history sanitization', () => {
  const originalKey = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
    generateContentMock.mockReset();
  });

  afterEach(() => {
    if (originalKey !== undefined) process.env.GEMINI_API_KEY = originalKey;
    else delete process.env.GEMINI_API_KEY;
  });

  it('rejects non-POST HTTP methods with 405', async () => {
    const req = { method: 'GET', headers: {}, body: {} };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it('returns HTTP 400 cleanly for malformed JSON strings and non-object payloads', async () => {
    const brokenStringRes = createMockRes();
    await handler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '127.0.0.21' },
        body: '{bad json',
      },
      brokenStringRes
    );
    expect(brokenStringRes.statusCode).toBe(400);

    const lazySyntaxErrorReq = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.22' },
      get body() {
        throw new SyntaxError('Unexpected token in JSON');
      },
    };
    const lazyRes = createMockRes();
    await handler(lazySyntaxErrorReq, lazyRes);
    expect(lazyRes.statusCode).toBe(400);

    const arrayRes = createMockRes();
    await handler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '127.0.0.23' },
        body: ['unexpected'],
      },
      arrayRes
    );
    expect(arrayRes.statusCode).toBe(400);
  });

  it('returns 503 fallback signal when GEMINI_API_KEY is unset', async () => {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '127.0.0.10' },
      body: { message: 'السلام عليكم' },
    };
    const res = createMockRes();
    await handler(req, res);
    expect(res.statusCode).toBe(503);
    expect(res.body.fallbackRequired).toBe(true);
  });

  it('validates empty and oversized messages cleanly', async () => {
    process.env.GEMINI_API_KEY = 'dummy-key';
    const emptyRes = createMockRes();
    await handler(
      { method: 'POST', headers: { 'x-forwarded-for': '127.0.0.11' }, body: { message: '   ' } },
      emptyRes
    );
    expect(emptyRes.statusCode).toBe(400);

    const longRes = createMockRes();
    await handler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '127.0.0.12' },
        body: { message: 'أ'.repeat(2100) },
      },
      longRes
    );
    expect(longRes.statusCode).toBe(400);
  });

  it('passes SDK-compatible thinkingConfig and maxOutputTokens cleanly and returns 200 text', async () => {
    process.env.GEMINI_API_KEY = 'dummy-key';
    generateContentMock.mockResolvedValueOnce({ text: 'بارك الله فيك يا ولدي.' });

    const res = createMockRes();
    await handler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '127.0.0.30' },
        body: { message: 'ما فضل قراءة سورة الكهف؟', history: [] },
      },
      res
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.text).toBe('بارك الله فيك يا ولدي.');
    expect(generateContentMock).toHaveBeenCalledTimes(1);
    const callArg = generateContentMock.mock.calls[0][0];
    expect(callArg.model).toBe('gemini-3.8-flash');
    expect(callArg.config.maxOutputTokens).toBe(1800);
    expect(callArg.config.thinkingConfig).toEqual({ thinkingLevel: 'LOW' });
  });

  it('sanitizes leading model turns and merges repeated roles cleanly', () => {
    const cleaned = sanitizeChatHistory([
      { role: 'model', parts: [{ text: 'ترحيب مبدئي' }] },
      { role: 'user', parts: [{ text: 'السؤال الأول' }] },
      { role: 'user', parts: [{ text: 'إضافة لنفس السؤال' }] },
      { role: 'model', parts: [{ text: 'جواب الشيخ' }] },
    ]);
    expect(cleaned).toHaveLength(2);
    expect(cleaned[0].role).toBe('user');
    expect(cleaned[0].parts[0].text).toContain('إضافة');
    expect(cleaned[1].role).toBe('model');
  });

  it('uses clean updated fallback messaging without stale API-key text', () => {
    for (let i = 0; i < 12; i++) {
      const reply = getAmmBarakaFallback('سؤال عام غير مصنف ' + i);
      expect(reply).not.toContain('Gemini API');
    }
  });
});
