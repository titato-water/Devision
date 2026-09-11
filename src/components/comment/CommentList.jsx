import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CommentItem from './CommentItem.jsx';

/**
 * CommentList 컴포넌트
 *
 * 댓글 목록을 최상위 댓글 + 대댓글(1단계) 트리로 렌더링한다. 댓글이 없으면 빈 상태 문구를 보여준다.
 *
 * Props:
 * @param {Array} comments - 댓글 배열(parent_comment_id 포함) [Required]
 * @param {string} currentUserId - 현재 로그인한 사용자 id [Optional]
 * @param {function} onDelete - 댓글 삭제 함수(commentId) [Optional]
 * @param {function} onReply - 답글 등록 함수(parentCommentId, content) [Optional]
 *
 * Example usage:
 * <CommentList comments={comments} currentUserId={user?.id} onDelete={handleDelete} onReply={handleReply} />
 */
function CommentList({ comments, currentUserId, onDelete, onReply }) {
  if (comments.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary', py: 3 }}>
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
      </Typography>
    );
  }

  const topLevelComments = comments.filter((c) => !c.parent_comment_id);

  return (
    <Box>
      {topLevelComments.map((comment) => (
        <CommentItem
          key={comment.comment_id}
          comment={comment}
          replies={comments.filter((c) => c.parent_comment_id === comment.comment_id)}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onReply={onReply}
        />
      ))}
    </Box>
  );
}

export default CommentList;
