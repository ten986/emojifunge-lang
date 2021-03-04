import { emojify } from 'node-emoji'

import { codeUnitToEmoji, emojiToClass } from '@/modules/emoji'
import { ForeachOp1, foreachOp1 } from '@/modules/operation'

import { Action, EmojiAction } from '../actionTypes'
import { IgnoreOutputState, Interpreter } from '../interpreter'

const inputNumber: Action = (ip: Interpreter): void => {
  ip.stack.pushAsNewElm(+(ip.input.match(/-?\d+/) || [0])[0] || 0)
  ip.input = ip.input.replace(/^[^]*?\d+/, '')
}

const inputChar: Action = (ip: Interpreter): void => {
  ip.stack.pushAsNewElm(ip.input ? ip.input.charCodeAt(0) : -1)
  ip.input = ip.input.slice(1)
}

const outputNumber: ForeachOp1 = (num: number, ip: Interpreter): void => {
  ip.output(num.toString())
}

const outputChar: ForeachOp1 = (num: number, ip: Interpreter): void => {
  ip.output(String.fromCharCode(num))
}

const outputEmoji: Action = (ip: Interpreter): void => {
  ip.output(emojify(codeUnitToEmoji(ip.stack.pop()).emojiStr))
}

const cat: Action = (ip: Interpreter): void => {
  ip.output(ip.firstInput)
}

const dog: Action = (ip: Interpreter): void => {
  ip.output(ip.firstInput.split('').reverse().join(''))
}

const quine: Action = (ip: Interpreter): void => {
  ip.output(ip.rawFile)
}

const setIgnoreOutputState = (ignoreOutputState: IgnoreOutputState) => {
  return (ip: Interpreter): void => {
    ip.ignoreOutputState = ignoreOutputState
  }
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
    action: foreachOp1(outputNumber),
  },
  {
    emoji: emojiToClass('🔡'),
    action: foreachOp1(outputChar),
  },
  {
    emoji: emojiToClass('🔣'),
    action: outputEmoji,
  },
  {
    emoji: emojiToClass('🐱'),
    action: cat,
  },
  {
    emoji: emojiToClass('🐶'),
    action: dog,
  },
  {
    emoji: emojiToClass('📜'),
    action: quine,
  },
  {
    emoji: emojiToClass('🤐'),
    action: setIgnoreOutputState('ignore'),
  },
  {
    emoji: emojiToClass('🤮'),
    action: setIgnoreOutputState('normal'),
  },
]

export { inoutActions }
