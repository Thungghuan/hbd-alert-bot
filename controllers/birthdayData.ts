import { Context, Scenes } from 'telegraf'
import { DB } from '../database'

export const addData = (ctx: Scenes.WizardContext) => {
  ctx.scene.enter('add_data')
}

export const showData = (ctx: Context) => {
  const db = new DB()
  const tableName = `Chat_${ctx.chat!.id}`

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
}
