import { Router } from 'itty-router';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import JsonResponse from './json-response.model.js';
import { MUSIC } from './commands.js';
import getUpcomingMusicValues from './sheets.js';
import { getMessageByMusicCommand } from './music-command.js';
import { convertUpcomingsRawToObjects, createUpcomingCollections } from './releases.js';

const router = Router();

router.get('/', (request, env) => {
	return new Response(`😶 Take me back to Eden (${env.DISCORD_APPLICATION_ID})`);
});

router.post('/', async (request, env) => {
	const { isValid, interaction } = await server.verifyDiscordRequest(request, env);
	if (!isValid || !interaction) {
		return new Response('Bad request signature.', { status: 401 });
	}

	if (interaction.type === InteractionType.PING) {
		// Required to configure the webhook in the dev portal. Used during the initial webhook handshake
		return new JsonResponse({
			type: InteractionResponseType.PONG,
		});
	}

	if (interaction.type === InteractionType.APPLICATION_COMMAND) {
		switch (interaction.data.name.toLowerCase()) {
			case MUSIC.name.toLowerCase(): {
				const releasesRaw = await getUpcomingMusicValues(env.SHEETS_API_KEY, env.SHEET_ID);
				const releases = convertUpcomingsRawToObjects(releasesRaw).filter((upcoming) => upcoming.daysToRelease >= 0);
				const releasesCollections = createUpcomingCollections(releases);
				const messageContent = getMessageByMusicCommand(interaction, releasesCollections);

				return new JsonResponse({
					type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
					data: {
						content: messageContent,
					},
				});
			}
			default:
				return new JsonResponse({ error: 'Unknown type' }, { status: 400 });
		}
	}
});

router.all('*', () => new Response('Not found.', { status: 404 }));

async function verifyDiscordRequest(request, env) {
	const signature = request.headers.get('x-signature-ed25519');
	const timestamp = request.headers.get('x-signature-timestamp');

	const body = await request.text();
	const isValidRequest = signature && timestamp && verifyKey(body, signature, timestamp, env.DISCORD_APPLICATION_PUBLIC_KEY);

	return { interaction: JSON.parse(body), isValid: isValidRequest };
}

const server = {
	verifyDiscordRequest,
	fetch: async function (request, env) {
		console.log(`Request info: timezone is ${request.cf.timezone}`);
		return router.handle(request, env);
	},
};

export default server;
