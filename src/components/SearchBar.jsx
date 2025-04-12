import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, InputBase, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';

const SearchBar = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (match) {
      const [, owner, repo] = match;
      navigate(`/repository/${owner}/${repo}`);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: { xs: '100%', sm: 400, md: 500 },
          borderRadius: '28px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          }
        }}
      >
        <Box sx={{ ml: 2, flex: 1 }}>
          <InputBase
            placeholder="Enter GitHub repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            sx={{ width: '100%' }}
          />
        </Box>
        <IconButton type="submit" sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
      </Paper>
    </motion.div>
  );
};

export default SearchBar;
