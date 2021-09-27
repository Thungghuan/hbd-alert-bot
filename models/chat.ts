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

export const toggleChatEnabled = async (chatID: string) => {
  const chatRepository = getRepository(Chat)
  const chat = await chatRepository.findOne({ chatID })

  if (chat) {
    chat.enabled = !chat.enabled
    return chat.enabled
  } else {
    return null
  }
}
