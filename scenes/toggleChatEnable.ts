import { Scenes } from 'telegraf'
import { DB } from '../database'

export const toggleChatEnableWizard = new Scenes.WizardScene(
  'toggle_chat_enable',
  (ctx: any) => {
    const db = new DB('data.db')

    db.getAllChatID((rows) => {
      let replyMSG = 'The chat list: \n'

      rows.forEach((row) => {
        replyMSG += `${row.id} ${row.chatID} ${
          row.enabled === 1 ? '✅' : '❌'
        }\n`
      })

      replyMSG += 'Which chat you want to toggle?\nTell me the ID.\n'

      ctx.reply(replyMSG)

      db.close()
    })
    return ctx.wizard.next()
  },
  async (ctx) => {
    const db = new DB('data.db')
    const id = +ctx.message.text
    await db.toggleChanIDAlert(id, () => {
      db.getAllChatID((rows) => {
        let replyMSG = 'Now the chat list: \n'

        rows.forEach((row) => {
          replyMSG += `${row.id} ${row.chatID} ${
            row.enabled === 1 ? '✅' : '❌'
          }\n`
        })

        ctx.reply(replyMSG)

        db.close()
      })
      return ctx.scene.leave()
    })
  }
)