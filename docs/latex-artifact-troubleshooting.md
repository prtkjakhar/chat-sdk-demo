# LaTeX Artifact Troubleshooting Guide

This guide addresses common issues you might encounter when working with the LaTeX artifact in the Vercel AI SDK and provides solutions to fix them.

## Visibility Issues

### Problem: LaTeX content isn't showing up in the small preview window

**Symptoms:**
- LaTeX content appears in the full-screen editor but not in the small preview
- Content is streaming but remains invisible in the message window

**Solutions:**

1. **Check the `isVisible` flag:**
   ```typescript
   onStreamPart: ({ streamPart, setArtifact }) => {
     if (streamPart.type === 'latex-delta') {
       const newContent = streamPart.content as string;

       setArtifact((draftArtifact) => {
         return {
           ...draftArtifact,
           content: newContent,
           // Make sure isVisible is set to true
           isVisible: true,
           status: 'streaming' as const,
         };
       });
     }
   }
   ```

2. **Update the Document Preview Component:**
   Make sure your LaTeX preview component is properly imported and used in the document preview:

   ```typescript
   // components/document-preview.tsx
   import { LatexPreview } from '@/artifacts/latex/client';

   const DocumentContent = ({ document }: { document: Document }) => {
     // ...
     return (
       <div className={containerClassName}>
         {document.kind === 'latex' ? (
           <LatexPreview content={document.content ?? ''} />
         ) : null}
       </div>
     );
   };
   ```

## Rendering Issues

### Problem: LaTeX syntax is not being rendered correctly

**Symptoms:**
- Raw LaTeX code appears instead of formatted math
- Equations don't display properly
- Syntax highlighting is missing

**Solutions:**

1. **Check Your LaTeX Preview Component:**
   If you're not using a proper LaTeX renderer, you'll only see the raw code. Consider using KaTeX or MathJax:

   ```tsx
   import 'katex/dist/katex.min.css';
   import { renderToString } from 'katex';

   export const LatexPreview = ({ content }: { content: string }) => {
     // Basic implementation to render LaTeX math expressions
     try {
       const renderedContent = content.replace(/\$\$(.*?)\$\$/g, (match, latex) => {
         try {
           return renderToString(latex, { displayMode: true });
         } catch (e) {
           console.error('Error rendering LaTeX:', e);
           return match;
         }
       });

       return (
         <div
           className="p-4 overflow-auto max-h-[300px] bg-zinc-800 rounded"
           dangerouslySetInnerHTML={{ __html: renderedContent }}
         />
       );
     } catch (e) {
       return <pre className="p-4 font-mono">{content}</pre>;
     }
   };
   ```

2. **Check Editor Configuration:**
   If you're using CodeMirror, ensure you have the proper language and highlighting extensions:

   ```typescript
   const startState = EditorState.create({
     doc: content,
     extensions: [
       basicSetup,
       markdown(),
       oneDark,
       syntaxHighlighting(latexHighlightStyle)
     ],
   });
   ```

## Streaming Issues

### Problem: LaTeX content is not streaming properly

**Symptoms:**
- Content appears all at once instead of streaming
- Streaming stops prematurely
- Content gets duplicated during streaming

**Solutions:**

1. **Check Stream Handling:**
   Make sure your stream handling logic is correct:

   ```typescript
   onStreamPart: ({ streamPart, setArtifact }) => {
     if (streamPart.type === 'latex-delta') {
       const newContent = streamPart.content as string;

       // Use the appropriate approach - either append or replace
       setArtifact((draftArtifact) => ({
         ...draftArtifact,
         content: newContent, // Replace entire content each time
         isVisible: true,
         status: 'streaming' as const,
       }));
     }
   }
   ```

2. **Examine Server-Side Handler:**
   Make sure your server-side stream handling is correct:

   ```typescript
   for await (const delta of fullStream) {
     if (delta.type === 'object') {
       const { object } = delta;
       const { latex } = object;

       if (latex) {
         // Make sure you're sending the correct data
         dataStream.writeData({
           type: 'latex-delta',
           content: latex,
         });

         draftContent = latex;
       }
     }
   }
   ```

## Type Issues

### Problem: Type errors when implementing LaTeX artifact

**Symptoms:**
- TypeScript errors about missing 'latex' type
- Errors related to artifact type definitions

**Solutions:**

1. **Update Artifact Type Definitions:**
   Add the 'latex' type to your artifact type definitions:

   ```typescript
   // components/artifact.tsx
   export type ArtifactKind = 'text' | 'code' | 'image' | 'sheet' | 'latex';
   ```

2. **Update Document Schema:**
   Make sure your database schema includes the 'latex' kind:

   ```typescript
   // lib/db/schema.ts
   export const documents = createTable('documents', {
     id: text('id').primaryKey(),
     title: text('title'),
     content: text('content'),
     kind: text('kind').$type<'text' | 'code' | 'image' | 'sheet' | 'latex'>(),
     userId: text('user_id'),
     createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
   });
   ```

## Integration Issues

### Problem: LaTeX artifact not registered properly

**Symptoms:**
- LaTeX option doesn't appear in the artifact selection
- Error when trying to create a LaTeX document

**Solutions:**

1. **Check Artifact Registration:**
   Make sure your LaTeX artifact is properly imported and added to the artifact definitions:

   ```typescript
   // components/artifact.tsx
   import { latexArtifact } from '@/artifacts/latex/client';

   export const artifactDefinitions = [
     textArtifact,
     codeArtifact,
     imageArtifact,
     sheetArtifact,
     latexArtifact, // Make sure this is included
   ];
   ```

2. **Check API Route:**
   Make sure your API route includes the LaTeX document handler:

   ```typescript
   // app/api/artifact/route.ts
   import { latexDocumentHandler } from '@/artifacts/latex/server';

   export async function POST(req: Request) {
     const body = await req.json();

     if (body.kind === 'latex') {
       return latexDocumentHandler(body);
     }

     // Other handlers...
   }
   ```

## Performance Issues

### Problem: LaTeX rendering is slow

**Symptoms:**
- Long delay when rendering complex LaTeX
- UI freezes when editing LaTeX documents

**Solutions:**

1. **Use Memoization:**
   Memoize your LaTeX editor component to prevent unnecessary re-renders:

   ```typescript
   const LatexEditor = memo(PureLatexEditor, (prevProps, nextProps) => {
     if (prevProps.content !== nextProps.content) return false;
     if (prevProps.status !== nextProps.status) return false;
     return true;
   });
   ```

2. **Use Web Workers:**
   For complex LaTeX rendering, consider using a web worker:

   ```typescript
   // In your component
   useEffect(() => {
     if (content) {
       const worker = new Worker(new URL('../workers/latex-worker.ts', import.meta.url));

       worker.onmessage = (event) => {
         setRenderedContent(event.data);
       };

       worker.postMessage({ content });

       return () => {
         worker.terminate();
       };
     }
   }, [content]);
   ```

## Debugging Tips

1. **Add Console Logs:**
   Add logs to track the flow of data in your artifact:

   ```typescript
   onStreamPart: ({ streamPart, setArtifact }) => {
     console.log('LaTeX stream part:', streamPart);
     // Handler logic
   }
   ```

2. **Use React DevTools:**
   Use React DevTools to inspect your component state and props during streaming.

3. **Isolate the Issue:**
   Create a minimal reproduction of the issue to pinpoint the cause.

Remember, most LaTeX artifact issues are related to stream handling, visibility management, or type definitions. By addressing these areas, you can resolve most problems with the LaTeX artifact.