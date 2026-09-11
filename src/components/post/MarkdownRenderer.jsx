import * as React from 'react';
import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

/**
 * MarkdownRenderer 컴포넌트
 *
 * Markdown 본문을 코드 블록 문법 강조(highlight.js)와 함께 렌더링한다.
 *
 * Props:
 * @param {string} content - Markdown 원문 [Required]
 *
 * Example usage:
 * <MarkdownRenderer content={post.content} />
 */
function MarkdownRenderer({ content }) {
  return (
    <Box
      sx={{
        color: 'text.primary',
        lineHeight: 1.7,
        wordBreak: 'break-word',
        '& p': { my: 1.5 },
        '& h1, & h2, & h3': { mt: 3, mb: 1.5, fontWeight: 700 },
        '& a': { color: 'primary.main' },
        '& img': { maxWidth: '100%', borderRadius: 1 },
        '& pre': {
          p: 2,
          borderRadius: 1,
          overflowX: 'auto',
          backgroundColor: '#0d1117',
        },
        '& code': {
          fontFamily: 'ui-monospace, Consolas, monospace',
          fontSize: '0.9em',
        },
        '& :not(pre) > code': {
          px: 0.6,
          py: 0.2,
          borderRadius: 0.5,
          backgroundColor: 'action.hover',
        },
        '& blockquote': {
          m: 0,
          my: 2,
          pl: 2,
          borderLeft: '3px solid',
          borderColor: 'divider',
          color: 'text.secondary',
        },
        '& table': { borderCollapse: 'collapse', width: '100%' },
        '& th, & td': { border: '1px solid', borderColor: 'divider', p: 1 },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}

export default MarkdownRenderer;
