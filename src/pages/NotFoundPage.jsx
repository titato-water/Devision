import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

/**
 * NotFoundPage 컴포넌트
 *
 * 존재하지 않는 경로에 접근했을 때 표시하는 404 화면.
 *
 * Example usage:
 * <NotFoundPage />
 */
function NotFoundPage() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          404
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
          요청하신 페이지를 찾을 수 없습니다.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          홈으로 돌아가기
        </Button>
      </Container>
    </Box>
  );
}

export default NotFoundPage;
