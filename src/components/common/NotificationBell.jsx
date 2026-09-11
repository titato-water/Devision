import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import { supabase } from '../../lib/supabase.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import { formatDate } from '../../utils/formatDate.js';

const MESSAGES = {
  LIKE_POST: (nickname) => `${nickname}님이 회원님의 게시글을 좋아합니다.`,
  COMMENT: (nickname) => `${nickname}님이 게시글에 댓글을 남겼습니다.`,
  REPLY: (nickname) => `${nickname}님이 답글을 남겼습니다.`,
  FOLLOW: (nickname) => `${nickname}님이 회원님을 팔로우합니다.`,
};

function targetPath(notification) {
  return notification.type === 'FOLLOW'
    ? `/users/${notification.target_id}`
    : `/posts/${notification.target_id}`;
}

/**
 * NotificationBell 컴포넌트
 *
 * 헤더의 알림 아이콘. 읽지 않은 알림 수를 배지로 보여주고, 클릭 시 최근 알림 목록을 드롭다운으로 표시한다.
 *
 * Example usage:
 * <NotificationBell />
 */
function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadUnreadCount() {
    if (!user) return;
    const { count } = await supabase
      .from('DV_NOTIFICATIONS')
      .select('notification_id', { count: 'exact', head: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);
    setUnreadCount(count ?? 0);
  }

  useEffect(() => {
    loadUnreadCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  async function handleOpen(event) {
    setAnchorEl(event.currentTarget);
    const { data } = await supabase
      .from('DV_NOTIFICATIONS')
      .select('notification_id, type, target_id, is_read, created_at, DV_USERS!DV_NOTIFICATIONS_sender_id_fkey(nickname)')
      .eq('receiver_id', user.id)
      .order('created_at', { ascending: false })
      .limit(15);

    setNotifications(
      (data ?? []).map((row) => ({
        ...row,
        senderNickname: row.DV_USERS?.nickname ?? '알 수 없음',
      })),
    );
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleItemClick(notification) {
    handleClose();
    if (!notification.is_read) {
      await supabase
        .from('DV_NOTIFICATIONS')
        .update({ is_read: true })
        .eq('notification_id', notification.notification_id);
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
    navigate(targetPath(notification));
  }

  if (!user) return null;

  return (
    <>
      <IconButton onClick={handleOpen} color="inherit" aria-label="알림">
        <Badge badgeContent={unreadCount} color="primary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem disabled>알림이 없습니다.</MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.notification_id}
              onClick={() => handleItemClick(notification)}
              sx={{
                whiteSpace: 'normal',
                maxWidth: 320,
                opacity: notification.is_read ? 0.6 : 1,
              }}
            >
              <Box>
                <Typography variant="body2">
                  {MESSAGES[notification.type]?.(notification.senderNickname) ?? '새 알림'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatDate(notification.created_at)}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}

export default NotificationBell;
