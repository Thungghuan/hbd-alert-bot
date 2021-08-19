import { Telegraf, Scenes, session } from 'telegraf'
import express from 'express'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { DB } from './database'
import { addDataWizard } from './addDataWizard'

const app = express()

const port = process.env.PORT || 9000

app.get('/', (req, res) => {
  res.send('HBD-alert-bot is here.')
})
app.listen(port)

const token = process.env.BOT_TOKEN!

const botOptions: Partial<
  Telegraf.Options<Scenes.WizardContext<Scenes.WizardSessionData>>
> = {}

if (process.env.BOT_ENV === 'development') {
  botOptions.telegram = {
    agent: new SocksProxyAgent({
      host: '127.0.0.1',
      port: '1086'
    })
  }
}

const bot = new Telegraf<Scenes.WizardContext>(token, botOptions)
const stage = new Scenes.Stage<Scenes.WizardContext>([addDataWizard])

bot.use(session())
bot.use(stage.middleware())

const dbName = 'data.db'

bot.start((ctx) => {
  let replyMSG =
    "Hello, I'm HBD-alert-bot \n" +
    "I'll show you whose birthday will come.\n" +
    `Chat ID here is ${ctx.chat.id} \n` +
    `Chat type: ${ctx.chat.type} \n\n`

  if (ctx.chat.type === 'private') {
    const name = ctx.message.from.first_name + ctx.message.from?.last_name
    replyMSG += `Hello, ${name}!`
  } else {
    replyMSG += 'Hello everyone.'
  }

  const db = new DB(dbName)
  const tableName = `Chat_${ctx.chat.id}`

  db.createDateTable(tableName)

  db.close()

  ctx.reply(replyMSG)
})

bot.help((ctx) => {})

bot.command('add_data', (ctx) => {
  ctx.scene.enter('add_data_wizard')
})

bot.command('hello', (ctx) => {
  const name = ctx.message.from.first_name + ctx.message.from?.last_name
  ctx.reply(`Hello, ${name}`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
