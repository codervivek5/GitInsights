import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        mt: 'auto',
        background: 'rgba(10, 25, 47, 0.7)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            textAlign: 'center',
            background: 'linear-gradient(45deg, #00ffff, #80deea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'monospace',
            letterSpacing: 1,
            fontSize: '0.8rem'
          }}
        >
          GITHUB INSIGHTS {new Date().getFullYear()}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Footer;
