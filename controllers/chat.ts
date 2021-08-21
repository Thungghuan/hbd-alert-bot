import { Context, Scenes } from 'telegraf'
import { DB } from '../database'

export const showAllChat = (ctx: Context) => {
  const db = new DB()

  db.getAllChatID((rows) => {
    let replyMSG = 'ID ChatID  Enabled\n'

    rows.forEach((row) => {
      replyMSG += `${row.id} ${row.chatID} ${row.enabled === 1 ? '✅' : '❌'}\n`
    })

    ctx.reply(replyMSG)
  })
}

export const toggleChatEnable = (ctx: Scenes.WizardContext) => {
  ctx.scene.enter('toggle_chat_enable')
}

export const showEnabledChat = (ctx: Context) => {
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
}
