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
			name: 'upcoming',
			description: 'Get upcoming music releases',
			type: 2, // SUB_COMMAND_GROUP,
			options: [
				{
					name: UpcomingSubCommand.Soon,
					description: 'Get upcoming music releases within the next month',
					type: 1, // SUB_COMMAND
				},
				{
					name: UpcomingSubCommand.All,
					description: 'Get upcoming music releases within the next year',
					type: 1,
				},
			],
		},
	],
};
