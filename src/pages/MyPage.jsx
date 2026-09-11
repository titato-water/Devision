import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';
import PostCard from '../components/ui/PostCard.jsx';

/**
 * MyPage 컴포넌트
 *
 * 프로필 카드와 내가 작성한 게시글 목록을 보여준다.
 *
 * Example usage:
 * <MyPage />
 */
function MyPage() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadMyPosts() {
      const { data } = await supabase
        .from('DV_POSTS')
        .select(
          'post_id, title, category, like_count, comment_count, created_at, DV_USERS(nickname), DV_POST_TAGS(DV_TAGS(name))',
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setPosts(
        (data ?? []).map((row) => ({
          post_id: row.post_id,
          title: row.title,
          category: row.category,
          like_count: row.like_count,
          comment_count: row.comment_count,
          created_at: row.created_at,
          authorNickname: row.DV_USERS?.nickname ?? profile?.nickname,
          tags: (row.DV_POST_TAGS ?? []).map((postTag) => postTag.DV_TAGS?.name).filter(Boolean),
        })),
      );
      setIsLoading(false);
    }

    loadMyPosts();
  }, [user, profile?.nickname]);

  return (
    <Box sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            {profile?.nickname?.[0] ?? '?'}
          </Avatar>
          <Box>
            <Typography variant="h6">{profile?.nickname}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {profile?.email}
            </Typography>
          </Box>
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          내가 쓴 글
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={24} />
          </Box>
        ) : posts.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 4 }}>
            아직 작성한 게시글이 없습니다.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard key={post.post_id} post={post} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default MyPage;
