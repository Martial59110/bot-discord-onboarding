import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { logger } from '../config/logger';

import { data as createCampusCommand } from '../campuses/commands/create-campus.command';
import { data as modifyCampusCommand } from '../campuses/commands/modify-campus.command';
import { data as deleteCampusCommand } from '../campuses/commands/delete-campus.command';
import { data as showCampusFormCommand } from '../campuses/commands/show-campus-form.command';
import { data as setupIdentificationCommand } from '../identification_requests/commands/setupIdentificationButton';
import { data as addPostCommand } from '../channels/commands/create-stock-post.command';
import { data as listPostsCommand } from '../channels/commands/list-stock-posts.command';
import { data as updatePostCommand } from '../channels/commands/modify-stock-channel.command';
import { data as deletePostCommand } from '../channels/commands/delete-stock-post.command';
import { data as createCourseCommand } from '../courses/commands/create-course.command';
import { data as deleteCourseCommand } from '../courses/commands/delete-course.command';
import { data as showCourseFormCommand } from '../courses/commands/show-course-form.command';
import { data as createPromoCommand } from '../promotions/commands/create-promo.command';

dotenv.config();

// Vérification des variables d'environnement requises
const { BOT_TOKEN, CLIENT_ID } = process.env;

if (!BOT_TOKEN || !CLIENT_ID) {
    logger.fatal("❌ Variables d'environnement manquantes ! Vérifiez votre fichier .env");
    process.exit(1);
}

const commands = [
    createCampusCommand.toJSON(),
    modifyCampusCommand.toJSON(),
    deleteCampusCommand.toJSON(),
    showCampusFormCommand.toJSON(),
    createPromoCommand.toJSON(),
    setupIdentificationCommand.toJSON(),
    addPostCommand.toJSON(),
    listPostsCommand.toJSON(),
    updatePostCommand.toJSON(),
    deletePostCommand.toJSON(),
    createCourseCommand.toJSON(),
    deleteCourseCommand.toJSON(),
    showCourseFormCommand.toJSON(),
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function deployCommands(guildId?: string) {
    try {
        logger.info('🚀 Début du déploiement des commandes slash...');

        if (!guildId) {
            // Déploiement global
            await rest.put(
                Routes.applicationCommands(CLIENT_ID!),
                { body: commands }
            );
            logger.info('✅ Commandes slash déployées globalement avec succès !');
        } else {
            // Déploiement pour une guilde spécifique
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID!, guildId),
                { body: commands }
            );
            logger.info(`✅ Commandes slash déployées avec succès pour la guilde ${guildId} !`);
        }
    } catch (error) {
        logger.error("❌ Erreur lors du déploiement des commandes slash :", error);
        process.exit(1);
    }
}

// Récupérer l'ID de la guilde depuis les arguments de la ligne de commande
const guildId = process.argv[2];
deployCommands(guildId);


