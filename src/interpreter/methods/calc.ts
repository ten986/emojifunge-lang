import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../action'
import { Interpreter } from '../interpreter'

type Op2 = (a: number, b: number) => number

const op2 = (op: Op2): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.pop()
    const b = ip.stack.pop()
    ip.stack.push(op(a, b))
  }
}

const plus: Op2 = (a: number, b: number) => a + b
const minus: Op2 = (a: number, b: number) => a - b
const mult: Op2 = (a: number, b: number) => a * b
const div: Op2 = (a: number, b: number) => Math.floor(a / b)
const mod: Op2 = (a: number, b: number) => a % b

const factorial: Action = (ip: Interpreter) => {
  const a = ip.stack.pop()
  let res = 1
  for (let i = 1; i <= a; ++i) {
    res *= i
  }
  ip.stack.push(res)
}

/**
 * 計算関連のアクション
 */
const calcActions: EmojiAction[] = [
  {
    emoji: emojiToClass('➕'),
    action: op2(plus),
  },
  {
    emoji: emojiToClass('➖'),
    action: op2(minus),
  },
  {
    emoji: emojiToClass('✖️'),
    action: op2(mult),
  },
  {
    emoji: emojiToClass('➗'),
    action: op2(div),
  },
  {
    emoji: emojiToClass('🈹'),
    action: op2(mod),
  },
  {
    emoji: emojiToClass('❗️'),
    action: factorial,
  },
]

export { calcActions }
