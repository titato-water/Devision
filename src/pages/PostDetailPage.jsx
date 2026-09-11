import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { formatDate } from '../utils/formatDate.js';
import MarkdownRenderer from '../components/post/MarkdownRenderer.jsx';
import LikeButton from '../components/ui/LikeButton.jsx';
import CommentList from '../components/comment/CommentList.jsx';
import CommentForm from '../components/comment/CommentForm.jsx';

/**
 * PostDetailPage 컴포넌트
 *
 * 게시글 상세 화면. 본문(코드 하이라이팅), 좋아요, 댓글 목록/작성을 제공한다.
 *
 * Example usage:
 * <PostDetailPage />
 */
function PostDetailPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommenting, setIsCommenting] = useState(false);

  const loadPost = useCallback(async () => {
    setIsLoading(true);
    const { data: postRow } = await supabase
      .from('DV_POSTS')
      .select(
        'post_id, user_id, title, content, category, like_count, comment_count, created_at, DV_USERS(nickname), DV_POST_TAGS(DV_TAGS(name))',
      )
      .eq('post_id', id)
      .maybeSingle();

    if (postRow) {
      setPost({
        ...postRow,
        authorNickname: postRow.DV_USERS?.nickname ?? '알 수 없음',
        tags: (postRow.DV_POST_TAGS ?? []).map((postTag) => postTag.DV_TAGS?.name).filter(Boolean),
      });
    } else {
      setPost(undefined);
    }

    const { data: commentRows } = await supabase
      .from('DV_COMMENTS')
      .select('comment_id, user_id, content, created_at, DV_USERS(nickname)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    setComments(
      (commentRows ?? []).map((row) => ({
        ...row,
        authorNickname: row.DV_USERS?.nickname ?? '알 수 없음',
      })),
    );

    if (user) {
      const { data: likeRow } = await supabase
        .from('DV_POST_LIKES')
        .select('post_id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      setIsLiked(Boolean(likeRow));
    }

    setIsLoading(false);
  }, [id, user]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  async function handleDeletePost() {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;
    await supabase.from('DV_POSTS').delete().eq('post_id', id);
    navigate('/');
  }

  async function handleAddComment(content) {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsCommenting(true);
    const { data, error } = await supabase
      .from('DV_COMMENTS')
      .insert({ post_id: Number(id), user_id: user.id, content })
      .select('comment_id, user_id, content, created_at')
      .single();
    if (!error && data) {
      setComments((prev) => [
        ...prev,
        { ...data, authorNickname: profile?.nickname ?? '나' },
      ]);
    }
    setIsCommenting(false);
  }

  async function handleDeleteComment(commentId) {
    await supabase.from('DV_COMMENTS').delete().eq('comment_id', commentId);
    setComments((prev) => prev.filter((c) => c.comment_id !== commentId));
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (post === undefined) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">게시글을 찾을 수 없습니다.</Typography>
        <Button component={RouterLink} to="/" sx={{ mt: 2 }}>
          홈으로 돌아가기
        </Button>
      </Container>
    );
  }

  const isOwner = user?.id === post.user_id;

  return (
    <Box sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
          <Chip label={post.category} size="small" color="primary" variant="outlined" />
          {post.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" variant="outlined" />
          ))}
        </Stack>

        <Typography variant="h4" sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 700, mb: 2 }}>
          {post.title}
        </Typography>

        <Stack
          direction="row"
          sx={{
            mb: 3,
            flexWrap: 'wrap',
            rowGap: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {post.authorNickname} · {formatDate(post.created_at)}
          </Typography>
          {isOwner && (
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to={`/posts/${id}/edit`} size="small">
                수정
              </Button>
              <Button onClick={handleDeletePost} size="small" color="error">
                삭제
              </Button>
            </Stack>
          )}
        </Stack>

        <MarkdownRenderer content={post.content} />

        <Box sx={{ my: 4 }}>
          <LikeButton postId={post.post_id} isInitiallyLiked={isLiked} initialLikeCount={post.like_count} />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          댓글 {comments.length}
        </Typography>
        <CommentList comments={comments} currentUserId={user?.id} onDelete={handleDeleteComment} />
        <Box sx={{ mt: 2 }}>
          <CommentForm onSubmit={handleAddComment} isSubmitting={isCommenting} />
        </Box>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
