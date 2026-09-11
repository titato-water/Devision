import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';
import PostCard from '../components/ui/PostCard.jsx';
import UserListItem from '../components/ui/UserListItem.jsx';
import FollowButton from '../components/ui/FollowButton.jsx';

function mapPost(row) {
  return {
    post_id: row.post_id,
    title: row.title,
    category: row.category,
    like_count: row.like_count,
    comment_count: row.comment_count,
    created_at: row.created_at,
    authorNickname: row.author_nickname,
    authorId: row.user_id,
    tags: row.tags ?? [],
  };
}

/**
 * MyPage 컴포넌트
 *
 * 프로필 카드와 내가 작성한 게시글 / 팔로잉 / 팔로워 목록을 탭으로 보여준다.
 *
 * Example usage:
 * <MyPage />
 */
function MyPage() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadAll() {
      setIsLoading(true);
      const [postsRes, followingRes, followersRes] = await Promise.all([
        supabase.rpc('dv_search_posts', { p_user_id: user.id, p_limit: 50, p_offset: 0 }),
        supabase
          .from('DV_FOLLOWS')
          .select('following_id, DV_USERS!DV_FOLLOWS_following_id_fkey(nickname)')
          .eq('follower_id', user.id),
        supabase
          .from('DV_FOLLOWS')
          .select('follower_id, DV_USERS!DV_FOLLOWS_follower_id_fkey(nickname)')
          .eq('following_id', user.id),
      ]);

      setPosts((postsRes.data ?? []).map(mapPost));
      setFollowing(
        (followingRes.data ?? []).map((row) => ({
          userId: row.following_id,
          nickname: row.DV_USERS?.nickname ?? '알 수 없음',
        })),
      );
      setFollowers(
        (followersRes.data ?? []).map((row) => ({
          userId: row.follower_id,
          nickname: row.DV_USERS?.nickname ?? '알 수 없음',
        })),
      );
      setIsLoading(false);
    }

    loadAll();
  }, [user]);

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

        <Tabs value={tab} onChange={(_e, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab value="posts" label={`내가 쓴 글 (${posts.length})`} />
          <Tab value="following" label={`팔로잉 (${following.length})`} />
          <Tab value="followers" label={`팔로워 (${followers.length})`} />
        </Tabs>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={24} />
          </Box>
        ) : tab === 'posts' ? (
          posts.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', py: 4 }}>
              아직 작성한 게시글이 없습니다.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {posts.map((post) => (
                <PostCard key={post.post_id} post={post} />
              ))}
            </Stack>
          )
        ) : tab === 'following' ? (
          following.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary', py: 4 }}>
              아직 팔로우한 사람이 없습니다.
            </Typography>
          ) : (
            <Box>
              {following.map((item) => (
                <UserListItem key={item.userId} userId={item.userId} nickname={item.nickname}>
                  <FollowButton targetUserId={item.userId} isInitiallyFollowing />
                </UserListItem>
              ))}
            </Box>
          )
        ) : followers.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 4 }}>
            아직 팔로워가 없습니다.
          </Typography>
        ) : (
          <Box>
            {followers.map((item) => (
              <UserListItem key={item.userId} userId={item.userId} nickname={item.nickname} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default MyPage;
