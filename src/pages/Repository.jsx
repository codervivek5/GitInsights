import React, { useState, useEffect, useRef } from 'react';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import CollaborationMetrics from '../components/CollaborationMetrics';
import { motion } from 'framer-motion';
import { Box, Container, Grid, Paper, Typography, CircularProgress, Avatar, Chip, LinearProgress, IconButton, Tooltip } from '@mui/material';
import { useParams } from 'react-router-dom';
import { GitHub, Star, AccountTree, BugReport, People, Merge, Code, Language, Schedule, CalendarMonth, Download, Share, Analytics, Group } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Repository = () => {
  const { owner, repo } = useParams();
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [repoData, setRepoData] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [pullRequests, setPullRequests] = useState({ open: 0, closed: 0 });
  const [commits, setCommits] = useState([]);
  const [languages, setLanguages] = useState({});
  const [error, setError] = useState(null);
  const [exportLoading, setExportLoading] = useState(false);

  const exportAsPNG = async () => {
    setExportLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0a192f',
      });
      const link = document.createElement('a');
      link.download = `${owner}-${repo}-report.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Error exporting as PNG:', err);
    }
    setExportLoading(false);
  };

  const exportAsPDF = async () => {
    setExportLoading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0a192f',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${owner}-${repo}-report.pdf`);
    } catch (err) {
      console.error('Error exporting as PDF:', err);
    }
    setExportLoading(false);
  };

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const [repoResponse, contributorsResponse, prsResponse, commitsResponse, languagesResponse] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repo}`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/commits`),
          fetch(`https://api.github.com/repos/${owner}/${repo}/languages`)
        ]);

        if (!repoResponse.ok || !contributorsResponse.ok || !prsResponse.ok || !commitsResponse.ok || !languagesResponse.ok) {
          throw new Error('Failed to fetch repository data');
        }

        const [repoData, contributorsData, prsData, commitsData, languagesData] = await Promise.all([
          repoResponse.json(),
          contributorsResponse.json(),
          prsResponse.json(),
          commitsResponse.json(),
          languagesResponse.json()
        ]);

        setCommits(commitsData.slice(0, 10));
        setLanguages(languagesData);
        setRepoData(repoData);
        setContributors(contributorsData.slice(0, 5));
        setPullRequests({
          open: prsData.filter(pr => pr.state === 'open').length,
          closed: prsData.filter(pr => pr.state === 'closed').length
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [owner, repo]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const glowVariants = {
    initial: { opacity: 0.5, scale: 1 },
    animate: {
      opacity: [0.5, 0.7, 0.5],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const cardStyles = {
    p: 3,
    height: '100%',
    background: 'rgba(10, 25, 47, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      borderColor: '#00ffff',
      boxShadow: '0 4px 20px rgba(0, 255, 255, 0.1)'
    }
  };

  const headerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2,
    '& .MuiSvgIcon-root': {
      color: '#00ffff',
      fontSize: 24
    },
    '& .MuiTypography-root': {
      color: '#00ffff',
      fontWeight: 'bold'
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          gap: 2
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <CircularProgress size={60} sx={{ color: '#00ffff' }} />
        </motion.div>
        <Typography
          variant="h6"
          sx={{
            background: 'linear-gradient(45deg, #00ffff, #80deea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          Generating Repository Insights
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const stats = [
    { label: 'Stars', value: repoData?.stargazers_count || 0, icon: <Star /> },
    { label: 'Forks', value: repoData?.forks_count || 0, icon: <AccountTree /> },
    { label: 'Issues', value: repoData?.open_issues_count || 0, icon: <BugReport /> },
    { label: 'Pull Requests', value: pullRequests.open + pullRequests.closed, icon: <Merge /> }
  ];

  const totalLanguageBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const languagePercentages = Object.entries(languages).map(([name, bytes]) => ({
    name,
    percentage: ((bytes / totalLanguageBytes) * 100).toFixed(1)
  })).sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));

  return (
    <Container maxWidth="xl">
      <motion.div
        ref={reportRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ py: 4, position: 'relative' }}>
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: 'center', position: 'relative' }}>
            <motion.div
              variants={glowVariants}
              initial="initial"
              animate="animate"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2) 0%, rgba(0, 255, 255, 0) 70%)',
                borderRadius: '50%',
                zIndex: 0
              }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <GitHub sx={{ fontSize: 80, color: '#00ffff', mb: 2 }} />
            </motion.div>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#e6f1ff',
                textShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
                mb: 2
              }}
            >
              {repo}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 3
              }}
            >
              by {owner}
            </Typography>
            {/* Export Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
              <Tooltip title="Export as PNG">
                <IconButton
                  onClick={exportAsPNG}
                  disabled={exportLoading}
                  sx={{
                    color: '#00ffff',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(0, 255, 255, 0.1)',
                      borderColor: '#00ffff',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export as PDF">
                <IconButton
                  onClick={exportAsPDF}
                  disabled={exportLoading}
                  sx={{
                    color: '#00ffff',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'rgba(0, 255, 255, 0.1)',
                      borderColor: '#00ffff',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Content Section */}
          <Grid container spacing={4}>
            {/* Stats Cards */}
            {stats.map((stat) => (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={cardStyles}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: '#00ffff', mr: 1 }}>{stat.icon}</Box>
                      <Typography variant="h6" sx={{ color: '#00ffff', fontWeight: 'bold', ml: 1 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {stat.value.toLocaleString()}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}

            {/* Contributors Section */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={cardStyles}
                >
                  <Box sx={headerStyles}>
                    <People />
                    <Typography variant="h6">
                      Top Contributors
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {contributors.map((contributor) => (
                      <Grid item key={contributor.id}>
                        <Chip
                          avatar={<Avatar src={contributor.avatar_url} />}
                          label={contributor.login}
                          variant="outlined"
                          clickable
                          component="a"
                          href={contributor.html_url}
                          target="_blank"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                              borderColor: '#00ffff',
                              background: 'rgba(0, 255, 255, 0.1)'
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>

            {/* Pull Requests Stats */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={cardStyles}
                >
                  <Box sx={headerStyles}>
                    <Merge />
                    <Typography variant="h6">
                      Pull Requests Overview
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: 'rgba(0, 255, 255, 0.1)',
                          border: '1px solid rgba(0, 255, 255, 0.2)',
                          borderRadius: '8px'
                        }}
                      >
                        <Typography variant="h4" sx={{ color: '#00ffff', fontWeight: 'bold' }}>
                          {pullRequests.open}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Open PRs</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          background: 'rgba(255, 0, 0, 0.1)',
                          border: '1px solid rgba(255, 0, 0, 0.2)',
                          borderRadius: '8px'
                        }}
                      >
                        <Typography variant="h4" sx={{ color: '#ff4444', fontWeight: 'bold' }}>
                          {pullRequests.closed}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Closed PRs</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>

            {/* Languages Used */}
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={cardStyles}
                >
                  <Box sx={headerStyles}>
                    <Language />
                    <Typography variant="h6">
                      Languages Used
                    </Typography>
                  </Box>
                  {languagePercentages.map(({ name, percentage }) => (
                    <Box key={name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>{name}</Typography>
                        <Typography sx={{ color: '#00ffff' }}>{percentage}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={parseFloat(percentage)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: 'linear-gradient(45deg, #00ffff 30%, #80deea 90%)'
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Paper>
              </motion.div>
            </Grid>

            {/* Recent Commits */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={cardStyles}
                >
                  <Box sx={headerStyles}>
                    <Code />
                    <Typography variant="h6">
                      Recent Commits
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {commits.map((commit) => (
                      <Grid item xs={12} key={commit.sha}>
                        <Paper
                          sx={{
                            p: 2,
                            background: 'rgba(10, 25, 47, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: 'rgba(0, 255, 255, 0.1)',
                              borderColor: '#00ffff',
                              transform: 'translateX(5px)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Avatar src={commit.author?.avatar_url} />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#e6f1ff' }}>
                                {commit.commit.message.split('\n')[0]}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <Typography variant="body2" sx={{ color: '#00ffff' }}>
                                  {commit.commit.author.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                                  •
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  {new Date(commit.commit.author.date).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              size="small"
                              label={commit.sha.substring(0, 7)}
                              variant="outlined"
                              sx={{
                                fontFamily: 'monospace',
                                color: '#00ffff',
                                borderColor: 'rgba(0, 255, 255, 0.3)',
                                '&:hover': {
                                  borderColor: '#00ffff',
                                  background: 'rgba(0, 255, 255, 0.1)'
                                }
                              }}
                            />
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>

            {/* Advanced Analytics Section */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={cardStyles}
                >
                  <Box sx={headerStyles}>
                    <Analytics />
                    <Typography variant="h6">
                      Advanced Analytics
                    </Typography>
                  </Box>
                  <AdvancedAnalytics owner={owner} repo={repo} />
                </Paper>
              </motion.div>
            </Grid>

            {/* Collaboration Metrics Section */}
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Paper
                  elevation={0}
                  sx={cardStyles}
                >
                  <Box sx={headerStyles}>
                    <Group />
                    <Typography variant="h6">
                      Collaboration Insights
                    </Typography>
                  </Box>
                  <CollaborationMetrics owner={owner} repo={repo} />
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Repository;
