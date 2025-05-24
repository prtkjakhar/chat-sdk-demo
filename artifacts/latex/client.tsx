import { Artifact } from '@/components/create-artifact';
import {
  CopyIcon,
  MessageIcon,
  RedoIcon,
  UndoIcon,
} from '@/components/icons';
import { toast } from 'sonner';
import { EditorView } from '@codemirror/view';
import { EditorState, Transaction } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup } from 'codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import React, { memo, useEffect, useRef } from 'react';
import { Suggestion } from '@/lib/db/schema';
import { DocumentSkeleton } from '@/components/document-skeleton';
import { DiffView } from '@/components/diffview';
import type { ArtifactKind } from '@/components/artifact';

// Custom highlighting for LaTeX syntax
const latexHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, color: '#a6e22e' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
  // LaTeX commands (based on markdown syntax)
  { tag: tags.processingInstruction, color: '#66d9ef' },
  { tag: tags.keyword, color: '#f92672' },
  { tag: tags.atom, color: '#ae81ff' },
  { tag: tags.number, color: '#ae81ff' },
  { tag: tags.string, color: '#e6db74' },
  { tag: tags.comment, color: '#75715e' },
  // Math expressions
  { tag: tags.variableName, color: '#fd971f' },
  { tag: tags.operator, color: '#f92672' },
]);

type EditorProps = {
  content: string;
  onSaveContent: (updatedContent: string, debounce: boolean) => void;
  status: 'streaming' | 'idle';
  isCurrentVersion: boolean;
  currentVersionIndex: number;
  suggestions: Array<Suggestion>;
};

const PureLatexEditor = ({ content, onSaveContent, status }: EditorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const startState = EditorState.create({
        doc: content,
        extensions: [
          basicSetup,
          markdown(),
          oneDark,
          syntaxHighlighting(latexHighlightStyle)
        ],
      });

      editorRef.current = new EditorView({
        state: startState,
        parent: containerRef.current,
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
    // NOTE: we only want to run this effect once
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const transaction = update.transactions.find(
            (tr) => !tr.annotation(Transaction.remote),
          );

          if (transaction) {
            const newContent = update.state.doc.toString();
            onSaveContent(newContent, true);
          }
        }
      });

      const currentSelection = editorRef.current.state.selection;

      const newState = EditorState.create({
        doc: editorRef.current.state.doc,
        extensions: [
          basicSetup,
          markdown(),
          oneDark,
          syntaxHighlighting(latexHighlightStyle),
          updateListener
        ],
        selection: currentSelection,
      });

      editorRef.current.setState(newState);
    }
  }, [onSaveContent]);

  useEffect(() => {
    if (editorRef.current && content) {
      const currentContent = editorRef.current.state.doc.toString();

      if (status === 'streaming' || currentContent !== content) {
        const transaction = editorRef.current.state.update({
          changes: {
            from: 0,
            to: currentContent.length,
            insert: content,
          },
          annotations: [Transaction.remote.of(true)],
        });

        editorRef.current.dispatch(transaction);
      }
    }
  }, [content, status]);

  return (
    <div
      className="relative not-prose w-full pb-[calc(80dvh)] text-sm"
      ref={containerRef}
    />
  );
};

function areEqual(prevProps: EditorProps, nextProps: EditorProps) {
  if (prevProps.suggestions !== nextProps.suggestions) return false;
  if (prevProps.currentVersionIndex !== nextProps.currentVersionIndex)
    return false;
  if (prevProps.isCurrentVersion !== nextProps.isCurrentVersion) return false;
  if (prevProps.status === 'streaming' && nextProps.status === 'streaming')
    return false;
  if (prevProps.content !== nextProps.content) return false;

  return true;
}

const LatexEditor = memo(PureLatexEditor, areEqual);

interface LatexArtifactMetadata {
  suggestions: Array<Suggestion>;
}

// For displaying LaTeX content in small windows
export const LatexPreview = ({ content }: { content: string }) => {
  return (
    <div className="p-4 font-mono text-sm overflow-auto max-h-[300px] bg-zinc-800 rounded">
      <pre>{content}</pre>
    </div>
  );
};

export const latexArtifact = new Artifact<'latex', LatexArtifactMetadata>({
  kind: 'latex',
  description: 'Useful for LaTeX documents with mathematical equations and formatting.',
  initialize: async ({ setMetadata }) => {
    setMetadata({
      suggestions: [],
    });
  },
  onStreamPart: ({ streamPart, setArtifact }) => {
    if (streamPart.type === 'latex-delta') {
      const newContent = streamPart.content as string;

      setArtifact((draftArtifact) => {
        // Always make the artifact visible during streaming
        return {
          ...draftArtifact,
          content: newContent,
          // Set isVisible to true consistently during streaming
          isVisible: true,
          status: 'streaming' as const,
        };
      });
    }
  },
  content: function Content({
    mode,
    status,
    content,
    isCurrentVersion,
    currentVersionIndex,
    onSaveContent,
    getDocumentContentById,
    isLoading,
    metadata,
  }) {
    if (isLoading) {
      return <DocumentSkeleton artifactKind="latex" />;
    }

    if (mode === 'diff') {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);

      return <DiffView oldContent={oldContent} newContent={newContent} />;
    }

    return (
      <div className="px-1">
        <div className="w-full">
          <LatexEditor
            content={content}
            suggestions={metadata ? metadata.suggestions : []}
            isCurrentVersion={isCurrentVersion}
            currentVersionIndex={currentVersionIndex}
            status={status}
            onSaveContent={onSaveContent}
          />
        </div>
      </div>
    );
  },
  actions: [
    {
      icon: <UndoIcon size={18} />,
      description: 'View Previous version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('prev');
      },
      isDisabled: ({ currentVersionIndex }) => {
        if (currentVersionIndex === 0) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <RedoIcon size={18} />,
      description: 'View Next version',
      onClick: ({ handleVersionChange }) => {
        handleVersionChange('next');
      },
      isDisabled: ({ isCurrentVersion }) => {
        if (isCurrentVersion) {
          return true;
        }

        return false;
      },
    },
    {
      icon: <CopyIcon size={18} />,
      description: 'Copy to clipboard',
      onClick: ({ content }) => {
        navigator.clipboard.writeText(content);
        toast.success('Copied to clipboard!');
      },
    },
  ],
  toolbar: [
    {
      icon: <MessageIcon />,
      description: 'Request suggestions',
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: 'user',
          content:
            'Please suggest improvements to my LaTeX document.',
        });
      },
    },
  ],
});