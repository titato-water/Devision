import * as React from 'react';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { formatDate } from '../../utils/formatDate.js';
import CommentForm from './CommentForm.jsx';

function CommentBody({ comment, currentUserId, onDelete }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
          <Link
            component={RouterLink}
            to={`/users/${comment.user_id}`}
            underline="hover"
            sx={{ color: 'text.secondary' }}
          >
            {comment.authorNickname}
          </Link>{' '}
          · {formatDate(comment.created_at)}
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </Typography>
      </Box>
      {comment.user_id === currentUserId && (
        <IconButton size="small" onClick={() => onDelete(comment.comment_id)} aria-label="댓글 삭제">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
}

/**
 * CommentItem 컴포넌트
 *
 * 댓글 한 건과 그에 달린 대댓글 목록을 표시한다. 작성자 본인이면 삭제 버튼을,
 * 최상위 댓글이면 답글 작성 버튼을 노출한다.
 *
 * Props:
 * @param {object} comment - 댓글 정보(comment_id, content, created_at, authorNickname, user_id) [Required]
 * @param {Array} replies - 이 댓글에 달린 대댓글 배열 [Optional, 기본값: []]
 * @param {string} currentUserId - 현재 로그인한 사용자 id [Optional]
 * @param {function} onDelete - 삭제 함수(commentId) [Optional]
 * @param {function} onReply - 답글 등록 함수(parentCommentId, content) [Optional]
 *
 * Example usage:
 * <CommentItem comment={comment} replies={replies} currentUserId={user?.id} onDelete={onDelete} onReply={onReply} />
 */
function CommentItem({ comment, replies = [], currentUserId, onDelete, onReply }) {
  const [isReplying, setIsReplying] = useState(false);

  async function handleReplySubmit(content) {
    await onReply(comment.comment_id, content);
    setIsReplying(false);
  }

  return (
    <Box sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
      <CommentBody comment={comment} currentUserId={currentUserId} onDelete={onDelete} />
      {onReply && (
        <Button size="small" onClick={() => setIsReplying((prev) => !prev)} sx={{ mt: 0.5, ml: -1 }}>
          답글
        </Button>
      )}

      {isReplying && (
        <Box sx={{ mt: 1.5, ml: { xs: 0, md: 3 } }}>
          <CommentForm onSubmit={handleReplySubmit} />
        </Box>
      )}

      {replies.length > 0 && (
        <Box sx={{ mt: 1.5, ml: { xs: 2, md: 4 }, borderLeft: '2px solid', borderColor: 'divider', pl: 2 }}>
          {replies.map((reply) => (
            <Box key={reply.comment_id} sx={{ py: 1.5 }}>
              <CommentBody comment={reply} currentUserId={currentUserId} onDelete={onDelete} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CommentItem;
