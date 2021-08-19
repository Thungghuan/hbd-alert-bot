import { Composer, Markup, Scenes, Telegraf } from 'telegraf'
import express from 'express'
import { DB } from './database'

const app = express()

const port = process.env.PORT || 9000

app.get('/', (req, res) => {
  res.send('HBD-alert-bot is here.')
})
app.listen(port)

const token = process.env.BOT_TOKEN!

const bot = new Telegraf<Scenes.WizardContext>(token)

const dbName = 'data.db'

const stepHandler = new Composer<Scenes.WizardContext>()
stepHandler.action('next', async (ctx) => {
  await ctx.reply('Step 2. Via inline button')
  return ctx.wizard.next()
})
stepHandler.command('next', async (ctx) => {
  await ctx.reply('Step 2. Via command')
  return ctx.wizard.next()
})
stepHandler.use((ctx) =>
  ctx.replyWithMarkdown('Press `Next` button or type /next')
)
const superWizard = new Scenes.WizardScene(
  'super-wizard',
  async (ctx) => {
    await ctx.reply(
      'Step 1',
      Markup.inlineKeyboard([
        Markup.button.url('❤️', 'http://telegraf.js.org'),
        Markup.button.callback('➡️ Next', 'next')
      ])
    )
    return ctx.wizard.next()
  },
  stepHandler,
  async (ctx) => {
    await ctx.reply('Step 3')
    return ctx.wizard.next()
  },
  async (ctx) => {
    await ctx.reply('Step 4')
    return ctx.wizard.next()
  },
  async (ctx) => {
    await ctx.reply('Done')
    return await ctx.scene.leave()
  }
)

const stage = new Scenes.Stage<Scenes.WizardContext>([superWizard], {
  default: 'super-wizard'
})

bot.use(stage.middleware())

bot.start((ctx) => {
  let replyMSG =
    "Hello, I'm HBD-alert-bot \n" +
    "I'll show you whose birthday will come." +
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

bot.command('hello', (ctx) => {
  const name = ctx.message.from.first_name + ctx.message.from?.last_name
  ctx.reply(`Hello, ${name}`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
