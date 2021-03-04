import { emojiToClass } from '@/modules/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const endProgram: Action = (ip: Interpreter) => {
  if (ip.ignoreEndState != 'ignore') {
    ip.endState = 'end'
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pass: Action = (_: Interpreter) => {}

const error = (str: string): Action => {
  return (ip: Interpreter) => {
    ip.error(str)
    ip.endState = 'end'
  }
}

const changeIgnoreEndState = (ip: Interpreter): void => {
  if (ip.ignoreEndState === 'normal') {
    ip.ignoreEndState = 'ignore'
  } else if (ip.ignoreEndState === 'ignore') {
    ip.ignoreEndState = 'normal'
  }
}

const rideBicycle = (ip: Interpreter): void => {
  if (ip.rideState === 'bicycle') {
    ip.rideState = 'off'
  } else {
    ip.rideState = 'bicycle'
  }
}

const stopBicycle: Action = (ip: Interpreter) => {
  if (ip.rideState === 'bicycle') {
    ip.error('pointer in bicycle stop')
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
    emoji: emojiToClass('🏁'),
    action: pass,
  },
  {
    emoji: emojiToClass('🏪'),
    action: changeIgnoreEndState,
  },
  {
    emoji: emojiToClass('⬛️'),
    action: error('pointer in wall'),
  },
  {
    emoji: emojiToClass('💥'),
    action: error('program crashed successfully'),
  },
  {
    emoji: emojiToClass('🚲'),
    action: rideBicycle,
  },
  {
    emoji: emojiToClass('🚳'),
    action: stopBicycle,
  },
]

export { programControlActions }
