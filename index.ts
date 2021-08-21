import { Telegraf, Scenes, session } from 'telegraf'
import { DB } from './database'
import { agent, serverStart } from './utils'
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

  const db = new DB()
  const tableName = `Chat_${ctx.chat.id}`

  db.createDateTable(tableName)
  db.createChatTable(tableName, '' + ctx.chat.id)

  db.close()

  ctx.reply(replyMSG)
})

bot.command('show_chat', (ctx) => {
  const db = new DB()

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
  const db = new DB()

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

bot.command('show_data', (ctx) => {
  const db = new DB()
  const tableName = `Chat_${ctx.chat.id}`

  db.getAllBirthdayData(tableName, (rows) => {
    if (rows.length === 0) {
      ctx.reply('No birthday date now\nUse command /add_data to add some.')
    } else {
      let replyMSG = 'ID Name Date\n'

      rows.forEach((row) => {
        replyMSG += `${row.id} ${row.name} ${row.date}\n`
      })

      ctx.reply(replyMSG)
    }
  })

  db.close()
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
