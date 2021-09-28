import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { Telegraf, Scenes, session } from 'telegraf'
import { agent, alertSchedule } from './utils'
import {
  start,
  toggleChatEnabled,
  addData,
  showData,
  alertInChat,
  showAllChat,
  addDataWizard,
  toggleChatEnableWizard,
  sendAlert
} from './controllers'

const token = process.env.BOT_TOKEN!

createConnection()
  .then(() => {
    const botOptions: Partial<
      Telegraf.Options<Scenes.WizardContext<Scenes.WizardSessionData>>
    > = {}

    if (process.env.BOT_ENV === 'development') {
      botOptions.telegram = {
        agent
      }
    }

    const bot = new Telegraf<Scenes.WizardContext>(token, botOptions)

    const stage = new Scenes.Stage<Scenes.WizardContext>([
      addDataWizard,
      toggleChatEnableWizard
    ])
    bot.use(session())
    bot.use(stage.middleware())

    // command for all user
    bot.start(start)
    // bot.help((ctx) => {})
    bot.command('toggle_chat_enable', toggleChatEnabled)
    bot.command('add_data', addData)
    bot.command('show_data', showData)
    bot.command('alert', alertInChat)

    // =================
    // command for admin
    bot.command('show_chat', showAllChat)
    // bot.command('show_enabled_chat', showEnabledChat)

    // =========
    // cron task
    alertSchedule(() => sendAlert(bot))

    bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  })
  .catch((err) => {
    console.log('Error: ', err)
  })
