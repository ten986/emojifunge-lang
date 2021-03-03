import { emojiToClass } from '@/modules/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const pushToMailbox: Action = (ip: Interpreter) => {
  const a = ip.stack.popByState(ip.stackState)
  ip.mailBox.push(a)
}

const popFromMailbox: Action = (ip: Interpreter) => {
  const a = ip.mailBox.popByState(ip.stackState)
  ip.stack.push(a)
}

/**
 * メールボックス関連のアクション
 */
const mailboxActions: EmojiAction[] = [
  {
    emoji: emojiToClass('📥'),
    action: pushToMailbox,
  },
  {
    emoji: emojiToClass('📤'),
    action: popFromMailbox,
  },
]

export { mailboxActions }
