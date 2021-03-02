import { emojiToClass } from '@/modules/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const inputNumber: Action = (ip: Interpreter): void => {
  ip.stack.push(+(ip.input.match(/-?\d+/) || [0])[0] || 0)
  ip.input = ip.input.replace(/^[^]*?\d+/, '')
}

const inputChar: Action = (ip: Interpreter): void => {
  ip.stack.push(ip.input ? ip.input.charCodeAt(0) : -1)
  ip.input = ip.input.slice(1)
}

const outputNumber: Action = (ip: Interpreter): void => {
  ip.output(ip.stack.popNumber().toString())
}

const outputChar: Action = (ip: Interpreter): void => {
  ip.output(String.fromCharCode(ip.stack.popNumber()))
}

const cat: Action = (ip: Interpreter): void => {
  ip.output(ip.firstInput)
}

const dog: Action = (ip: Interpreter): void => {
  ip.output(ip.firstInput.split('').reverse().join(''))
}

/**
 * 入力関連のアクション
 */
const inoutActions: EmojiAction[] = [
  {
    emoji: emojiToClass('ℹ️'),
    action: inputNumber,
  },
  {
    emoji: emojiToClass('🔤'),
    action: inputChar,
  },
  {
    emoji: emojiToClass('🔢'),
    action: outputNumber,
  },
  {
    emoji: emojiToClass('🔡'),
    action: outputChar,
  },
  {
    emoji: emojiToClass('🐱'),
    action: cat,
  },
  {
    emoji: emojiToClass('🐶'),
    action: dog,
  },
]

export { inoutActions }
