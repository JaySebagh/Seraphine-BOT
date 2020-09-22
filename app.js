require('dotenv').config()
const token = process.env.TOKEN

const ytdl = require('ytdl-core');
const streamOptions = {
    seek: 0,
    volume: 1
}
const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = ";"

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', async msg => {
    // avoid interacting with other bots
    if(msg.author.bot) return;
    // reply with emoji if trigger words are sent
    if(msg.content.toLocaleLowerCase() === 'wont look') msg.channel.send("<:ratirlWontLook:757100128145375332>");
    if(msg.content.toLocaleLowerCase() === 'coinflip') msg.channel.send("<:coinflip1:757048091667857569><:coinflip2:757047822142144592>");

    // join vc
    if(msg.content.startsWith(prefix + 'join')){
        if(msg.member.voice.channel){
            const connection = await msg.member.voice.channel.join();
        } else {
            msg.reply('You must be in a vc first');
        }
    }

    

    // play a song
    let songReq = msg.content.toLocaleLowerCase()
    if(songReq.startsWith(prefix + 'play') || songReq.startsWith(prefix + 'p')){
        let args = msg.content.split(" ");
        let url = args[1];

        if(!url) msg.reply('Please specify a link')
        let verify = await ytdl.validateURL(url);
        if(!verify) msg.reply('Invalid YouTube Link');

        let songData = await ytdl.getInfo(url);

        let connection = await msg.member.voice.channel.join();
        connection.play(ytdl(url), { filter: 'audioonly', quality: 'highest' });

        msg.channel.send(`Now Playing ${songData.videoDetails.title}`)
    }

    if(songReq.startsWith(prefix + 'leave') || songReq.startsWith(prefix + 'quit') || songReq.startsWith(prefix + 'q')){
        msg.member.voice.channel.leave();
    }
})

client.login(token)