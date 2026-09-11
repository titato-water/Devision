import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CommentItem from './CommentItem.jsx';

/**
 * CommentList 컴포넌트
 *
 * 댓글 목록을 렌더링한다. 댓글이 없으면 빈 상태 문구를 보여준다.
 *
 * Props:
 * @param {Array} comments - 댓글 배열 [Required]
 * @param {string} currentUserId - 현재 로그인한 사용자 id [Optional]
 * @param {function} onDelete - 댓글 삭제 함수(commentId) [Optional]
 *
 * Example usage:
 * <CommentList comments={comments} currentUserId={user?.id} onDelete={handleDelete} />
 */
function CommentList({ comments, currentUserId, onDelete }) {
  if (comments.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
      </Typography>
    );
  }

  return (
    <Box>
      {comments.map((comment) => (
        <CommentItem
          key={comment.comment_id}
          comment={comment}
          isOwner={comment.user_id === currentUserId}
          onDelete={() => onDelete(comment.comment_id)}
        />
      ))}
    </Box>
  );
}

export default CommentList;
