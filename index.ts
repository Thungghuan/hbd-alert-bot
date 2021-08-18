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

bot.start((ctx) => {
  let replyMSG =
    "Hello, I'm HBD-alert-bot \n" +
    `Chat ID here is ${ctx.chat.id} \n` +
    `Chat type: ${ctx.chat.type} \n\n`

  if (ctx.chat.type === 'private') {
    const name = ctx.message.from.first_name + ctx.message.from?.last_name
    replyMSG += `Hello, ${name}!`
  } else {
    replyMSG += 'Hello everyone.'
  }

  ctx.reply(replyMSG)
})

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
