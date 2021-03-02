import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const setDir = (dirX: number, dirY: number): Action => {
  return (ip: Interpreter) => {
    ip.dirX = dirX
    ip.dirY = dirY
  }
}

const incDirX: Action = (ip: Interpreter) => {
  ip.dirX++
}
const decDirX: Action = (ip: Interpreter) => {
  ip.dirX--
}
const incDirY: Action = (ip: Interpreter) => {
  ip.dirY++
}
const decDirY: Action = (ip: Interpreter) => {
  ip.dirY--
}

/** 右回転 */
const rotateClockwise: Action = (ip: Interpreter) => {
  ;[ip.dirX, ip.dirY] = [-ip.dirY, ip.dirX]
}
/** 左回転 */
const rotateCounterclockwise: Action = (ip: Interpreter) => {
  ;[ip.dirX, ip.dirY] = [ip.dirY, -ip.dirX]
}

/**
 * 移動関連のアクション
 */
const moveActions: EmojiAction[] = [
  {
    emoji: emojiToClass('➡️'),
    action: setDir(1, 0),
  },
  {
    emoji: emojiToClass('⬅️'),
    action: setDir(-1, 0),
  },
  {
    emoji: emojiToClass('⬆️'),
    action: setDir(0, -1),
  },
  {
    emoji: emojiToClass('⬇️'),
    action: setDir(0, 1),
  },
  {
    emoji: emojiToClass('↗️'),
    action: setDir(1, -1),
  },
  {
    emoji: emojiToClass('↘️'),
    action: setDir(1, 1),
  },
  {
    emoji: emojiToClass('↖️'),
    action: setDir(-1, -1),
  },
  {
    emoji: emojiToClass('↙️'),
    action: setDir(-1, 1),
  },
  {
    emoji: emojiToClass('⏩'),
    action: incDirX,
  },
  {
    emoji: emojiToClass('⏪'),
    action: decDirX,
  },
  {
    emoji: emojiToClass('⏫'),
    action: incDirY,
  },
  {
    emoji: emojiToClass('⏬'),
    action: decDirY,
  },
  {
    emoji: emojiToClass('🔃'),
    action: rotateClockwise,
  },
  {
    emoji: emojiToClass('🔄'),
    action: rotateCounterclockwise,
  },
]

export { moveActions, rotateClockwise, rotateCounterclockwise }
