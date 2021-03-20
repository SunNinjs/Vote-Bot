const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'leaderboard',
	cooldown: 1,
	description: 'Shows all votes',
	execute(message, args, Votes) {
        let pagelength = 10;
        let vote = Votes.sort((a, b) => b-a);
        let namesarray = vote.keyArray();
        let arrayvote = vote.array();
        let string = ``;
        let winner = arrayvote[0]

        if (arrayvote.length == 0) return message.channel.send(`There are no candidates at this time, be sure to vote!`)

        const generateEmbed = start => {
            const current = arrayvote.slice(start, start + pagelength)

            for (let i = 0; i<current.length; i++) {
                string = string + `\n<@${namesarray[i+start]}> has ${arrayvote[i+start]} votes`
            }

            const embed = new Discord.MessageEmbed()
                .setColor(`#fc8bc0`)
                .setTitle(`Showing Who has the Most Votes!`)
                .addField(`Candidates`, string)
                .setFooter(`Bot Created by Sun`);
            return embed;
        }

        const author = message.author;

        message.channel.send(generateEmbed(0)).then(message => {
            if (arrayvote.length <= pagelength) return;
            message.react(`➡️`)
            const collector = message.createReactionCollector(
                (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
                {time: 60000}
            )
            
            let currentIndex = 0;
            collector.on('collect', reaction => {
                string = ``;
                message.reactions.removeAll().then(async () => {
                  reaction.emoji.name === '⬅️' ? currentIndex -= pagelength : currentIndex += pagelength
                  message.edit(generateEmbed(currentIndex))
                  if (currentIndex !== 0) await message.react('⬅️')
                  if (currentIndex + pagelength < arrayvote.length) message.react('➡️')
                })
              })
        })
	},
};