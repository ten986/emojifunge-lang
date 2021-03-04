import { emojiToClass } from '@/modules/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const setStepToStop = (num: number): Action => {
  return (ip: Interpreter) => {
    ip.stepToStop = num
  }
}

const timer = (ip: Interpreter): void => {
  const num = ip.stack.popNumber()
  ip.stepToStop = num
}

/**
 * 停止時間関連のアクション
 */
const stepToStopActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🚥'),
    action: setStepToStop(3),
  },
  {
    emoji: emojiToClass('⏲️'),
    action: timer,
  },
]

export { stepToStopActions }
