import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 400,
            mx: 'auto',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {error.message}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                resetErrorBoundary();
                navigate('/');
              }}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white'
              }}
            >
              Go Home
            </Button>
            <Button
              variant="outlined"
              onClick={resetErrorBoundary}
              sx={{ borderColor: '#2196F3', color: '#2196F3' }}
            >
              Try Again
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ErrorFallback;
