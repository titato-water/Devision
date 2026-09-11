import * as React from 'react';
import { Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../../hooks/useAuth.jsx';

/**
 * ProtectedRoute 컴포넌트
 *
 * 로그인한 사용자만 하위 라우트에 접근할 수 있도록 제한한다.
 * 비로그인 상태면 /login으로 리다이렉트한다.
 *
 * Props:
 * @param {node} children - 보호할 라우트 요소 [Required]
 *
 * Example usage:
 * <ProtectedRoute><PostWritePage /></ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
