import { emojiToClass } from '@/modules/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const speedRun: Action = (ip: Interpreter) => {
  ip.operationNum.pushAsNewElm(2)
}

const slot: Action = (ip: Interpreter) => {
  const a = ip.stack.popNumber()
  const b = ip.stack.popNumber()
  const c = ip.stack.popNumber()
  if (a == b && b == c) {
    ip.operationNum.pushAsNewElm(7)
    ip.operationNum.pushAsNewElm(7)
    ip.operationNum.pushAsNewElm(7)
  }
}

const sleep: Action = (ip: Interpreter) => {
  ip.operationNum.pushAsNewElm(0)
  ip.operationNum.pushAsNewElm(0)
  ip.operationNum.pushAsNewElm(0)
}

const timeManipulation: Action = (ip: Interpreter) => {
  const elm = ip.stack.popByState(ip.stackState)
  ip.operationNum.pushAsNewElm(elm)
}

const infinityLoop: Action = (ip: Interpreter) => {
  ip.operationNum.pushAsNewElm(Infinity)
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
  {
    emoji: emojiToClass('🕰'),
    action: timeManipulation,
  },
  {
    emoji: emojiToClass('➿'),
    action: infinityLoop,
  },
]

export { operationNumActions }
