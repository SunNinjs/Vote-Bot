const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'vote-clear',
	cooldown: 1,
	description: 'Clears all the votes',
    permissions: 'ADMINISTRATOR',
	execute(message, args, Votes, Voters) {
        Votes.clear();
		Voters.clear();
		message.channel.send(`The leaderboard has been cleared`);
	},
};