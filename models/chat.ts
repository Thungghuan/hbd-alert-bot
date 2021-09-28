import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  getRepository
} from 'typeorm'
import { Birthday } from './birthday'

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  chatID!: string

  @Column()
  enabled!: Boolean

  @OneToMany(() => Birthday, (birthday) => birthday.chat)
  birthdays!: Birthday[]
}

export const createChat = async (chatID: string) => {
  const chatRepository = getRepository(Chat)
  if (
    !(await chatRepository.findOne({
      chatID
    }))
  ) {
    const chatObject = chatRepository.create({
      chatID,
      enabled: false,
      birthdays: []
    })
    await chatRepository.save(chatObject)
  }
}

export const getAllChats = async () => {
  const chatRepository = getRepository(Chat)
  return await chatRepository.find()
}

export const getAllEnabledChats = async () => {
  const chatRepository = getRepository(Chat)
  return await chatRepository.find({ enabled: true })
}

export const getChatStatus = async (chatID: string) => {
  const chatRepository = getRepository(Chat)
  return (await chatRepository.findOne({ chatID }))?.enabled
}

export const toggleChatEnabledByID = async (id: number) => {
  const chatRepository = getRepository(Chat)
  const chat = await chatRepository.findOne(id)

  if (chat) {
    await chatRepository.update(id, { enabled: !chat.enabled })
    return !chat.enabled
  } else {
    return null
  }
}

export const toggleChatEnabledByChatID = async (chatID: string) => {
  const chatRepository = getRepository(Chat)
  const chat = await chatRepository.findOne({ chatID })

  if (chat) {
    await chatRepository.update({ chatID }, { enabled: !chat.enabled })
    return !chat.enabled
  } else {
    return null
  }
}
