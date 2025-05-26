import { Client, GatewayIntentBits, Events } from 'discord.js';
import dotenv from 'dotenv';
import { logger } from '../config/logger';
import axios from 'axios';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages
    ]
});

async function setupGuild(guildId?: string) {
    try {
        logger.info('Démarrage de la configuration de la guilde...');
        
        if (!guildId) {
            throw new Error('Aucun ID de guilde fourni');
        }

        logger.info(`Tentative de récupération de la guilde ${guildId}...`);
        const guild = await client.guilds.fetch(guildId);
        
        if (!guild) {
            throw new Error('Guilde non trouvée');
        }

        logger.info(`Guilde trouvée : ${guild.name}`);
        logger.info(`Nombre de membres : ${guild.memberCount}`);

        // Forcer la récupération des membres
        logger.info('Récupération des membres...');
        const members = await guild.members.fetch();
        const memberCount = members.size;
        logger.info(`Nombre de membres après fetch : ${memberCount}`);

        // Appel à l'API pour créer la guilde
        logger.info('Envoi des données à l\'API...');
        const response = await axios.post(`${process.env.API_URL}/guilds`, {
            uuid: guild.id,
            name: guild.name,
            memberCount: memberCount.toString(),
            configuration: {}
        });

        if (response.status === 201) {
            logger.info(`✅ Guilde "${guild.name}" créée avec succès`);
        } else if (response.status === 200) {
            logger.info(`La guilde "${guild.name}" existe déjà`);
        }

        process.exit(0);
    } catch (error) {
        logger.error('Erreur détaillée:', error);
        if (axios.isAxiosError(error) && error.response?.status === 409) {
            logger.info(`La guilde existe déjà`);
        } else {
            logger.error(error, 'Erreur lors de la configuration de la guilde');
        }
        process.exit(1);
    }
}

// Gestion des événements de connexion
client.on(Events.ClientReady, () => {
    logger.info(`Bot connecté en tant que ${client.user?.tag}`);
    const guildId = process.argv[2];
    if (!guildId) {
        logger.error('Aucun ID de guilde fourni en argument');
        process.exit(1);
    }
    setupGuild(guildId);
});

client.on(Events.Error, error => {
    logger.error('Erreur de connexion Discord:', error);
    process.exit(1);
});

// Connexion du bot
logger.info('Tentative de connexion du bot...');
client.login(process.env.BOT_TOKEN).catch(error => {
    logger.error('Erreur lors de la connexion du bot:', error);
    process.exit(1);
}); 