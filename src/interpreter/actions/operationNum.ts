import { emojiToClass } from '@/modules/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const speedRun: Action = (ip: Interpreter) => {
  ip.operationNum.push(2)
}

const slot: Action = (ip: Interpreter) => {
  const a = ip.stack.popNumber()
  const b = ip.stack.popNumber()
  const c = ip.stack.popNumber()
  if (a == b && b == c) {
    ip.operationNum.push(7)
    ip.operationNum.push(7)
    ip.operationNum.push(7)
  }
}

const sleep: Action = (ip: Interpreter) => {
  ip.operationNum.push(0)
  ip.operationNum.push(0)
  ip.operationNum.push(0)
}

/**
 * 操作回数関連のアクション
 */
const operationNumActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🏃‍♀️'),
    action: speedRun,
  },
  {
    emoji: emojiToClass('🎰'),
    action: slot,
  },
  {
    emoji: emojiToClass('💤'),
    action: sleep,
  },
]

export { operationNumActions }
