import * as React from 'react';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import { useAuth } from '../hooks/useAuth.jsx';

/**
 * LoginPage 컴포넌트
 *
 * 이메일/비밀번호 로그인과 비밀번호 찾기(재설정 메일 발송)를 제공한다.
 *
 * Example usage:
 * <LoginPage />
 */
function LoginPage() {
  const { signIn, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setIsSubmitting(true);
    try {
      await signIn({ email, password });
      navigate('/');
    } catch (error) {
      setErrorMessage('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setErrorMessage('비밀번호 찾기를 위해 이메일을 먼저 입력해주세요.');
      return;
    }
    setErrorMessage('');
    try {
      await resetPassword(email);
      setInfoMessage('입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.');
    } catch (error) {
      setErrorMessage('재설정 메일 발송에 실패했습니다. 이메일을 확인해주세요.');
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          variant="outlined"
          sx={{ p: { xs: 3, md: 5 }, backgroundColor: 'background.paper' }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            로그인
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {infoMessage && <Alert severity="success">{infoMessage}</Alert>}

              <TextField
                label="이메일"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />

              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                로그인
              </Button>

              <Stack direction="row" sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Link component={RouterLink} to="/signup" underline="hover">
                  회원가입
                </Link>
                <Link component="button" type="button" onClick={handleResetPassword} underline="hover">
                  비밀번호 찾기
                </Link>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
