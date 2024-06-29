import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import TeamSeasonGames from './TeamSeasonGames';

const PlayerDetail = () => {
  const { id } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://eldatomxapi.silverboi.me/nba/player_game_data/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPlayerData(data);
        if (data.games.length > 0) {
          setSelectedGameId(data.games[0].GAME_ID);
        }
      } catch (error) {
        console.error('Error fetching player data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [id]);

  const playerImageUrl = (playerId) => `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
  const teamLogoUrl = (teamId) => `https://cdn.nba.com/logos/nba/${teamId}/global/D/logo.svg`;

  const handleGameSelect = (gameId) => {
    setSelectedGameId(gameId);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!playerData) return <Typography>No player data found</Typography>;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Grid container sx={{ height: '50%' }}>
        <Grid item xs={2.4} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', mb: 1 }}>
            <img
              src={playerImageUrl(playerData.player_info.PLAYER_ID)}
              alt={playerData.player_info.PLAYER_NAME}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <img
              src={teamLogoUrl(playerData.player_info.TEAM_ID)}
              alt={playerData.player_info.TEAM_NICKNAME}
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                width: '30%',
                height: '30%',
              }}
            />
          </Box>
          <Typography variant="h6" noWrap>{playerData.player_info.PLAYER_NAME}</Typography>
        </Grid>
        <Grid item xs={9.6}>
          <TeamSeasonGames 
            games={playerData.games}
            selectedGameId={selectedGameId}
            onGameSelect={handleGameSelect}
          />
        </Grid>
      </Grid>
      {/* Lower half of the screen is intentionally left empty */}
    </Box>
  );
};

export default PlayerDetail;
