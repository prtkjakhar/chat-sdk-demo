'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { latexArtifact } from '@/artifacts/latex/client';

export default function LatexArtifactDemo() {
  const [prompt, setPrompt] = useState('');
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  const generateLatexExample = () => {
    const examplePrompts = [
      "Create a LaTeX document with an equation for the quadratic formula",
      "Write a LaTeX document with Maxwell's equations in differential form",
      "Generate a LaTeX document with Einstein's field equations",
      "Create a LaTeX document for a university homework template with matrix operations",
      "Generate a LaTeX document with the Navier-Stokes equations"
    ];

    const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">LaTeX Artifact Demo</h1>

      <div className="mb-6">
        <p className="mb-2">This demo shows how to use the custom LaTeX artifact to generate mathematical documents.</p>
        <button
          onClick={generateLatexExample}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate Example Prompt
        </button>
      </div>

      <div className="border p-4 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-2">Ask for a LaTeX Document</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
          setPrompt('');
        }}>
          <textarea
            value={input || prompt}
            onChange={handleInputChange}
            placeholder="Ask the AI to create a LaTeX document..."
            className="w-full border rounded p-2 min-h-[100px] mb-2"
            onClick={() => {
              if (prompt && !input) {
                handleInputChange({ target: { value: prompt } } as any);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || (!input && !prompt)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate LaTeX'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`p-4 rounded-lg ${
            message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <p className="font-semibold">{message.role === 'user' ? 'You' : 'AI'}</p>
            <div className="mt-1">
              {message.role === 'assistant' && message.content.includes('\\begin{document}') ? (
                <div>
                  <p>LaTeX document generated! You can view it in the artifact window.</p>
                  <pre className="bg-gray-800 text-white p-2 rounded mt-2 overflow-x-auto">
                    {message.content.substring(0, 200)}...
                  </pre>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-yellow-50">
        <h2 className="text-lg font-semibold mb-2">How It Works</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>The custom LaTeX artifact is defined in <code>artifacts/latex/client.tsx</code></li>
          <li>Server-side generation happens in <code>artifacts/latex/server.ts</code></li>
          <li>The artifact is registered in <code>components/artifact.tsx</code></li>
          <li>When LaTeX content is detected, its rendered in a specialized editor</li>
          <li>We use CodeMirror with syntax highlighting for the editor UI</li>
        </ol>
      </div>
    </div>
  );
}