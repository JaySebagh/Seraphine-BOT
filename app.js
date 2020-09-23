require('dotenv').config()
const token = process.env.TOKEN

const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = ";"

let queue =  new Map();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', async msg => {
    // avoid interacting with other bots
    if(msg.author.bot) return;
    // split the command into an array of strings
    let args = msg.content.substring(prefix.length).split(' ');
    // queue
    const serverQueue = queue.get(msg.guild.id);
    // switch statement based off the first string in the array
    switch(args[0].toLocaleLowerCase()){
        // join vc
        case "join":
        case "j":
            if(msg.member.voice.channel){
                const connection = await msg.member.voice.channel.join();
                if(connection) msg.react("👍")
                break;
            } else {
                msg.reply('You must be in a vc first');
                break;
            }
        // leave vc
        case "leave":
        case "quit":
        case "q":
        case "l":
            if(msg.member.voice.channel){
                const disconnect = await msg.member.voice.channel.leave();
                msg.react("👋");
                break;
            }
        // play song
        case "play":
        case "p":
            const vc = msg.member.voice.channel;
            // verify user is in a vc
            if(!vc) return msg.channel.send("You must be in a vc");
            // verify there is a message after the command
            if(!args[1]) return msg.channel.send("Please provide a song link");
            // verify the message is a valid YouTube link
            const verify = await ytdl.validateURL(args[1]);
            if(!verify) return msg.channel.send("Invalid YouTube link");
            // get the current user's vc
            const perms = vc.permissionsFor(msg.client.user);
            // check if bot has proper permissons
            if(!perms.has('CONNECT')) return msg.channel.send("Cannot connect to vc. Check perms.");
            if(!perms.has('SPEAK')) return msg.channel.send("Cannot talk in vc. Check perms.");
            // attempt to join vc
            try{
                const connection = await msg.member.voice.channel.join()
                const dispatcher = connection.play(ytdl(args[1]), { filter: 'audioonly', quality: 'highest' });
                dispatcher.setVolumeLogarithmic(1/5)
            } catch(error){
                console.error(error)
            }


            // // create server song queue if it does not exist
            // if(!servers[msg.guild.id]) servers[msg.guild.id] = {
            //     queue: []
            // }
            // // grab the sever queue
            // let server = servers[msg.guild.id];
            // // add song to queue
            // server.queue.push(args[1]);
            // // join vc
            // const connection = await msg.member.voice.channel.join()
            // connection.play(ytdl(server.queue[0]), { filter: 'audioonly', quality: 'highest' });
            
            // // let songData = await ytdl.getInfo(server.queue[0])
            // // msg.channel.send(`Now Playing ${songData.videoDetails.title}`)
            break;
        // skip song
        case "skip":
        case "next":
        case "s":
        case "n":
            if(server.dispatcher) server.dispatcher.end();
            break;
        // pause song
        case "pause":
        case "stop":
            // if(!msg.member.voice.connection) return;
            // msg.member.voice.connection.disconnect();
            break;
    }
    // reply with emoji if trigger words are sent
    if(msg.content.toLocaleLowerCase() === 'wont look') msg.channel.send("<:ratirlWontLook:757100128145375332>");
    if(msg.content.toLocaleLowerCase() === 'coinflip') msg.channel.send("<:coinflip1:757048091667857569><:coinflip2:757047822142144592>");

    // // play a song
    // var servers = {};

    // let songReq = msg.content.toLocaleLowerCase()
    // if(songReq.startsWith(prefix + 'play') || songReq.startsWith(prefix + 'p')){
    //     let args2 = msg.content.split(" ");
    //     let url = args2[1];

    //     if(!url) msg.reply('Please specify a link')
    //     let verify = await ytdl.validateURL(url);
    //     if(!verify) msg.reply('Invalid YouTube Link');

    //     let songData = await ytdl.getInfo(url);

    //     let connection = await msg.member.voice.channel.join();
    //     connection.play(ytdl(url), { filter: 'audioonly', quality: 'highest' });

    //     msg.channel.send(`Now Playing ${songData.videoDetails.title}`)
    // }

    // // leave vc
    // if(songReq.startsWith(prefix + 'leave') || songReq.startsWith(prefix + 'quit') || songReq.startsWith(prefix + 'q')){
    //     msg.member.voice.channel.leave();
    // }


})

client.login(token)