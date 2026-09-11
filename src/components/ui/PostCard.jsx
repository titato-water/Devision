import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import { formatDate } from '../../utils/formatDate.js';

/**
 * PostCard 컴포넌트
 *
 * 게시글 목록에서 카드 형태로 요약 정보를 보여준다.
 *
 * Props:
 * @param {object} post - 게시글 정보(post_id, title, category, like_count, comment_count, created_at, authorNickname, tags) [Required]
 *
 * Example usage:
 * <PostCard post={post} />
 */
function PostCard({ post }) {
  return (
    <Card
      variant="outlined"
      sx={{ backgroundColor: 'background.paper', borderColor: 'divider' }}
    >
      <CardActionArea component={RouterLink} to={`/posts/${post.post_id}`}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', rowGap: 1 }}>
            <Chip label={post.category} size="small" color="primary" variant="outlined" />
            {post.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
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
              {post.authorNickname} · {formatDate(post.created_at)}
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
      </CardActionArea>
    </Card>
  );
}

export default PostCard;
