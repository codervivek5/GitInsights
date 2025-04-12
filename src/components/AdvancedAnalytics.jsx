import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdvancedAnalytics = ({ owner, repo }) => {
  const [commitData, setCommitData] = useState(null);
  const [issueData, setIssueData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch commit frequency data
        const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`);
        const commitsData = await commitsResponse.json();

        // Fetch issue data
        const issuesResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all`);
        const issuesData = await issuesResponse.json();

        // Process commit data
        const commitChartData = {
          labels: commitsData.slice(-12).map((week, index) => `Week ${index + 1}`),
          datasets: [{
            label: 'Commits',
            data: commitsData.slice(-12).map(week => week.total),
            borderColor: '#00ffff',
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            tension: 0.4
          }]
        };
        setCommitData(commitChartData);

        // Process issue resolution time
        const resolvedIssues = issuesData.filter(issue => issue.state === 'closed');
        const resolutionTimes = resolvedIssues.map(issue => {
          const created = new Date(issue.created_at);
          const closed = new Date(issue.closed_at);
          return Math.floor((closed - created) / (1000 * 60 * 60 * 24)); // Days
        });

        const issueChartData = {
          labels: resolvedIssues.map((_, index) => `Issue ${index + 1}`),
          datasets: [{
            label: 'Resolution Time (Days)',
            data: resolutionTimes,
            borderColor: '#ff4444',
            backgroundColor: 'rgba(255, 68, 68, 0.1)',
            tension: 0.4
          }]
        };
        setIssueData(issueChartData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [owner, repo]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="rgba(255, 255, 255, 0.7)">Loading analytics...</Typography>
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
        {/* Commit Frequency Graph */}
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
              Commit Frequency
            </Typography>
            {commitData && <Line data={commitData} options={chartOptions} />}
          </Paper>
        </Grid>

        {/* Issue Resolution Time */}
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
                borderColor: '#ff4444',
                boxShadow: '0 4px 20px rgba(255, 68, 68, 0.1)'
              }
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#ff4444',
                mb: 3,
                fontWeight: 'bold'
              }}
            >
              Issue Resolution Time
            </Typography>
            {issueData && <Line data={issueData} options={chartOptions} />}
          </Paper>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default AdvancedAnalytics;
