import { Telegraf, Scenes, session } from 'telegraf'
import { agent, serverStart } from './utils'
import {
  start,
  showAllChat,
  toggleChatEnable,
  showEnabledChat,
  addData,
  showData
} from './controllers'
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

bot.start(start)

bot.command('show_chat', showAllChat)

bot.command('toggle_chat_enable', toggleChatEnable)

bot.command('show_enabled_chat', showEnabledChat)

bot.help((ctx) => {})

bot.command('add_data', addData)

bot.command('show_data', showData)

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
