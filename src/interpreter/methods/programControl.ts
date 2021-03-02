import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../action'
import { Interpreter } from '../interpreter'

const endProgram: Action = (interpreter: Interpreter) => {
  interpreter.endState = 'end'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pass: Action = (_interpreter: Interpreter) => {}

const error = (str: string): Action => {
  return (interpreter: Interpreter) => {
    interpreter.error(str)
    interpreter.endState = 'end'
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
