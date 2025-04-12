import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography } from '@mui/material';
import UserInput from '../components/UserInput';

const GetStarted = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h3"
            className="gradient-text"
            align="center"
            sx={{ 
              mb: 4,
              fontWeight: 'bold',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
            }}
          >
            Get Repository Insights
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 6 }}
          >
            Enter a GitHub username to explore their repositories and get detailed insights
          </Typography>
        </motion.div>

        <UserInput />

        {/* Background Animation */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            overflow: 'hidden',
          }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                opacity: 0.1,
              }}
              animate={{
                x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              sx={{
                width: Math.random() * 400 + 200,
                height: Math.random() * 400 + 200,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default GetStarted;
