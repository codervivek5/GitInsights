import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Avatar, AvatarGroup, Tooltip, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend
);

const CollaborationMetrics = ({ owner, repo }) => {
  const [teamMetrics, setTeamMetrics] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborationData = async () => {
      try {
        // Fetch pull requests with reviews
        const prsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`);
        const prsData = await prsResponse.json();

        // Fetch contributors
        const contributorsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`);
        const contributorsData = await contributorsResponse.json();

        // Process contributors data for leaderboard
        const processedContributors = contributorsData.map(contributor => ({
          login: contributor.login,
          avatar: contributor.avatar_url,
          contributions: contributor.contributions,
          url: contributor.html_url
        })).sort((a, b) => b.contributions - a.contributions);

        setContributors(processedContributors);

        // Process review data
        const reviewStats = {
          totalReviews: 0,
          approvals: 0,
          changes: 0,
          pending: 0
        };

        for (const pr of prsData) {
          const reviewsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pr.number}/reviews`);
          const reviewsData = await reviewsResponse.json();

          reviewStats.totalReviews += reviewsData.length;
          reviewStats.approvals += reviewsData.filter(r => r.state === 'APPROVED').length;
          reviewStats.changes += reviewsData.filter(r => r.state === 'CHANGES_REQUESTED').length;
          reviewStats.pending += reviewsData.filter(r => r.state === 'PENDING').length;
        }

        setReviews(reviewStats);

        // Calculate team productivity metrics
        const teamData = {
          labels: ['PR Velocity', 'Review Time', 'Collaboration Score', 'Code Quality', 'Team Engagement'],
          datasets: [{
            label: 'Team Metrics',
            data: [
              calculatePRVelocity(prsData),
              calculateReviewTime(prsData),
              calculateCollaborationScore(prsData, reviewStats),
              calculateCodeQuality(reviewStats),
              calculateTeamEngagement(contributorsData)
            ],
            backgroundColor: 'rgba(0, 255, 255, 0.2)',
            borderColor: '#00ffff',
            borderWidth: 2,
            pointBackgroundColor: '#00ffff',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#00ffff'
          }]
        };

        setTeamMetrics(teamData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collaboration data:', error);
        setLoading(false);
      }
    };

    fetchCollaborationData();
  }, [owner, repo]);

  // Utility functions for metric calculations
  const calculatePRVelocity = (prs) => {
    const merged = prs.filter(pr => pr.merged_at);
    if (merged.length === 0) return 0;
    const now = new Date();
    const oldestPR = new Date(merged[0].created_at);
    const days = (now - oldestPR) / (1000 * 60 * 60 * 24);
    return Math.min((merged.length / days) * 10, 100);
  };

  const calculateReviewTime = (prs) => {
    const reviewTimes = prs
      .filter(pr => pr.merged_at)
      .map(pr => {
        const created = new Date(pr.created_at);
        const merged = new Date(pr.merged_at);
        return (merged - created) / (1000 * 60 * 60);
      });
    const avg = reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length;
    return Math.min(100 - (avg / 24) * 10, 100); // Higher score for faster reviews
  };

  const calculateCollaborationScore = (prs, reviews) => {
    if (!reviews.totalReviews) return 0;
    return (reviews.approvals / reviews.totalReviews) * 100;
  };

  const calculateCodeQuality = (reviews) => {
    if (!reviews.totalReviews) return 0;
    return 100 - ((reviews.changes / reviews.totalReviews) * 100);
  };

  const calculateTeamEngagement = (contributors) => {
    const activeContributors = contributors.filter(c => c.contributions > 0);
    return Math.min((activeContributors.length / contributors.length) * 100, 100);
  };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        pointLabels: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="rgba(255, 255, 255, 0.7)">Loading collaboration metrics...</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={4}>
        {/* Team Metrics Radar Chart */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'rgba(10, 25, 47, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#00ffff',
                boxShadow: '0 4px 20px rgba(0, 255, 255, 0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#00ffff',
                mb: 3,
                fontWeight: 'bold'
              }}
            >
              Team Performance Metrics
            </Typography>
            {teamMetrics && <Radar data={teamMetrics} options={chartOptions} />}
          </Paper>
        </Grid>

        {/* Review Statistics */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'rgba(10, 25, 47, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#00ffff',
                boxShadow: '0 4px 20px rgba(0, 255, 255, 0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#00ffff',
                mb: 3,
                fontWeight: 'bold'
              }}
            >
              Code Review Statistics
            </Typography>
            {reviews && (
              <Box>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Approvals ({reviews.approvals})
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(reviews.approvals / reviews.totalReviews) * 100}
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
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Changes Requested ({reviews.changes})
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(reviews.changes / reviews.totalReviews) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 68, 68, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #ff4444 30%, #ff8888 90%)'
                      }
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Pending Reviews ({reviews.pending})
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(reviews.pending / reviews.totalReviews) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #ffc107 30%, #ffe082 90%)'
                      }
                    }}
                  />
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Contributor Leaderboard */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: 'rgba(10, 25, 47, 0.7)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              '&:hover': {
                borderColor: '#00ffff',
                boxShadow: '0 4px 20px rgba(0, 255, 255, 0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#00ffff',
                mb: 3,
                fontWeight: 'bold'
              }}
            >
              Contributor Leaderboard
            </Typography>
            <Grid container spacing={2}>
              {contributors.slice(0, 10).map((contributor, index) => (
                <Grid item xs={12} sm={6} md={4} key={contributor.login}>
                  <Paper
                    sx={{
                      p: 2,
                      background: 'rgba(10, 25, 47, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      '&:hover': {
                        borderColor: '#00ffff',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#00ffff',
                        fontWeight: 'bold',
                        minWidth: '24px'
                      }}
                    >
                      #{index + 1}
                    </Typography>
                    <Avatar src={contributor.avatar} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 'medium'
                        }}
                      >
                        {contributor.login}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#00ffff' }}
                      >
                        {contributor.contributions} contributions
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default CollaborationMetrics;
