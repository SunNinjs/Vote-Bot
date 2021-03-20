const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'ping',
	cooldown: 60,
	description: 'Ping!',
	execute(message, args) {
        const discord = new Discord.MessageEmbed()
            .setColor(`#00000`)
            .setDescription(`Pong!`)
		message.channel.send(discord);
	},
};