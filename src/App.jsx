import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';
import Repository from './pages/Repository';
import ErrorFallback from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff',
    },
    secondary: {
      main: '#80deea',
    },
    background: {
      default: '#0a192f',
      paper: 'rgba(10, 25, 47, 0.7)',
    },
    text: {
      primary: '#e6f1ff',
      secondary: '#8892b0',
    },
  },
  typography: {
    fontFamily: '"Inter", "system-ui", "Avenir", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,255,255,0.2)',
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            borderRadius: 8,
            backgroundColor: '#2b2b2b',
          },
        },
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
          }}
        >
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: { xs: 8, sm: 10 },
              pb: 4,
              px: { xs: 2, sm: 3 },
              mt: 8,
            }}
          >
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/repository/:owner/:repo" element={<Repository />} />
              </Routes>
            </ErrorBoundary>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
