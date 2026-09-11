import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { formatDate } from '../../utils/formatDate.js';

/**
 * PostCard 컴포넌트
 *
 * 게시글 목록에서 카드 형태로 요약 정보를 보여준다. 카드 클릭 시 상세로 이동하며,
 * 작성자 닉네임과 태그는 각각 프로필/태그 필터로 이동한다.
 *
 * Props:
 * @param {object} post - 게시글 정보(post_id, title, category, like_count, comment_count, created_at, authorNickname, authorId, tags) [Required]
 *
 * Example usage:
 * <PostCard post={post} />
 */
function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      onClick={() => navigate(`/posts/${post.post_id}`)}
      sx={{
        backgroundColor: 'background.paper',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': { borderColor: 'primary.main' },
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', rowGap: 1 }}>
          <Chip label={post.category} size="small" color="primary" variant="outlined" />
          {post.tags?.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              component={RouterLink}
              to={`/?tag=${encodeURIComponent(tag)}`}
              onClick={(e) => e.stopPropagation()}
              clickable
            />
          ))}
        </Stack>

        <Typography
          variant="h6"
          sx={{ fontSize: { xs: '1.05rem', md: '1.2rem' }, mb: 1 }}
        >
          {post.title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {post.authorId ? (
              <Link
                component={RouterLink}
                to={`/users/${post.authorId}`}
                onClick={(e) => e.stopPropagation()}
                underline="hover"
                sx={{ color: 'text.secondary' }}
              >
                {post.authorNickname}
              </Link>
            ) : (
              post.authorNickname
            )}{' '}
            · {formatDate(post.created_at)}
          </Typography>

          <Stack direction="row" spacing={2}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <FavoriteBorderIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {post.like_count}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {post.comment_count}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PostCard;
