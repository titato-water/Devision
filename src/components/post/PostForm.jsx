import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import MarkdownRenderer from './MarkdownRenderer.jsx';

const CATEGORIES = ['코드 리뷰', 'JS 문제풀이', '잡담'];

/**
 * PostForm 컴포넌트
 *
 * 게시글 작성/수정 공용 폼. 제목, 카테고리, 태그, Markdown 본문(실시간 미리보기)을 입력받는다.
 *
 * Props:
 * @param {object} initialValues - 초기값(title, category, tags, content) [Optional, 기본값: 빈 값]
 * @param {function} onSubmit - 등록/수정 시 호출되는 함수({ title, category, tags, content }) [Required]
 * @param {string} submitLabel - 제출 버튼 문구 [Optional, 기본값: '등록']
 * @param {boolean} isSubmitting - 제출 중 여부 [Optional, 기본값: false]
 * @param {string} errorMessage - 표시할 에러 메시지 [Optional]
 *
 * Example usage:
 * <PostForm onSubmit={handleCreate} submitLabel="등록" />
 */
function PostForm({
  initialValues = {},
  onSubmit,
  submitLabel = '등록',
  isSubmitting = false,
  errorMessage = '',
}) {
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [category, setCategory] = useState(initialValues.category ?? CATEGORIES[0]);
  const [tags, setTags] = useState(initialValues.tags ?? []);
  const [content, setContent] = useState(initialValues.content ?? '');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({ title, category, tags, content });
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TextField
          label="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          select
          label="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          sx={{ maxWidth: { xs: '100%', md: 240 } }}
        >
          {CATEGORIES.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={tags}
          onChange={(_event, newValue) => setTags(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="태그 (Enter로 추가, 예: React, CSS)" />
          )}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              본문 (Markdown)
            </Typography>
            <TextField
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              multiline
              minRows={16}
              fullWidth
              placeholder={'예시)\n## 제목\n\n```js\nconst a = 1;\n```'}
              slotProps={{ input: { sx: { fontFamily: 'ui-monospace, Consolas, monospace' } } }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
              미리보기
            </Typography>
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                p: 2,
                minHeight: 300,
                backgroundColor: 'background.paper',
              }}
            >
              <MarkdownRenderer content={content || '_내용을 입력하면 미리보기가 표시됩니다._'} />
            </Box>
          </Box>
        </Box>

        <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ alignSelf: 'flex-start' }}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}

export default PostForm;
