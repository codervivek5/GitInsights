import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Skeleton,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const UserInput = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Please enter a GitHub username');
      return;
    }

    setLoading(true);
    setError('');
    setRepositories([]);
    try {
      // First, get user info
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      
      // Then get all repositories sorted by stars
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`);
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const data = await reposResponse.json();
      if (data.length === 0) {
        setError('No repositories found');
      } else {
        setRepositories(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, minHeight: '80vh' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            background: 'rgba(10, 25, 47, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <GitHubIcon sx={{ fontSize: 60, color: '#00ffff', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e6f1ff' }}>
              Enter GitHub Username
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', gap: 2 }}
          >
            <TextField
              fullWidth
              variant="outlined"
              label="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
              helperText={error}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)'
                  },
                  '&:hover fieldset': {
                    borderColor: '#00ffff'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00ffff'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <GitHubIcon sx={{ color: '#00ffff' }} />
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                px: 4,
                background: 'linear-gradient(45deg, #00ffff 30%, #80deea 90%)',
                color: '#0a192f',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(45deg, #80deea 30%, #00ffff 90%)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#0a192f' }} /> : 'Search'}
            </Button>
          </Box>
        </Paper>

        {loading && (
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {[...Array(3)].map((_, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: [20, 0, 0, 20]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                >
                  <Paper
                    sx={{
                      p: 3,
                      background: 'rgba(10, 25, 47, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      height: '100%'
                    }}
                  >
                    <Skeleton
                      variant="text"
                      sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)' }}
                      width="60%"
                      height={32}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)', mt: 2 }}
                      width="100%"
                    />
                    <Skeleton
                      variant="text"
                      sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)', mt: 1 }}
                      width="80%"
                    />
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                      <Skeleton
                        variant="text"
                        sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)' }}
                        width={60}
                      />
                      <Skeleton
                        variant="text"
                        sx={{ bgcolor: 'rgba(0, 255, 255, 0.1)' }}
                        width={60}
                      />
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && repositories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Search Repositories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#00ffff' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#00ffff'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00ffff'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)'
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#00ffff'
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff'
                  }
                }}
              />
            </Box>
            <Grid container spacing={3}>
              {filteredRepos.map((repo, index) => (
                <Grid item xs={12} md={4} key={repo.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        background: 'rgba(10, 25, 47, 0.7)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          borderColor: '#00ffff',
                        },
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#00ffff',
                            fontWeight: 'bold',
                            mb: 1
                          }}
                        >
                          {repo.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {repo.description || 'No description available'}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          mt: 'auto',
                          pt: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon
                              sx={{
                                fontSize: 16,
                                mr: 0.5,
                                color: '#00ffff'
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: '#fff' }}
                            >
                              {repo.stargazers_count}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountTreeIcon
                              sx={{
                                fontSize: 16,
                                mr: 0.5,
                                color: '#00ffff'
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: '#fff' }}
                            >
                              {repo.forks_count}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          size="small"
                          onClick={() => navigate(`/repository/${username}/${repo.name}`)}
                          startIcon={<VisibilityIcon />}
                          sx={{
                            color: '#00ffff',
                            '&:hover': {
                              background: 'rgba(0, 255, 255, 0.1)'
                            }
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}
      </motion.div>
    </Box>
  );
};

export default UserInput;
