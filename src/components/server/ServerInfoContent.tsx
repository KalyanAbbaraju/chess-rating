import fs from 'fs';
import path from 'path';
import React from 'react';
import { getMarkdownContent } from '@/lib/markdownUtils';

interface ServerInfoContentProps {
  contentPath: string;
}

const ServerInfoContent: React.FC<ServerInfoContentProps> = async ({ contentPath }) => {
  // Remove the leading slash and get absolute path
  const relativePath = contentPath.startsWith('/') ? contentPath.slice(1) : contentPath;
  const fullPath = path.join(process.cwd(), 'public', relativePath);
  
  let content = '';
  try {
    // Read file on the server
    content = await fs.promises.readFile(fullPath, 'utf8');
  } catch (error) {
    console.error(`Error reading markdown file: ${fullPath}`, error);
    content = '# Content Not Found\n\nThe requested information could not be loaded.';
  }

  return (
    <div className="server-info-content hidden" data-content-path={contentPath}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default ServerInfoContent; 