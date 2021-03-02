import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../action'
import { Interpreter } from '../interpreter'

const pushNumber = (num: number): Action => {
  return (interpreter: Interpreter) => {
    interpreter.stack.push(num)
  }
}

/**
 * 定数関連のアクション
 */
const pushNumberActions: EmojiAction[] = [
  {
    emoji: emojiToClass('0️⃣'),
    action: pushNumber(0),
  },
  {
    emoji: emojiToClass('1️⃣'),
    action: pushNumber(1),
  },
  {
    emoji: emojiToClass('2️⃣'),
    action: pushNumber(2),
  },
  {
    emoji: emojiToClass('3️⃣'),
    action: pushNumber(3),
  },
  {
    emoji: emojiToClass('4️⃣'),
    action: pushNumber(4),
  },
  {
    emoji: emojiToClass('5️⃣'),
    action: pushNumber(5),
  },
  {
    emoji: emojiToClass('6️⃣'),
    action: pushNumber(6),
  },
  {
    emoji: emojiToClass('7️⃣'),
    action: pushNumber(7),
  },
  {
    emoji: emojiToClass('8️⃣'),
    action: pushNumber(8),
  },
  {
    emoji: emojiToClass('9️⃣'),
    action: pushNumber(9),
  },
  {
    emoji: emojiToClass('🔟'),
    action: pushNumber(10),
  },
  {
    emoji: emojiToClass('🅰️'),
    action: pushNumber(65),
  },
  {
    emoji: emojiToClass('🅱️'),
    action: pushNumber(66),
  },
  {
    emoji: emojiToClass('©️'),
    action: pushNumber(67),
  },
  {
    emoji: emojiToClass('🅾️'),
    action: pushNumber(77),
  },
  {
    emoji: emojiToClass('Ⓜ️'),
    action: pushNumber(79),
  },
  {
    emoji: emojiToClass('🅿️'),
    action: pushNumber(80),
  },
  {
    emoji: emojiToClass('®️'),
    action: pushNumber(82),
  },
  {
    emoji: emojiToClass('💯'),
    action: pushNumber(100),
  },
]

export { pushNumberActions }
