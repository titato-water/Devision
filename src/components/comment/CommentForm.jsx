import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/**
 * CommentForm 컴포넌트
 *
 * 댓글 작성 입력창과 등록 버튼.
 *
 * Props:
 * @param {function} onSubmit - 댓글 등록 시 호출되는 함수(content: string) [Required]
 * @param {boolean} isSubmitting - 제출 중 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <CommentForm onSubmit={handleAddComment} />
 */
function CommentForm({ onSubmit, isSubmitting = false }) {
  const [content, setContent] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        fullWidth
        multiline
        minRows={2}
      />
      <Button type="submit" variant="contained" disabled={isSubmitting || !content.trim()}>
        등록
      </Button>
    </Box>
  );
}

export default CommentForm;
