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
 * SignupPage 컴포넌트
 *
 * 이메일/비밀번호/비밀번호 확인/닉네임으로 회원가입을 진행한다.
 * 이메일은 Supabase Auth가 가입 시 중복 여부를 검사한다.
 *
 * Example usage:
 * <SignupPage />
 */
function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await signUp({ email, password, nickname });
      if (data.session) {
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (error) {
      if (error.message?.includes('registered')) {
        setErrorMessage('이미 가입된 이메일입니다.');
      } else if (error.code === '23505') {
        setErrorMessage('이미 사용 중인 닉네임입니다.');
      } else {
        setErrorMessage('회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
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
            회원가입
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

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
                slotProps={{ htmlInput: { minLength: 6 } }}
                fullWidth
              />
              <TextField
                label="비밀번호 확인"
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                fullWidth
              />

              <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                회원가입
              </Button>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                이미 계정이 있으신가요?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  로그인
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default SignupPage;
