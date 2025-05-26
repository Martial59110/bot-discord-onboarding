import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function updateAllGuilds() {
  try {
    for (const [guildId, guild] of client.guilds.cache) {
      // Récupérer le nombre de membres
      const memberCount = guild.memberCount.toString();
      const name = guild.name;
      const uuid = guild.id;

      // Mettre à jour le serveur
      await axios.put(`${process.env.API_URL}/guilds/${uuid}`, {
        name,
        memberCount,
        configuration: {}
      });

      console.log(`Serveur ${name} (${uuid}) mis à jour : ${memberCount} membres.`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la mise à jour des serveurs :', error);
    process.exit(1);
  }
}

client.once('ready', () => {
  updateAllGuilds();
});

client.login(process.env.BOT_TOKEN); 