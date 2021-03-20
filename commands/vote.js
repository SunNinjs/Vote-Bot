const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'vote',
	cooldown: 1,
    usage: "<> <>",
	description: 'votes for a person',
	execute(message, args, Votes, Voters) {
        const author = message.author;
        if (message.mentions.members.first()) {
            let voterarray = Voters.sort().array()
            let member = message.mentions.members.first();

            if (!Voters.has(author.id)) {
                Voters.set(author.id, [member.id])
            } else if (voterarray[0].includes(member.id)) {
                return message.channel.send(`Sorry, but you have already voted for this person!`);
            } else {
                Voters.delete(author.id)
                voterarray[0].push(member.id);
                Voters.set(author.id, voterarray[0])
            }

            if (!Votes.has(member.id)) {
                Votes.set(member.id, 1);
                message.channel.send(`${member.displayName} has 1 votes now`);
            } else {
                let amount = Votes.get(member.id);
                Votes.delete(member.id)
                Votes.set(member.id, amount+1);
                message.channel.send(`${member.displayName} has ${amount+1} votes now`);
            }


        } else {
            message.channel.send(`No person has been mentioned`)
        }
	},
};