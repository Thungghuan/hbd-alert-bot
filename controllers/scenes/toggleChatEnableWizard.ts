import { Scenes } from 'telegraf'
import { getAllChats, toggleChatEnabledByID } from '../../models'

export const toggleChatEnableWizard = new Scenes.WizardScene(
  'toggle_chat_enable_wizard',
  async (ctx: any) => {
    const allChats = await getAllChats()

    let replyMSG = '| ID |  ChatID  | Enabled |\n'

    allChats.forEach((chat) => {
      replyMSG += `| ${chat.id} | ${chat.chatID} | ${
        chat.enabled ? '√' : 'x'
      } |\n`
    })

    replyMSG += '\nWhich chat you want to toggle?\nTell me the ID.\n'

    ctx.reply(replyMSG)
    return ctx.wizard.next()
  },
  async (ctx) => {
    const id = +ctx.message.text
    if ((await toggleChatEnabledByID(id)) !== null) {
      let replyMSG = 'OK, now the chat list: \n'

      const allChats = await getAllChats()

      allChats.forEach((chat) => {
        replyMSG += `${chat.id} ${chat.chatID} ${chat.enabled ? '√' : 'x'}\n`
      })

      ctx.reply(replyMSG)
    } else {
      ctx.reply(`Chat with ID ${id} not found.`)
    }
    return ctx.scene.leave()
  }
)
