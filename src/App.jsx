import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { AuthProvider } from './hooks/useAuth.jsx';
import Header from './components/common/Header.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import PostListPage from './pages/PostListPage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import PostWritePage from './pages/PostWritePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import MyPage from './pages/MyPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.default',
          }}
        >
          <Header />
          <Routes>
            <Route path="/" element={<PostListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/users/:id" element={<UserProfilePage />} />
            <Route
              path="/posts/new"
              element={
                <ProtectedRoute>
                  <PostWritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <PostWritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <MyPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
