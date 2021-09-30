# hbd-alert-bot
A telegram bot that alerts you whose birthday is coming. The bot is here [hbd_alert_bot](http://t.me/hbd_alert_bot), ~~deployed on [Heroku](https://heroku.com/)~~, now I deployed it on my own RaspberryPi.



## Feature

* Telegram bot using [telegraf](https://github.com/telegraf/telegraf), written in TypeScript.
* Database support using MySQL with [Typeorm](https://github.com/typeorm/typeorm)
* Alert periodically, using [node-cron](https://github.com/node-cron/node-cron), based on GNU crontab.
* Date calculation using [day.js](https://day.js.org/).
* Configurable. Set the timezone, alert schedule, mysql configuration and debug proxy freely.
* Tell you whose birthday is already today, or in 3 days, or will be in this week.



## Run the bot yourself

1. Clone the repo

   ```shell
   git clone https://github.com/Thungghuan/hbd-alert-bot.git
   ```

2. Install dependencies, and modify the [config file](config/index.ts)

   ```shell
   cd hbd-alert-bot
   npm i
   cp config/index.example.ts config/index.ts
   vim config/index.ts
   ```

3. Remember to set your own token in the configure file

   ```ts
   export default {
      BOT_TOKEN: '<bot token here>'
   }
   ```

4. BTW, notice that your schedule should be set refer to UTC time.

5. Run the bot

   ```shell
   npm run start
   ```

## Build the bot using Docker

- Using docker-compose
   ```shell
   docker-compose up
   ```

- Or you can build the image and run
   

## TODO

* Add validation when add birthday data.
* Make the alert message more detailed, maybe some words like **tomorrow**, **Next Monday** etc.
* Make birthday alert more configurable.
* Make a tool to format the output message.



## Why the bot?

Have you ever forget someone's birthday? This bot is created to alert you so you won't realize someone's birthday was just pasted, and regretfully tell him or her happy birthday for next year in advance🤪.

I have got a duty to send a hbd message in a wechat group these days, but I usually forget it, so I make this bot, and I wish this bot would help me remember it. Actually making a bot is so fun:)

Wish you have fun making your own bot too.
