import Cerebras from '@cerebras/cerebras_cloud_sdk';
import { NextRequest } from 'next/server';

// Initialize at module load time (server start) so the first request has no init lag.
// The env var is always present at runtime; only absent during Next.js static analysis,
// which never reaches API route module code.
const client = new Cerebras();

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { title, description } = body as { title?: string; description?: string };

  if (!title?.trim()) {
    return new Response(JSON.stringify({ error: 'Title is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = await client.chat.completions.create({
          model: 'gpt-oss-120b',
          max_tokens: 150,
          temperature: 0,
          stream: true,
          messages: [
            {
              role: 'system',
              content: 'Return ONLY a JSON array of 4-6 short study steps. No text outside the array.',
            },
            {
              role: 'user',
              content: `Task: ${title.trim()}${description?.trim() ? `. Context: ${description.trim()}` : ''}`,
            },
          ],
        }) as AsyncIterable<{ choices: Array<{ delta: { content?: string | null } }> }>;

        // Parse the streaming JSON array character-by-character and emit each
        // complete step string as soon as its closing quote arrives.
        let inArray = false;
        let inString = false;
        let currentStep = '';
        let escaped = false;
        let stepCount = 0;

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? '';
          for (const char of delta) {
            if (!inArray) {
              if (char === '[') inArray = true;
            } else if (!inString) {
              if (char === '"') {
                inString = true;
                currentStep = '';
                escaped = false;
              }
            } else {
              if (escaped) {
                currentStep += char;
                escaped = false;
              } else if (char === '\\') {
                escaped = true;
              } else if (char === '"') {
                inString = false;
                if (currentStep.length > 0 && stepCount < 8) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ step: currentStep })}\n\n`),
                  );
                  stepCount++;
                }
                currentStep = '';
              } else {
                currentStep += char;
              }
            }
          }
        }

        controller.enqueue(encoder.encode('data: {"done":true}\n\n'));
      } catch (err) {
        console.error('[breakdown]', err);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ error: 'Could not break down the task. Add steps manually.' })}\n\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
