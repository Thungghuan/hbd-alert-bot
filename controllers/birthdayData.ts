import { Context, Scenes } from 'telegraf'
import { getChatBirthday } from '../models'

export const addData = (ctx: Scenes.WizardContext) => {
  ctx.scene.enter('add_data')
}

export const showData = async (ctx: Context) => {
  const birthdayData = await getChatBirthday('' + ctx.chat!.id)

  if (birthdayData.length === 0) {
    ctx.reply('No birthday date now\nUse command /add_data to add some.')
  } else {
    let replyMSG = 'ID Name Date\n'

    birthdayData.forEach((data) => {
      replyMSG += `${data.id} ${data.name} ${data.date}\n`
    })

    ctx.reply(replyMSG)
  }
}
