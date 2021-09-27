import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { Telegraf, Scenes, session } from 'telegraf'
import { agent, alertSchedule } from './utils'
import { start } from './controllers/start'
// import {
//   start,
//   showAllChat,
//   toggleChatEnable,
//   showEnabledChat,
//   addData,
//   showData,
//   alert
// } from './controllers'
// import { addDataWizard, toggleChatEnableWizard } from './scenes'

const token = process.env.BOT_TOKEN!

createConnection()
  .then((conn) => {
    const botOptions: Partial<
      Telegraf.Options<Scenes.WizardContext<Scenes.WizardSessionData>>
    > = {}

    if (process.env.BOT_ENV === 'development') {
      botOptions.telegram = {
        agent
      }
    }

    const bot = new Telegraf<Scenes.WizardContext>(token, botOptions)

    // const stage = new Scenes.Stage<Scenes.WizardContext>([
    //   addDataWizard,
    //   toggleChatEnableWizard
    // ])
    bot.use(session())
    // bot.use(stage.middleware())

    bot.command('test', (ctx) => {
      ctx.reply('Hello')
    })

    bot.start(start)

    // bot.command('show_chat', showAllChat)

    // bot.command('toggle_chat_enable', toggleChatEnable)

    // bot.command('show_enabled_chat', showEnabledChat)

    // bot.help((ctx) => {})

    // bot.command('add_data', addData)

    // bot.command('show_data', showData)

    // bot.command('alert', () => alert(bot))

    alertSchedule(() => alert(bot))

    bot.launch()

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  })
  .catch((err) => {
    console.log('Error: ', err)
  })
