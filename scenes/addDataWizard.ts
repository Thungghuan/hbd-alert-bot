import { Scenes } from 'telegraf'

interface BirthdayData {
  name: string
  date: string
}

export const addDataWizard = new Scenes.WizardScene(
  'add_data',
  async (ctx: any) => {
    const replyMSG =
      '🥳 Send the birthday day list please.\n' +
      '📝 Format: NAME MM-DD,\n' +
      '     separated by a space or a newline\n'
    await ctx.reply(replyMSG)
    return ctx.wizard.next()
  },
  async (ctx) => {
    const textSplit: string[] = ctx.message.text.split(/[\s\n]/)
    const names = textSplit.filter((el, i) => i % 2 === 0)
    const dates = textSplit.filter((el, i) => i % 2 === 1)

    const birthdayData: BirthdayData[] = []
    names.forEach((name, i) => {
      const data: BirthdayData = {
        name,
        date: dates[i]
      }
      birthdayData.push(data)
    })

    let replyMSG = ''

    birthdayData.forEach((el) => {
      replyMSG += `${el.name} ${el.date}\n`
    })

    await ctx.reply(replyMSG)
    return ctx.scene.leave()
  }
)
