import { emojiToClass } from '@/modules/emoji'
import { Condition1, Condition2, elmOp1, elmOp2, NumOp1, NumOp2 } from '@/modules/operation'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

// pop して a > 0
const setDirIfPositive = (dirX: number, dirY: number): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.popNumber()
    if (a > 0) {
      ip.dirX = dirX
      ip.dirY = dirY
    }
  }
}

const pushCondition = (cond: Condition1): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.popByState(ip.stackState)
    const f: NumOp1 = (a: number) => (cond(a) ? 1 : 0)
    ip.stack.pushAsNewElm(elmOp1(f, a))
  }
}

const pushCondition2 = (cond: Condition2): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.popByState(ip.stackState)
    const b = ip.stack.popByState(ip.stackState)
    const f: NumOp2 = (a: number, b: number) => (cond(a, b) ? 1 : 0)
    ip.stack.pushAsNewElm(elmOp2(f, a, b))
  }
}

const equalTo: Condition2 = (a, b) => a == b
const greaterThan: Condition2 = (a, b) => a > b
const lessThan: Condition2 = (a, b) => a < b

const not: Condition1 = (a) => a <= 0
const fair: Condition1 = (a) => 60 <= a && a < 80
const passed: Condition1 = (a) => 60 <= a

/**
 * 条件分岐関連のアクション
 */
const conditionalActions: EmojiAction[] = [
  {
    emoji: emojiToClass('↪️'),
    action: setDirIfPositive(1, 0),
  },
  {
    emoji: emojiToClass('↩️'),
    action: setDirIfPositive(-1, 0),
  },
  {
    emoji: emojiToClass('⤴️'),
    action: setDirIfPositive(0, -1),
  },
  {
    emoji: emojiToClass('⤵️'),
    action: setDirIfPositive(0, 1),
  },
  {
    emoji: emojiToClass('📏'),
    action: pushCondition2(equalTo),
  },
  {
    emoji: emojiToClass('📈'),
    action: pushCondition2(greaterThan),
  },
  {
    emoji: emojiToClass('📉'),
    action: pushCondition2(lessThan),
  },
  {
    emoji: emojiToClass('❕'),
    action: pushCondition(not),
  },
  {
    emoji: emojiToClass('🉑'),
    action: pushCondition(fair),
  },
  {
    emoji: emojiToClass('🈴'),
    action: pushCondition(passed),
  },
]

export { conditionalActions }
