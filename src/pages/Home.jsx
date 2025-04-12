import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import { GitHub, Analytics, Timeline, People } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: 'Repository Analytics',
      description: 'Get comprehensive insights about stars, forks, and issues'
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: 'PR Tracking',
      description: 'Track pull requests and their status over time'
    },
    {
      icon: <People sx={{ fontSize: 40, color: '#00ffff' }} />,
      title: 'Contributor Analysis',
      description: 'Understand contribution patterns and team dynamics'
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <GitHub sx={{ fontSize: 80, mb: 3, color: '#00ffff' }} />
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h1"
            className="gradient-text"
            sx={{
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 2,
              color: '#e6f1ff',
              textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
              letterSpacing: '2px'
            }}
          >
            GitHub Repository Insights
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: 'text.secondary',
              maxWidth: '800px'
            }}
          >
            Discover deep insights and analytics for any GitHub repository
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/get-started')}
            sx={{
              borderRadius: '28px',
              padding: '12px 32px',
              fontSize: '1.2rem',
              background: 'rgba(0, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              color: '#00ffff',
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(0, 255, 255, 0.2)',
                borderColor: '#00ffff',
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              },
            }}
          >
            Get Started
          </Button>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ width: '100%', marginTop: '4rem' }}
        >
          <Grid container spacing={4} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  whileHover={{ y: -10 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      background: 'rgba(10, 25, 47, 0.7)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#00ffff',
                        boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)',
                        transform: 'translateY(-5px)'
                      },
                    }}
                  >
                    {feature.icon}
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mt: 2, 
                        mb: 1,
                        color: '#00ffff',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Background Animation */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden',
          }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                background: 'linear-gradient(45deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0))',
                borderRadius: '50%',
                filter: 'blur(40px)',
                opacity: 0.2,
              }}
              animate={{
                x: [Math.random() * 200, Math.random() * -200],
                y: [Math.random() * 200, Math.random() * -200],
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
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

export default Home;
