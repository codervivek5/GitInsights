import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: 'rgba(10, 25, 47, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 2
            }}
          >
            <IconButton
              sx={{
                color: '#00ffff',
                p: 0,
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                transition: 'transform 0.2s'
              }}
            >
              <GitHubIcon sx={{ fontSize: 32 }} />
            </IconButton>
            {!isHome && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    background: 'linear-gradient(45deg, #00ffff, #80deea)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  GitHub Insights
                </Typography>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
