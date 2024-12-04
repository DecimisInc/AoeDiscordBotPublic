import { Player } from './types';

/**
 * Fetches player details from the API using the provided profile ID.
 * @param profileId - The player's profile ID to retrieve details for.
 * @returns The player details as JSON or `null` if an error occurs.
 */
async function getPlayerDetails(profileId: string): Promise<Player | null> {
  try {
    const response = await fetch(
      `https://aoe4world.com/api/v0/players/${profileId}`
    );

    if (!response.ok) {
      console.error(
        `Error fetching player details: ${response.status} ${response.statusText}`
      );
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching player details:', error);
    return null;
  }
}

export default getPlayerDetails;
