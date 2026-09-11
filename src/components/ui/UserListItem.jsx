import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

/**
 * UserListItem 컴포넌트
 *
 * 팔로잉/팔로워 목록 등에서 사용자 한 명을 아바타+닉네임 행으로 보여준다.
 *
 * Props:
 * @param {string} userId - 사용자 id [Required]
 * @param {string} nickname - 사용자 닉네임 [Required]
 * @param {node} children - 우측에 배치할 추가 요소(예: 팔로우 버튼) [Optional]
 *
 * Example usage:
 * <UserListItem userId={id} nickname="devuser">{followButton}</UserListItem>
 */
function UserListItem({ userId, nickname, children }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>{nickname?.[0] ?? '?'}</Avatar>
        <Link component={RouterLink} to={`/users/${userId}`} underline="hover" sx={{ color: 'text.primary' }}>
          <Typography variant="body1">{nickname}</Typography>
        </Link>
      </Box>
      {children}
    </Box>
  );
}

export default UserListItem;
