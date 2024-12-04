import { playerKv } from './main';
import getPlayerDetails from './getPlayerDetails';

async function getWeeklyLeaderboard(
  title: string
): Promise<discord.Embed | null> {
  try {
    // Fetch all players from the key-value store
    const players = await playerKv.items();

    if (players.length === 0) {
      throw Error('No players found in the leaderboard.');
    }

    // Fetch details for each player and store in an array
    const leaderboardData = await Promise.all(
      players.map(async ({ key }) => {
        const playerId = await playerKv.get<string>(key);
        const playerDetails = await getPlayerDetails(playerId || '');
        return playerDetails ? { discordUserId: key, ...playerDetails } : null;
      })
    );

    // Filter out any null entries (in case of fetch errors) and sort by score
    const sortedLeaderboard = leaderboardData
      .filter((entry) => entry && entry.modes.qm_4v4.streak) // Ensure rating exists
      .sort((a, b) => {
        if (!a || !b) return 0;

        if (b.modes.qm_4v4.streak === a.modes.qm_4v4.streak) {
          // Secondary sort by ranking if streaks are equal
          return (
            (b.modes.qm_4v4.max_rating_7d || 0) -
            (a.modes.qm_4v4.max_rating_7d || 0)
          );
        }

        // Primary sort by streak
        return b.modes.qm_4v4.streak - a.modes.qm_4v4.streak;
      });

    // Prepare the embed
    const embed = new discord.Embed({
      title, // '🏆 Win Streak Leaderboard 🏆',
      description:
        '> 4v4 quick match win streaks.\n> Tie breaker: 7-day max ELO',
      color: 0xffd700, // Gold color for the embed
    });

    // Add each player to the embed
    sortedLeaderboard.forEach((player, index) => {
      if (player) {
        embed.addField({
          name: `__${index + 1}. ${player.name}__`,
          value: `Win streak: ${player.modes.qm_4v4.streak}\n7-day elo: ${player.modes.qm_4v4.max_rating_7d}`,
          inline: false,
        });
      }
    });

    // return leaderboard embed message
    return embed;
  } catch (error) {
    console.error('Error fetching weekly leaderboard:', error);
    return null;
  }
}

export default getWeeklyLeaderboard;
