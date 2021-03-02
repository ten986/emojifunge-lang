import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../action'
import { Interpreter } from '../interpreter'

const inputNumber: Action = (interpreter: Interpreter): void => {
  interpreter.stack.push(+(interpreter.input.match(/-?\d+/) || [0])[0] || 0)
  interpreter.input = interpreter.input.replace(/^[^]*?\d+/, '')
}

const inputChar: Action = (interpreter: Interpreter): void => {
  interpreter.stack.push(interpreter.input ? interpreter.input.charCodeAt(0) : -1)
  interpreter.input = interpreter.input.slice(1)
}

const outputNumber: Action = (interpreter: Interpreter): void => {
  interpreter.output(interpreter.stack.pop().toString())
}

const outputChar: Action = (interpreter: Interpreter): void => {
  interpreter.output(String.fromCharCode(interpreter.stack.pop()))
}

const cat: Action = (interpreter: Interpreter): void => {
  interpreter.output(interpreter.firstInput)
}

const dog: Action = (interpreter: Interpreter): void => {
  interpreter.output(interpreter.firstInput.split('').reverse().join(''))
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
