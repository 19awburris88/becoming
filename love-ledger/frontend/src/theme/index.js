import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1C2B3A',
      light: '#2D3F52',
      dark: '#0F1921',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C4973F',
      light: '#D4A857',
      dark: '#A07830',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F6F1',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280',
    },
    divider: '#E8E3DA',
    success: {
      main: '#2D7A4F',
      light: '#E8F5EE',
    },
    warning: {
      main: '#C4973F',
      light: '#FDF6E8',
    },
    error: {
      main: '#C0392B',
      light: '#FDECEA',
    },
    info: {
      main: '#2980B9',
      light: '#EBF5FB',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", -apple-system, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
    '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    '0 8px 24px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
    '0 12px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
    '0 16px 48px rgba(0,0,0,0.12), 0 6px 16px rgba(0,0,0,0.06)',
    '0 20px 56px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)',
    '0 24px 64px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.08)',
    ...Array(16).fill('0 24px 64px rgba(0,0,0,0.14)'),
  ],
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 20px',
        },
        sizeLarge: {
          padding: '14px 28px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 14px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #E8E3DA',
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#E8E3DA' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
  },
})

export default theme
