# hbd-alert-bot
A telegram bot that alerts you whose birthday is coming. The bot is here [hbd_alert_bot](http://t.me/hbd_alert_bot), deployed on [Heroku](https://heroku.com/).



## Feature

* Telegram bot using [telegraf](https://github.com/telegraf/telegraf), written in TypeScript.
* Alert periodically, using [node-cron](https://github.com/node-cron/node-cron), based on GNU crontab.
* Date calculation using [day.js](https://day.js.org/).
* Configable. Set the timezone, alert schedule and debug proxy freely.
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
   vim config/index.ts
   ```

3. Set environment variable `BOT_TOKEN`

   ```shell
   export BOT_TOKEN=your_bot_token
   ```

4. Run the script

   ```shell
   // development
   npm run dev
   
   // production
   npm run start
   ```

   

## TODO

* Change database support from `SQLite` to other database due to Heroku [doesn't provide sqlite support](https://devcenter.heroku.com/articles/sqlite3).
* Add validation when add birthday data.
* Make the alert message more detailed, maybe some words like **tomorrow**, **Next Monday** etc.
* Make birthday alert more configable.



## Why the bot?

Have you ever forget someone's birthday? This bot is created to alert you so you won't realize someone's birthday was just pasted, and regretfully tell him or her happy birthday for next year in advance🤪.

I have got a duty to send a hbd message in a wechat group these days, but I usually forget it, so I make this bot, and I wish this bot would help me remember it. Actually making a bot is so fun:)

Wish you have fun making your own bot too.
