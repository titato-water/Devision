import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';
import PostCard from '../components/ui/PostCard.jsx';

const PAGE_SIZE = 10;

function mapPost(row) {
  return {
    post_id: row.post_id,
    title: row.title,
    category: row.category,
    like_count: row.like_count,
    comment_count: row.comment_count,
    created_at: row.created_at,
    authorNickname: row.DV_USERS?.nickname ?? '알 수 없음',
    tags: (row.DV_POST_TAGS ?? []).map((postTag) => postTag.DV_TAGS?.name).filter(Boolean),
  };
}

/**
 * PostListPage 컴포넌트
 *
 * 홈 화면. 최신 게시글을 무한 스크롤로 불러와 카드 목록으로 보여준다.
 *
 * Example usage:
 * <PostListPage />
 */
function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef(null);

  const loadNextPage = useCallback(async () => {
    setIsLoading(true);
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('DV_POSTS')
      .select(
        'post_id, title, category, like_count, comment_count, created_at, DV_USERS(nickname), DV_POST_TAGS(DV_TAGS(name))',
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      setPosts((prev) => [...prev, ...data.map(mapPost)]);
      setHasMore(data.length === PAGE_SIZE);
      setPage((prev) => prev + 1);
    }
    setIsLoading(false);
  }, [page]);

  useEffect(() => {
    loadNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasMore) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    const node = sentinelRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasMore, isLoading, loadNextPage]);

  return (
    <Box sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          최신 게시글
        </Typography>

        {posts.length === 0 && !isLoading ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 6, textAlign: 'center' }}>
            아직 게시글이 없습니다. 첫 글을 작성해보세요.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard key={post.post_id} post={post} />
            ))}
          </Stack>
        )}

        <Box ref={sentinelRef} sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          {isLoading && <CircularProgress size={24} />}
        </Box>
      </Container>
    </Box>
  );
}

export default PostListPage;
