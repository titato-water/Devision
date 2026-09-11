import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import FollowButton from '../components/ui/FollowButton.jsx';

/**
 * UserProfilePage 컴포넌트
 *
 * 다른 사용자의 공개 프로필. 닉네임, 팔로워/팔로잉 수, 팔로우 버튼, 작성 글 목록을 보여준다.
 *
 * Example usage:
 * <UserProfilePage />
 */
function UserProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);

      const [{ data: profileRow }, followerRes, followingRes, postsRes] = await Promise.all([
        supabase.from('DV_USERS').select('user_id, nickname, email').eq('user_id', id).maybeSingle(),
        supabase
          .from('DV_FOLLOWS')
          .select('follower_id', { count: 'exact', head: true })
          .eq('following_id', id),
        supabase
          .from('DV_FOLLOWS')
          .select('following_id', { count: 'exact', head: true })
          .eq('follower_id', id),
        supabase.rpc('dv_search_posts', { p_user_id: id, p_limit: 20, p_offset: 0 }),
      ]);

      setProfile(profileRow ?? undefined);
      setFollowerCount(followerRes.count ?? 0);
      setFollowingCount(followingRes.count ?? 0);
      setPosts(postsRes.data ?? []);

      if (currentUser) {
        const { data: followRow } = await supabase
          .from('DV_FOLLOWS')
          .select('follower_id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', id)
          .maybeSingle();
        setIsFollowing(Boolean(followRow));
      }

      setIsLoading(false);
    }

    loadProfile();
  }, [id, currentUser]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">사용자를 찾을 수 없습니다.</Typography>
      </Container>
    );
  }

  const isSelf = currentUser?.id === id;

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
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            rowGap: 2,
            backgroundColor: 'background.paper',
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              {profile.nickname?.[0] ?? '?'}
            </Avatar>
            <Box>
              <Typography variant="h6">{profile.nickname}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                팔로워 {followerCount} · 팔로잉 {followingCount}
              </Typography>
            </Box>
          </Stack>
          {!isSelf && <FollowButton targetUserId={id} isInitiallyFollowing={isFollowing} />}
        </Paper>

        <Typography variant="h6" sx={{ mb: 2 }}>
          작성한 글
        </Typography>

        {posts.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 4 }}>
            아직 작성한 게시글이 없습니다.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard
                key={post.post_id}
                post={{
                  post_id: post.post_id,
                  title: post.title,
                  category: post.category,
                  like_count: post.like_count,
                  comment_count: post.comment_count,
                  created_at: post.created_at,
                  authorNickname: post.author_nickname,
                  authorId: post.user_id,
                  tags: post.tags ?? [],
                }}
              />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default UserProfilePage;
