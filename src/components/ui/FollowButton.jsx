import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/useAuth.jsx';

/**
 * FollowButton 컴포넌트
 *
 * 다른 사용자에 대한 팔로우/언팔로우 토글 버튼. 비로그인 상태면 로그인 페이지로 이동한다.
 *
 * Props:
 * @param {string} targetUserId - 팔로우 대상 사용자 id [Required]
 * @param {boolean} isInitiallyFollowing - 최초 팔로우 여부 [Required]
 *
 * Example usage:
 * <FollowButton targetUserId={profileUserId} isInitiallyFollowing={false} />
 */
function FollowButton({ targetUserId, isInitiallyFollowing }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    const nextFollowing = !isFollowing;
    setIsFollowing(nextFollowing);

    const query = nextFollowing
      ? supabase
          .from('DV_FOLLOWS')
          .insert({ follower_id: user.id, following_id: targetUserId })
      : supabase
          .from('DV_FOLLOWS')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId);

    const { error } = await query;
    if (error) {
      setIsFollowing(!nextFollowing);
    }
    setIsSubmitting(false);
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isSubmitting}
      variant={isFollowing ? 'outlined' : 'contained'}
      color="primary"
      size="small"
    >
      {isFollowing ? '팔로잉' : '팔로우'}
    </Button>
  );
}

export default FollowButton;
