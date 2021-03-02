import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const pushToMailbox: Action = (ip: Interpreter) => {
  const a = ip.stack.pop()
  ip.mailBox.push(a)
}

const popFromMailbox: Action = (ip: Interpreter) => {
  const a = ip.mailBox.pop()
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
