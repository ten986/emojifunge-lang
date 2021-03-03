import { emojiToClass } from '@/modules/emoji'
import { elmOp1, elmOp2, NumOp1, NumOp2 } from '@/modules/stack'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const op2 = (op: NumOp2): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.popByState(ip.stackState)
    const b = ip.stack.popByState(ip.stackState)
    ip.stack.push(elmOp2(op, a, b))
  }
}

const op1 = (op: NumOp1): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.popByState(ip.stackState)
    ip.stack.push(elmOp1(op, a))
  }
}

const plus: NumOp2 = (a: number, b: number) => a + b
const minus: NumOp2 = (a: number, b: number) => a - b
const mult: NumOp2 = (a: number, b: number) => a * b
const div: NumOp2 = (a: number, b: number) => Math.floor(a / b)
const mod: NumOp2 = (a: number, b: number) => a % b

const factorial: NumOp1 = (num: number): number => {
  let res = 1
  for (let i = 1; i <= num; ++i) {
    res *= i
  }
  return res
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
    action: op1(factorial),
  },
]

export { calcActions }
