import { Telegraf } from 'telegraf'
import express from 'express'

const app = express()

const port = process.env.PORT || 9000

app.get('/', (req, res) => {
  res.send('HBD-alert-bot is here.')
})
app.listen(port)

const token = process.env.BOT_TOKEN!

const bot = new Telegraf(token)

bot.start((ctx) => ctx.reply("Hello, I'm hbd_alert_bot"))

bot.help((ctx) => {
  ctx.reply("I'll show you whose birthday will come.")
})

bot.command('hello', (ctx) => {
  const name = ctx.message.from.first_name + ctx.message.from?.last_name
  ctx.reply(`Hello, ${name}`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
