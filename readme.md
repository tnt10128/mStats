# 🟩 mStats
A Discord bot with various Minecraft-related commands

![GNU GPL v3](https://img.shields.io/github/license/TNT10128/mStats?style=for-the-badge)
![Codefactor code quality](https://img.shields.io/codefactor/grade/github/TNT10128/mStats?style=for-the-badge)

## ℹ️ Description
mStats is a small Discord bot written with Discord.js version 14 that offers Minecraft-related commands to improve your server.

## 🤖 Commands

Below are the commands currently available in mStats. This list will grow as more features are added to the bot.
- /serverinfo \<server IP> - gets information about an online Minecraft Java server
- /spigotinfo \<resource ID> - gets information about a resource on SpigotMC.org
- /userinfo \<player username> - gets information about a Minecraft Java account
- /isblocked \<server IP> - tells you whether a Minecraft server is being blocked by Mojang
- /meme - sends a random meme from the r/minecraftmemes subreddit

## ❓ How to use
Most users should simply [invite mStats with this link](https://discord.com/api/oauth2/authorize?client_id=1045365024425775114&permissions=313344&scope=bot%20applications.commands).

If you're an advanced user and want to self-host, create a file named `config.json` in the root directory of the project. Paste the contents of the `config.template.json` file into the file, obviously replacing the placeholders with their values from the Discord developer dashboard.

Run `npm start` to start the bot.
Have fun :-)
