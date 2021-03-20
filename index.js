const fs = require(`fs`);
const data = require(`./data.json`)
const Discord = require(`discord.js`);
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

client.on(`ready`, () => {
    console.log(`On!`)
})

const Votes = new Discord.Collection();
const Voters = new Discord.Collection();

client.on('message', message => {
	if (!message.content.startsWith(data.prefix) || message.author.bot) return;

	const args = message.content.slice(data.prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
    
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
		client.commands.set(command.name, command);
		
	}

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.channel.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${data.prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args, Votes, Voters);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}

});

client.login(data.token)