import { emojiToClass } from '@/modules/emoji'
import { Stack } from '@/modules/stack'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const pickEmoji: Action = (ip: Interpreter) => {
  const px = ip.x + ip.dirX
  const py = ip.y + ip.dirY
  const emoji = ip.board.getEmoji(px, py)
  if (emoji === undefined) {
    throw Error('picked not exist emoji')
  }
  const stack = new Stack(ip.stack)
  stack.innerStack = emoji.codeUnit
  ip.stack.pushAsNewElm(stack)
  ip.operationNum.pushAsNewElm(0)
}

const pickBackEmoji: Action = (ip: Interpreter) => {
  const px = ip.x - ip.dirX
  const py = ip.y - ip.dirY
  const emoji = ip.board.getEmoji(px, py)
  if (emoji === undefined) {
    throw Error('picked not exist emoji')
  }
  const stack = new Stack(ip.stack)
  stack.innerStack = emoji.codeUnit
  ip.stack.pushAsNewElm(stack)
}

/**
 * 盤面の絵文字関連のアクション
 */
const emojiPickActions: EmojiAction[] = [
  {
    emoji: emojiToClass('👀'),
    action: pickEmoji,
  },
  {
    emoji: emojiToClass('🤳'),
    action: pickBackEmoji,
  },
]

export { emojiPickActions }
