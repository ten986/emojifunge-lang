import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../action'
import { Interpreter } from '../interpreter'

/** [min, min+range) */
const pushRandomNumber = (range: number, min: number): Action => {
  return (ip: Interpreter) => {
    ip.stack.push(Math.floor(Math.random() * range) + min)
  }
}

/**
 * 乱数関連のアクション
 */
const randomActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🎲'),
    action: pushRandomNumber(6, 1),
  },
  {
    emoji: emojiToClass('🤞'),
    action: pushRandomNumber(2, 0),
  },
]

export { randomActions }
