import { z } from 'zod';
import { streamObject } from 'ai';
import { myProvider } from '@/lib/ai/providers';
import { createDocumentHandler } from '@/lib/artifacts/server';
import { updateDocumentPrompt } from '@/lib/ai/prompts';

export const latexDocumentHandler = createDocumentHandler<'latex'>({
  kind: 'latex',
  onCreateDocument: async ({ title, dataStream }) => {
    let draftContent = '';

    const { fullStream } = streamObject({
      model: myProvider.languageModel('latex-model'),
      system: `Create a complete and well-structured LaTeX document based on the given title or description.
Include proper LaTeX syntax with all necessary preamble commands.
Your document should:
1. Start with a proper document class and preamble
2. Include appropriate packages for mathematical notation
3. Use proper LaTeX environments for theorems, proofs, equations, etc.
4. Include sample content that demonstrates the capabilities of LaTeX
5. Format mathematical equations correctly using $ and $$ notation for inline and display math
6. Be well-commented to explain the purpose of different LaTeX commands

Ensure the document compiles correctly and follows LaTeX best practices.`,
      prompt: title,
      schema: z.object({
        latex: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'object') {
        const { object } = delta;
        const { latex } = object;

        if (latex) {
          dataStream.writeData({
            type: 'latex-delta',
            content: latex ?? '',
          });

          draftContent = latex;
        }
      }
    }

    return draftContent;
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    let draftContent = '';

    const { fullStream } = streamObject({
      model: myProvider.languageModel('latex-model'),
      system: updateDocumentPrompt(document.content, 'latex'),
      prompt: description,
      schema: z.object({
        latex: z.string(),
      }),
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'object') {
        const { object } = delta;
        const { latex } = object;

        if (latex) {
          dataStream.writeData({
            type: 'latex-delta',
            content: latex ?? '',
          });

          draftContent = latex;
        }
      }
    }

    return draftContent;
  },
});