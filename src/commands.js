const SubCommandType = Object.freeze({
	SUB_COMMAND: 1,
	SUB_COMMAND_GROUP: 2,
});

/**
 * @readonly
 * @enum {string}
 */
export const UpcomingSubCommand = {
	Soon: 'soon',
	All: 'all',
};

export const MUSIC = {
	name: 'music',
	description: 'Manages all music requests',
	options: [
		{
			name: 'help',
			description: 'List all available commands',
			type: SubCommandType.SUB_COMMAND,
		},
		{
			name: 'upcoming',
			description: 'Get upcoming music releases',
			type: SubCommandType.SUB_COMMAND_GROUP,
			options: [
				{
					name: UpcomingSubCommand.Soon,
					description: 'Get upcoming music releases within the next month',
					type: SubCommandType.SUB_COMMAND,
				},
				{
					name: UpcomingSubCommand.All,
					description: 'Get upcoming music releases within the next year',
					type: SubCommandType.SUB_COMMAND,
				},
			],
		},
		{
			name: 'current',
			description: 'Get music releases between seven days ago and seven days from now',
			type: SubCommandType.SUB_COMMAND,
		},
	],
};

export const allCommands = [MUSIC];
