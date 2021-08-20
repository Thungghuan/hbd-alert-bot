import { Telegraf, Scenes, session } from 'telegraf'
import { DB } from './database'
import { agent } from './utils/socksProxy'
import { serverStart } from './utils/server'
import { addDataWizard, toggleChatEnableWizard } from './scenes'

const token = process.env.BOT_TOKEN!

const botOptions: Partial<
  Telegraf.Options<Scenes.WizardContext<Scenes.WizardSessionData>>
> = {}

if (process.env.BOT_ENV === 'development') {
  botOptions.telegram = {
    agent
  }
} else if (process.env.BOT_ENV === 'heroku') {
  serverStart()
}

const bot = new Telegraf<Scenes.WizardContext>(token, botOptions)

const stage = new Scenes.Stage<Scenes.WizardContext>([
  addDataWizard,
  toggleChatEnableWizard
])
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
  db.createChatTable(tableName, '' + ctx.chat.id)

  db.close()

  ctx.reply(replyMSG)
})

bot.command('show_chat', (ctx) => {
  const db = new DB(dbName)

  db.getAllChatID((rows) => {
    let replyMSG = 'ID ChatID  Enabled\n'

    rows.forEach((row) => {
      replyMSG += `${row.id} ${row.chatID} ${row.enabled === 1 ? '✅' : '❌'}\n`
    })

    ctx.reply(replyMSG)
  })
})

bot.command('toggle_chat_enable', (ctx) => {
  ctx.scene.enter('toggle_chat_enable')
})

bot.command('all_enabled_chat', (ctx) => {
  const db = new DB(dbName)

  db.getAllEnabledChatID((rows) => {
    if (rows.length === 0) {
      ctx.reply(
        'No chat is enabled\nUse command /toggle_chat_enable to enable one.'
      )
    } else {
      let replyMSG = 'ID ChatID  Enabled\n'

      rows.forEach((row) => {
        replyMSG += `${row.id} ${row.chatID} ${
          row.enabled === 1 ? '✅' : '❌'
        }\n`
      })

      ctx.reply(replyMSG)
    }
  })
})

bot.help((ctx) => {})

bot.command('add_data', (ctx) => {
  ctx.scene.enter('add_data')
})

bot.command('hello', (ctx) => {
  const name = ctx.message.from.first_name + ctx.message.from?.last_name
  ctx.reply(`Hello, ${name}`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
