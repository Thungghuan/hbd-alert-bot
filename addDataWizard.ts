import { Scenes } from 'telegraf'

export const addDataWizard = new Scenes.WizardScene(
  'add_data_wizard',
  (ctx: any) => {
    ctx.reply('What is your name?')
    ctx.wizard.state.data = {}
    return ctx.wizard.next()
  },
  (ctx) => {
    // validation example
    if (ctx.message.text.length < 2) {
      ctx.reply('Please enter name for real')
      return
    }
    ctx.wizard.state.data.name = ctx.message.text
    ctx.reply('Enter your e-mail')
    return ctx.wizard.next()
  },
  async (ctx) => {
    ctx.wizard.state.data.email = ctx.message.text
    ctx.reply("Thank you for your replies, we'll contact your soon")
    return ctx.scene.leave()
  }
)
