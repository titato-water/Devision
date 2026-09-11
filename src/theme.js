import { createTheme } from '@mui/material/styles';

/**
 * Devision 다크 테마
 * 차분한 프론트엔드 코딩 커뮤니티 분위기(velog 참고)를 위한 다크 팔레트.
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#58a6ff',
      light: '#8ec2ff',
      dark: '#2f6fca',
      contrastText: '#0d1117',
    },
    secondary: {
      main: '#7ee2b8',
      contrastText: '#0d1117',
    },
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#8b949e',
      disabled: '#5b6472',
    },
    divider: 'rgba(230, 237, 243, 0.12)',
    error: {
      main: '#f87171',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
  spacing: 8,
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
