import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Trade or Tighten
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.85 }}>
            A multiplayer strategy game of risk, timing, and market chaos
          </Typography>
        </Box>

        {/* Primary Actions */}
        <Box textAlign="center" mb={6}>
          <Button
            variant="contained"
            size="large"
            sx={{ mr: 2, px: 4 }}
            onClick={() => navigate('/game')}
          >
            Join Live Game
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ color: 'white', borderColor: 'white' }}
          >
            How It Works
          </Button>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  📈 Trade
                </Typography>
                <Typography variant="body2">
                  Buy, sell, and react to market events in real time against other players.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  🎲 Gamemaster
                </Typography>
                <Typography variant="body2">
                  Custom events can reshape the market instantly — crashes, bonuses, freezes.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  👥 Multiplayer
                </Typography>
                <Typography variant="body2">
                  Compete live with multiple players — every action updates in real time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box textAlign="center" mt={6} sx={{ opacity: 0.6 }}>
          <Typography variant="caption">
            Trade or Tighten • Prototype v0.1
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
