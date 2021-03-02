import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const endProgram: Action = (ip: Interpreter) => {
  ip.endState = 'end'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pass: Action = (_: Interpreter) => {}

const error = (str: string): Action => {
  return (ip: Interpreter) => {
    ip.error(str)
    ip.endState = 'end'
  }
}

/**
 * 制御関連のアクション
 */
const programControlActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🔚'),
    action: endProgram,
  },
  {
    emoji: emojiToClass('⬜️'),
    action: pass,
  },
  {
    emoji: emojiToClass('⬛️'),
    action: error('pointer in wall'),
  },
]

export { programControlActions }
