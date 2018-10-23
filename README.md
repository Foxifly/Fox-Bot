# Fox Bot
##### Lindsay Ciastko

## Introduction
Fox Bot is a bot designed for the music sharing website, [plug.dj](https://plug.dj). It is designed for a specific 'music room' on plug.dj known as Fox Den | EDM. The link to Fox Den is located [here](https://plug.dj/foxdenedm). The purpose of posting this code onto Github is for prospective employers to explore the work I have completed with Node.JS and analyze how much I've worked with developing Fox Bot. There is no need to clone or download this repository. A fully functioning Fox Bot with all API Keys and credential is running in [Fox Den EDM](https://plug.dj/foxdenedm).

## Dependencies
<table>
  <tr>
  <th> Dependency </td>
  <th> Description </th>
  <th> Links </th>
</tr>

<tr>
  <td> PlugAPI </td>
  <td> Allows Fox Bot to connect to Fox Den and make calls to the Plug.dj API. It is a generic API for designing Node.JS bots.  </td>
  <td> <a href="https://www.npmjs.com/package/plugapi">NPM</a> <a href="https://github.com/plugcubed/plugapi#readme">GitHub</a> </td>
</tr>

<tr>
  <td> FTP </td>
  <td> Connects to Fox Den EDM VPS through FTP connection to upload JSON data for the website to pull in. This will eventually be replaced with Express and Socket.io  </td>
  <td> <a href="https://www.npmjs.com/package/ftp">NPM</a> <a href="https://github.com/mscdex/node-ftp">GitHub</a> </td>
</tr>

<tr>
  <td> LowDB </td>
  <td> The database module that Fox Bot uses to track seen users, played songs etc. Low DB is a lightweight JSON database used for keeping track of all our data. </td>
  <td> <a href="https://www.npmjs.com/package/lowdb">NPM</a> <a href="https://github.com/typicode/lowdb">GitHub</a> </td>
</tr>

<tr>
  <td> PM2 </td>
  <td> The process manager that Fox Bot uses to continuously run even if it experiences a crash. </td>
  <td> <a href="https://www.npmjs.com/package/pm2">NPM</a> <a href="http://pm2.keymetrics.io/">Website</a> </td>
</tr>

<tr>
  <td> Socket.io Client </td>
  <td> The socket client is used to communicate to the Fox Den EDM VPS to transfer and recieve data through events. </td>
  <td> <a href="https://www.npmjs.com/package/socket.io-client">NPM</a> <a href="https://github.com/socketio/socket.io-client#readme">GitHub</a> </td>
</tr>

<tr>
  <td> Unescape </td>
  <td> This package is used to unescape odd characters that are found in some users' usernames. Makes them legible to the bot. </td>
  <td> <a href="https://www.npmjs.com/package/unescape">NPM</a> <a href="https://github.com/jonschlinkert/unescape">GitHub</a> </td>
</tr>

<tr>
  <td> Trello </td>
  <td> Trello is an organizational tool that we use to manage user bans, command planning and testing, etc. Fox Bot integrates with our trello board to update suggestions and user punishments. </td>
  <td> <a href="https://www.npmjs.com/package/trello">NPM</a> <a href="https://github.com/norberteder/trello">GitHub</a>  <a href="https://trello.com/">Website</a> </td>
</tr>

<tr>
  <td> MS Translator  </td>
  <td> Not all users in Fox Den speak english. Fox Bot has an integrated translator functionality that will translate selected phrases into english. </td>
  <td> <a href="https://www.npmjs.com/package/mstranslator">NPM</a> <a href="https://github.com/nanek/mstranslator#readme">GitHub</a>  <a href="https://translator.microsoft.com/">Website</a> </td>
</tr>

<tr>
  <td> MS Translator  </td>
  <td> Not all users in Fox Den speak english. Fox Bot has an integrated translator functionality that will translate selected phrases into english. </td>
  <td> <a href="https://www.npmjs.com/package/mstranslator">NPM</a> <a href="https://github.com/nanek/mstranslator#readme">GitHub</a>  <a href="https://translator.microsoft.com/">Website</a> </td>
</tr>

<tr>
  <td> Giphy API </td>
  <td> Fox Bot integrates with the Giphy API. This functionality allows a user to query for a gif and fox bot displays a random result. </td>
  <td> <a href="https://www.npmjs.com/package/giphy-api">NPM</a> <a href="https://github.com/austinkelleher/giphy-api">GitHub</a>  <a href="https://giphy.com/">Website</a> </td>
</tr>

<tr>
  <td> ImgFlipper</td>
  <td> THe donor tier of users have the ability to generate memes using the ImgFlipper API which is integrated into Fox Bot.</td>
  <td> <a href="https://www.npmjs.com/package/imgflipper">NPM</a> <a href="https://github.com/robu3/imgflipper">GitHub</a>  <a href="https://imgflip.com/">Website</a> </td>
</tr>

<tr>
  <td> Node Soundcloud</td>
  <td> Plug Dj allows users to play songs from YouTube and SoundCloud. In order to get the URL of a soundcloud track, we need to perform a request using the SoundCloud API for the song link. </td>
  <td> <a href="https://www.npmjs.com/package/node-soundcloud">NPM</a> <a href="https://github.com/jakemmarsh/node-soundcloud">GitHub</a>  <a href="https://soundcloud.com/">Website</a> </td>
</tr>

<tr>
  <td> Urban Dictionary</td>
  <td>With Fox Bot, users have the ability to look up search terms in Urban Dictionary. This feature is typically disabled due to inappropriate results. </td>
  <td> <a href="https://www.npmjs.com/package/urban-dictionary">NPM</a> <a href="https://github.com/NightfallAlicorn/urban-dictionary">GitHub</a>  <a href="https://www.urbandictionary.com/">Website</a> </td>
</tr>

<tr>
  <td> Cleverbot  </td>
  <td>Fox Bot now uses the AI power of cleverbot to interact with users. This is a new dependency as of the 2.0.0 update.</td>
  <td> <a href="https://www.npmjs.com/package/cleverbot">NPM</a> <a href="https://github.com/dtesler/node-cleverbot#readme">GitHub</a>  <a href="https://www.cleverbot.com/">Website</a> </td>
</tr>

</table>

## Commands
A list of all commands that can be used with Fox Bot can be located [here](https://foxdenedm.com/commands)

## Licensing and Usage
Fox Bot was created from scratch and is continuously modified with new features. You are NOT permitted to use any of Fox Bot's code for your own use. Violators will be contacted and asked to remove their code. Fox Bot is designed, created, and is modified by Foxifly.

## Inquiries
If you have any questions about Fox Bot's operation or functionality, please reach out to me directly through [email](mailto:laciastko@gmail.com). 

