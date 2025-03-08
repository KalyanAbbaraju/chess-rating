import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Image from 'next/image';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

interface InfoContentProps {
  contentPath: string;
}

const InfoContent: React.FC<InfoContentProps> = ({ contentPath }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarkdownContent() {
      try {
        const response = await fetch(contentPath);
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    }

    fetchMarkdownContent();
  }, [contentPath]);

  // Custom components for ReactMarkdown
  const components = {
    img: ({ node, ...props }) => (
      <div className="my-4">
        <Image
          src={props.src || ''}
          alt={props.alt || ''}
          width={600}
          height={400}
          className="rounded-md border border-gray-200"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        {props.alt && <p className="text-xs text-gray-500 mt-1">{props.alt}</p>}
      </div>
    ),
    // Custom styling for other elements
    h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-4 text-gray-900" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-md font-semibold mt-4 mb-2 text-gray-700" {...props} />,
    p: ({ node, ...props }) => <p className="mb-4 text-gray-600" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 text-gray-600" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 text-gray-600" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
    tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200" {...props} />,
    th: ({ node, ...props }) => <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
    td: ({ node, ...props }) => <td className="px-3 py-2 text-sm text-gray-500" {...props} />,
    code: ({ node, inline, ...props }) => 
      inline ? 
        <code className="px-1 py-0.5 bg-gray-100 rounded text-sm text-red-600" {...props} /> : 
        <pre className="p-3 bg-gray-50 rounded-md overflow-auto text-sm font-mono border border-gray-200" {...props} />
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading information...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="prose max-w-none text-sm">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default InfoContent; 