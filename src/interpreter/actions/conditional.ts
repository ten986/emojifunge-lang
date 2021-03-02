import { emojiToClass } from '@/modules/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

// pop して a > 0
const setDirIfPositive = (dirX: number, dirY: number): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.pop()
    if (a > 0) {
      ip.dirX = dirX
      ip.dirY = dirY
    }
  }
}

type Condition2 = (a: number, b: number) => boolean

const pushCondition2 = (cond: Condition2): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.pop()
    const b = ip.stack.pop()
    ip.stack.push(cond(a, b) ? 1 : 0)
  }
}

const equalTo: Condition2 = (a, b) => a == b
const greaterThan: Condition2 = (a, b) => a > b
const lessThan: Condition2 = (a, b) => a < b

type Condition = (a: number) => boolean

const pushCondition = (cond: Condition): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.pop()
    ip.stack.push(cond(a) ? 1 : 0)
  }
}

const not: Condition = (a) => a <= 0
const fair: Condition = (a) => 60 <= a && a < 80
const passed: Condition = (a) => 60 <= a

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
