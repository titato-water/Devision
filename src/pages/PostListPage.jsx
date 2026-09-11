import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';
import PostCard from '../components/ui/PostCard.jsx';

const PAGE_SIZE = 10;
const CATEGORIES = ['코드 리뷰', 'JS 문제풀이', '잡담'];

function mapPost(row) {
  return {
    post_id: row.post_id,
    title: row.title,
    category: row.category,
    like_count: row.like_count,
    comment_count: row.comment_count,
    created_at: row.created_at,
    authorNickname: row.author_nickname ?? '알 수 없음',
    authorId: row.user_id,
    tags: row.tags ?? [],
  };
}

/**
 * PostListPage 컴포넌트
 *
 * 홈 화면. 최신/팔로잉 피드 탭, 카테고리·태그 필터, 검색을 지원하는 무한 스크롤 목록.
 *
 * Example usage:
 * <PostListPage />
 */
function PostListPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const feed = searchParams.get('feed') === 'following' ? 'following' : 'all';
  const category = searchParams.get('category') ?? '';
  const tag = searchParams.get('tag') ?? '';
  const q = searchParams.get('q') ?? '';

  const [searchInput, setSearchInput] = useState(q);
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef(null);

  const loadPage = useCallback(
    async (currentOffset) => {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('dv_search_posts', {
        p_search: q || null,
        p_category: category || null,
        p_tag: tag || null,
        p_feed: feed,
        p_follower_id: feed === 'following' ? (user?.id ?? null) : null,
        p_user_id: null,
        p_limit: PAGE_SIZE,
        p_offset: currentOffset,
      });

      if (!error && data) {
        setPosts((prev) => (currentOffset === 0 ? data.map(mapPost) : [...prev, ...data.map(mapPost)]));
        setHasMore(data.length === PAGE_SIZE);
        setOffset(currentOffset + data.length);
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    },
    [q, category, tag, feed, user?.id],
  );

  useEffect(() => {
    setPosts([]);
    setOffset(0);
    setHasMore(true);
    loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, tag, feed, user?.id]);

  useEffect(() => {
    if (!hasMore) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadPage(offset);
        }
      },
      { rootMargin: '200px' },
    );
    const node = sentinelRef.current;
    if (node) observer.observe(node);
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [hasMore, isLoading, offset, loadPage]);

  function handleFeedChange(_event, newFeed) {
    const next = new URLSearchParams(searchParams);
    if (newFeed === 'following') {
      next.set('feed', 'following');
    } else {
      next.delete('feed');
    }
    setSearchParams(next);
  }

  function handleCategoryChange(_event, newCategory) {
    const next = new URLSearchParams(searchParams);
    if (newCategory) {
      next.set('category', newCategory);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      next.set('q', searchInput.trim());
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  }

  function handleClearTag() {
    const next = new URLSearchParams(searchParams);
    next.delete('tag');
    setSearchParams(next);
  }

  return (
    <Box sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{ display: 'flex', gap: 1, mb: 3 }}
        >
          <TextField
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제목, 본문, 작성자, 태그로 검색"
            size="small"
            fullWidth
          />
          <IconButton type="submit" aria-label="검색">
            <SearchIcon />
          </IconButton>
        </Box>

        <Tabs value={feed} onChange={handleFeedChange} sx={{ mb: 1 }}>
          <Tab value="all" label="최신" />
          <Tab value="following" label="팔로잉" disabled={!user} />
        </Tabs>

        <Tabs
          value={category}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab value="" label="전체" />
          {CATEGORIES.map((c) => (
            <Tab key={c} value={c} label={c} />
          ))}
        </Tabs>

        {tag && (
          <Box sx={{ mb: 2 }}>
            <Chip label={`태그: ${tag}`} onDelete={handleClearTag} color="primary" variant="outlined" />
          </Box>
        )}

        {feed === 'following' && !user ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 6, textAlign: 'center' }}>
            팔로잉 피드는 로그인 후 이용할 수 있습니다.
          </Typography>
        ) : posts.length === 0 && !isLoading ? (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 6, textAlign: 'center' }}>
            {q || category || tag
              ? '조건에 맞는 게시글이 없습니다.'
              : feed === 'following'
                ? '팔로우한 사람의 게시글이 없습니다.'
                : '아직 게시글이 없습니다. 첫 글을 작성해보세요.'}
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
