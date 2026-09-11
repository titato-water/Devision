import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { formatDate } from '../../utils/formatDate.js';

/**
 * CommentItem 컴포넌트
 *
 * 댓글 한 건을 표시한다. 작성자 본인이면 삭제 버튼을 노출한다.
 *
 * Props:
 * @param {object} comment - 댓글 정보(content, created_at, authorNickname) [Required]
 * @param {boolean} isOwner - 현재 사용자가 작성자인지 여부 [Optional, 기본값: false]
 * @param {function} onDelete - 삭제 버튼 클릭 시 호출되는 함수 [Optional]
 *
 * Example usage:
 * <CommentItem comment={comment} isOwner onDelete={handleDelete} />
 */
function CommentItem({ comment, isOwner = false, onDelete }) {
  return (
    <Box
      sx={{
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
          {comment.authorNickname} · {formatDate(comment.created_at)}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </Typography>
      </Box>
      {isOwner && (
        <IconButton size="small" onClick={onDelete} aria-label="댓글 삭제">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

export default CommentItem;
