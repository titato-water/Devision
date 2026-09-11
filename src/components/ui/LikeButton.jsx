import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/useAuth.jsx';

/**
 * LikeButton 컴포넌트
 *
 * 게시글 좋아요 토글 버튼. 중복 클릭을 막고, 비로그인 상태면 로그인 페이지로 이동한다.
 *
 * Props:
 * @param {number} postId - 대상 게시글 번호 [Required]
 * @param {boolean} isInitiallyLiked - 최초 좋아요 여부 [Required]
 * @param {number} initialLikeCount - 최초 좋아요 수 [Required]
 *
 * Example usage:
 * <LikeButton postId={1} isInitiallyLiked={false} initialLikeCount={3} />
 */
function LikeButton({ postId, isInitiallyLiked, initialLikeCount }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((prev) => prev + (nextLiked ? 1 : -1));

    const query = nextLiked
      ? supabase.from('DV_POST_LIKES').insert({ user_id: user.id, post_id: postId })
      : supabase
          .from('DV_POST_LIKES')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);

    const { error } = await query;
    if (error) {
      setLiked(!nextLiked);
      setCount((prev) => prev + (nextLiked ? -1 : 1));
    }
    setIsSubmitting(false);
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isSubmitting}
      variant={liked ? 'contained' : 'outlined'}
      color="primary"
      startIcon={liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    >
      좋아요 {count}
    </Button>
  );
}

export default LikeButton;
