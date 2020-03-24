const express = require('express');
const app = express();
const discord = require('discord.js');
const botconfig = require('./botconfig.json');
const hormBot = new discord.Client({disableEveryone: true});
const moment = require('moment');
const logger = require('./util/logger.js');
const cors = require('cors')
const port = 8080;
  // const sql = require('mssql');
// const config = {
//     user: 'sa',
//     password: 'P@d0rU123',
//     server: '167.71.200.91',
//     database: 'ohmDB'
// };
// // connect to your database
// var err = sql.connect(config)
// if (err) console.log(err);
app.use(cors({ origin: '*' }));
hormBot.on('ready', async () => {
    console.log(`${hormBot.user.username} is online!!!`);
});
hormBot.on("message", async msg => {
    const username = msg.author.username;
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    let prefix = botconfig.prefix;
    let msgArray = msg.content.split(" ");
    let cmd = msgArray[0];
    let args = msgArray.slice(1);
    switch(cmd){
        case `${prefix}hello`: return msg.channel.send(`Hello ${username}`); 
        case `${prefix}big`: return msg.channel.send(`ไอควายบิ๊ก ไอหน้าหี`);
        default: return msg.channel.send(`Command Not Found`);
    }
    // if(cmd === `${prefix}hello`){
    //     return msg.channel.send(`Hello ${username}`);
    // }
    // if(cmd === `${prefix}big`){
    //     return msg.channel.send(`ไอควายบิ๊ก ไอหน้าหี`);
    // }
});
hormBot.login(botconfig.token).catch((err) => console.log('err', err));

var server = app.listen(port, '0.0.0.0', () => {
    logger.info('Start server at port ' + port);
    //res notify to discord server
    var eventNotify = {
        message: `API Server Online at port ${port}`
    }
    discordNotify(eventNotify);
    
    //LINE NOTIFICATION
    process.on('SIGINT', () => {
        server.close(() => {
            //res notify to discord server
            var eventNotify = {
                message: "💥API Server Shutting Down!!! ",
            }
            discordNotify(eventNotify);
            console.log('Process terminated')
        })
    })


    process.on('SIGTERM', () => {
        server.close(() => {
            //res notify to discord server
            var eventNotify = {
                message: "API Server Shutting Down!!! ",
            }
            discordNotify(eventNotify);
            console.log('Process terminated')
        })
    })
})

//discord notify event
function discordNotify(eventNotify) {
    console.log('Discord notify to Team develop');
    hormBot.on("message", async msg => {
        return msg.channel.send(eventNotify);
    })
}

