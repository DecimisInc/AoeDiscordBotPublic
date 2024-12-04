import getWeeklyLeaderboard from './getWeeklyLeaderboard';
import getPlayerDetails from './getPlayerDetails';
import getLastGame from './getLastGame';
import { GamePlayer, Civilization, civNames, countryCodes } from './types';
import { mapImages } from './mapData';
import { CHANNEL_ID } from './constants';

// Initialize command group with a prefix of your choice
const commands = new discord.command.CommandGroup({
  defaultPrefix: '!',
});

// Create a Key Value store for mapping Discord user IDs to player IDs
export const playerKv = new pylon.KVNamespace('players');

// Help command
commands.raw('help', async (message) => {
  const embed = new discord.Embed()
    .setTitle('Available Commands')
    .setDescription('Here are the commands you can use:')
    .setColor(0x808080) // grey
    .addField({
      name: '**!add <player_id>**',
      value:
        'Associates your Age of Empires IV profile with your Discord account. Example: `!add 123456`',
    })
    .addField({
      name: '**!player**',
      value: 'Displays your Age of Empires IV profile stats.',
    })
    .addField({
      name: '**!game**',
      value: 'Displays current game status or relevant game info.',
    })
    .addField({
      name: '**!leaderboard**',
      value: 'Displays the leaderboard of top players.',
    });

  await message.reply(embed);
});

// Command to associate a player ID with a Discord user
commands.raw('add', async (message) => {
  const args = message.content.split(' ');
  const playerId = args[1]; // Expects a player ID as the second argument

  if (!playerId) {
    return message.reply(
      'Please provide a player ID. Usage: `!add <player_id>`'
    );
  }

  const discordUserId = message.author.id;
  const data = await getPlayerDetails(playerId);
  if (!data) {
    return message.reply('Player details not found.');
  }

  try {
    await playerKv.put(discordUserId, playerId);

    // Create an embed message with the player details
    const embed = new discord.Embed({
      title: data.name,
      description: `Your Age of Empires IV profile has been associated with your Discord account.`,
      color: 0x3498db, // A nice blue color for the embed
    })
      .addField({
        name: 'Max 4v4 ELO (all-time)',
        value: `> ${String(data.modes.qm_4v4.max_rating)}`,
        inline: false,
      })
      .addField({
        name: '4v4 win rate',
        value: `> ${String(data.modes.qm_4v4.win_rate)}%`,
        inline: false,
      });

    // Send the embed as a reply
    await message.reply(embed);
  } catch (error) {
    console.error('Error storing player ID:', error); // Log any storage errors
    await message.reply(
      'There was an error saving your player ID. Please try again later.'
    );
  }
});

// Command to display the player's stats
commands.raw('player', async (message) => {
  const discordUserId = message.author.id;
  const playerId = await playerKv.get<string>(discordUserId);

  if (!playerId) {
    return message.reply(
      'No player ID found for your account. Use `!add <player_id>` to associate one.'
    );
  }

  const data = await getPlayerDetails(playerId);
  if (!data) {
    return message.reply('Player details not found.');
  }

  try {
    // Create an embed message with the player stats
    const embed = new discord.Embed({
      title: `${data.name}`,
      description: `*Global 4v4 rank: ${data.modes.qm_4v4.rank.toLocaleString()}*`,
      color: 0x7a3a3a, // maroon color
    })
      .addField({
        name: 'Max 4v4 ELO (all-time)',
        value: `> ${String(data.modes.qm_4v4.max_rating)}`,
        inline: false,
      })
      .addField({
        name: '4v4 Win Rate',
        value: `> ${String(data.modes.qm_4v4.win_rate)}%`,
        inline: true,
      })
      .addField({
        name: 'Max 4v4 ELO (7 days)',
        value: `> ${String(data.modes.qm_4v4.max_rating_7d)}`,
        inline: true,
      })
      .addField({
        name: 'Max 4v4 ELO (1 month)',
        value: `> ${String(data.modes.qm_4v4.max_rating_1m)}`,
        inline: true,
      })
      .addField({
        name: 'Win Streak',
        value: `> ${String(data.modes.qm_4v4.streak)}`,
        inline: true,
      })
      .addField({
        name: 'Total Games Played',
        value: `> ${String(data.modes.qm_4v4.games_count)}`,
        inline: true,
      })
      .addField({
        name: 'Total Wins',
        value: `> ${String(data.modes.qm_4v4.wins_count)}`,
        inline: true,
      })
      .addField({
        name: 'Total Losses',
        value: `> ${String(data.modes.qm_4v4.losses_count)}`,
        inline: true,
      })
      .addField({
        name: 'Disputes',
        value: `> ${String(data.modes.qm_4v4.disputes_count)}`,
        inline: true,
      })
      .addField({
        name: 'Drops',
        value: `> ${String(data.modes.qm_4v4.drops_count)}`,
        inline: true,
      });

    // Send the embed as a reply
    await message.reply(embed);
  } catch (error) {
    console.error('Error checking player ID:', error); // Log any storage errors
    await message.reply(
      'There was an error fetching your player stats. Please try again later.'
    );
  }
});

// leaderboard
commands.raw('leaderboard', async (message) => {
  try {
    const leaderboardEmbed = await getWeeklyLeaderboard(
      '🏆 Win Streak Leaderboard 🏆'
    );
    if (!leaderboardEmbed) {
      return message.reply(
        'There was an error generating the leaderboard. Please try again later.'
      );
    }

    // Send the leaderboard embed
    await message.reply(leaderboardEmbed);
  } catch (error) {
    console.error('Error generating leaderboard:', error);
    await message.reply(
      'There was an error generating the leaderboard. Please try again later.'
    );
  }
});

// most recent game stats
commands.raw('game', async (message) => {
  const discordUserId = message.author.id;
  const playerId = await playerKv.get<string>(discordUserId);

  if (!playerId) {
    return message.reply(
      'No player ID found for your account. Use `!player add <player_id>` to associate one.'
    );
  }

  try {
    const gameResults = await getLastGame(playerId || '');
    if (!gameResults) {
      return message.reply(
        'There was an error fetching your last game. Please try again later.'
      );
    }

    const playerDetails = await getPlayerDetails(playerId || '');
    if (!playerDetails) {
      return message.reply(
        'There was an error fetching your last game details. Please try again later.'
      );
    }

    // calculate title, description
    const inProgress = gameResults.ongoing;
    const title = inProgress
      ? `Game in-progress - ${playerDetails.name}`
      : `Last Game Details - ${playerDetails.name}`;
    let description = `> `;
    if (!inProgress) {
      description += `Game length: ${Math.ceil(
        gameResults.duration / 60
      )} minutes\n> `;
    }
    description += `Map: ${gameResults.map}\n> Server: ${gameResults.server}`;

    // create embed
    const embedArgs: any = {
      title,
      description,
      color: inProgress ? 0xadd8e6 : 0x7e4b8b, // light blue in-progress, purple done
    };
    if (inProgress) {
      embedArgs.image = {
        thumbnail: mapImages[gameResults.map],
      };
    } else {
      embedArgs.image = {
        url: mapImages[gameResults.map],
      };
    }
    const embed = new discord.Embed(embedArgs);

    // List up to 8 players with their names and civilizations
    // Identify the player's team
    let playerTeamIndex = -1;
    gameResults.teams.forEach((team, index) => {
      if (
        team.some((player) => player.profile_id === playerDetails.profile_id)
      ) {
        playerTeamIndex = index;
      }
    });

    // Reorder the teams so that the player's team is first
    const sortedTeams = gameResults.teams.slice();
    if (playerTeamIndex !== -1) {
      // Move the team the player is on to the first position
      const playerTeam = sortedTeams.splice(playerTeamIndex, 1)[0];
      sortedTeams.unshift(playerTeam);
    }

    // iterate through results
    sortedTeams.forEach((team, index: number) => {
      const result = team[0].result;
      const diff = Math.abs(team[0].rating_diff);
      const resultString = inProgress
        ? ' '
        : `${result === 'win' ? '🏆 ' : '⛔ '} **${result.toUpperCase()}** (${
            result === 'win' ? `+${diff}` : `-${diff}`
          })`;
      embed.addField({
        name: `-------------- __Team ${index + 1}__ --------------`,
        value: resultString,
        inline: false,
      });
      team.slice(0, 8).forEach((player: GamePlayer, index: number) => {
        const civ = player.civilization as Civilization;
        const civString = civNames[civ];
        const civFlag = '';
        const rating = player.rating ? player.rating : `*unranked*`;
        const country = countryCodes[player.country];
        const inputIcon =
          player.input_type === 'keyboard'
            ? '🖱️'
            : player.input_type === 'controller'
            ? '🎮'
            : '❓';

        const mode = player.modes.qm_4v4;
        const disputes = mode ? mode.disputes_count : 0;
        const drops = mode ? mode.drops_count : 0;
        let disputeString = '';
        if (disputes || drops) {
          disputeString += `\n> *`;
          if (disputes) {
            disputeString += `Disputes: ${disputes}`;
          }
          if (drops) {
            if (disputes) {
              disputeString += `, `;
            }
            disputeString += `Drops: ${drops}`;
          }
          disputeString += '*';
        }

        embed.addField({
          name: ` `,
          value: `**[${player.name}](${player.site_url})**: ${rating}\n**${civString}**\n${inputIcon} *${country}*${disputeString}`,
          inline: false,
        });
      });
    });

    // Send the embed
    await message.reply(embed);
  } catch (error) {
    console.error('Error fetching game data:', error);
    await message.reply(
      'There was an error fetching your last game. Please try again later.'
    );
  }
});

pylon.tasks.cron('post_weekly_leaderboard_v1', '0 0 21 * * THU *', async () => {
  // NOTE: pylon servers run in UTC timezone
  const channel = await discord.getGuildTextChannel(CHANNEL_ID);
  if (!channel) {
    return;
  }

  const guild = await discord.getGuild(channel.guildId);
  if (!guild) {
    return;
  }

  const leaderboardEmbed = await getWeeklyLeaderboard(
    '🏆 Weekly Leaderboard 🏆'
  );
  if (!leaderboardEmbed) {
    return;
  }

  // send a weekly leaderboard update
  await channel.sendMessage(leaderboardEmbed);
});
