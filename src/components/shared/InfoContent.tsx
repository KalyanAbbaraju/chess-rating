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
    img: ({ ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <div className="my-4">
        <Image
          src={props.src || ''}
          alt={props.alt || 'Image'}
          width={600}
          height={400}
          className="rounded-md shadow-md max-w-full h-auto"
        />
      </div>
    ),
    h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className="text-xl font-bold mt-4 mb-4 text-gray-900" {...props} />
    ),
    h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h2 className="text-lg font-semibold mt-6 mb-2 text-gray-800" {...props} />
    ),
    h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className="text-md font-semibold mt-4 mb-2 text-gray-700" {...props} />
    ),
    p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
      <p className="mb-4 text-gray-600" {...props} />
    ),
    ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className="list-disc pl-5 mb-4 text-gray-600" {...props} />
    ),
    ol: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ol className="list-decimal pl-5 mb-4 text-gray-600" {...props} />
    ),
    li: ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className="mb-1" {...props} />
    ),
    table: ({ ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md" {...props} />
      </div>
    ),
    thead: ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-gray-50" {...props} />
    ),
    tbody: ({ ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className="divide-y divide-gray-200" {...props} />
    ),
    th: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
    ),
    td: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td className="px-3 py-2 text-sm text-gray-500" {...props} />
    ),
    code: ({ inline, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => 
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