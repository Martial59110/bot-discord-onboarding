import { Client, GatewayIntentBits, GuildMember } from 'discord.js';
import dotenv from 'dotenv';
import { logger } from '../config/logger';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

async function simulateMembers() {
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID!);
        if (!guild) {
            throw new Error('Guild not found');
        }

        // Nombre de membres à simuler
        const memberCount = 40;
        logger.info(`Simulation de ${memberCount} membres dans le serveur ${guild.name}...`);

        // On récupère le nombre actuel de membres
        const currentMembers = guild.memberCount;
        logger.info(`Nombre actuel de membres : ${currentMembers}`);

        // On met à jour le nombre de membres via l'API
        const response = await fetch(`${process.env.API_URL}/api/guilds/${guild.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: guild.name,
                memberCount: (currentMembers + memberCount).toString()
            })
        });

        if (response.ok) {
            logger.info(`✅ Nombre de membres mis à jour avec succès : ${currentMembers + memberCount}`);
        } else {
            throw new Error('Failed to update member count');
        }

        process.exit(0);
    } catch (error) {
        logger.error(error, 'Erreur lors de la simulation des membres');
        process.exit(1);
    }
}

client.once('ready', () => {
    simulateMembers();
});

client.login(process.env.BOT_TOKEN); 