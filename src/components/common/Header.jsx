import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useAuth } from '../../hooks/useAuth.jsx';

/**
 * Header 컴포넌트
 *
 * 상단 고정 내비게이션 바. 로고, 글쓰기 버튼, 로그인 상태별 메뉴를 표시한다.
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 }, gap: 2 }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 700,
          }}
        >
          Devision
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Button component={RouterLink} to="/posts/new" variant="contained" size="small">
              글쓰기
            </Button>
            <Button component={RouterLink} to="/mypage" color="inherit" size="small">
              {profile?.nickname ?? '마이페이지'}
            </Button>
            <Button onClick={handleLogout} color="inherit" size="small">
              로그아웃
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button component={RouterLink} to="/login" color="inherit" size="small">
              로그인
            </Button>
            <Button component={RouterLink} to="/signup" variant="contained" size="small">
              회원가입
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
