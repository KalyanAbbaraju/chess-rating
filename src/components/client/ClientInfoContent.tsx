'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface ClientInfoContentProps {
  contentPath: string;
}

const ClientInfoContent: React.FC<ClientInfoContentProps> = ({ contentPath }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Get content from server-rendered hidden div
    const serverContent = document.querySelector(`[data-content-path="${contentPath}"] div`);
    if (serverContent && serverContent.innerHTML) {
      setContent(serverContent.innerHTML);
      setLoading(false);
    } else {
      // Fallback to fetch if server content not available
      fetch(contentPath)
        .then(response => response.text())
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error loading content:', error);
          setContent('# Error Loading Content\n\nUnable to load the requested information.');
          setLoading(false);
        });
    }
  }, [contentPath]);

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-md"></div>;
  }

  return (
    <div className="markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default ClientInfoContent; 