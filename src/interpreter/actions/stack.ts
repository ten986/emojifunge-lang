import { emojiToClass } from '@/modules/emoji'
import { filterStack } from '@/modules/operation'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const pop: Action = (ip: Interpreter) => {
  ip.stack.popByState(ip.stackState)
}

const dup: Action = (ip: Interpreter) => {
  const a = ip.stack.popByState(ip.stackState)
  ip.stack.pushAsNewElm(a)
  ip.stack.pushAsNewElm(a)
}

const swap: Action = (ip: Interpreter) => {
  const a = ip.stack.popByState(ip.stackState)
  const b = ip.stack.popByState(ip.stackState)
  ip.stack.pushAsNewElm(a)
  ip.stack.pushAsNewElm(b)
}

const swap3: Action = (ip: Interpreter) => {
  const a = ip.stack.popByState(ip.stackState)
  const b = ip.stack.popByState(ip.stackState)
  const c = ip.stack.popByState(ip.stackState)
  ip.stack.pushAsNewElm(b)
  ip.stack.pushAsNewElm(a)
  ip.stack.pushAsNewElm(c)
}

const reverse: Action = (ip: Interpreter) => {
  ip.stack.reverse()
}

const clear: Action = (ip: Interpreter) => {
  ip.stack.clear()
}

const r18: Action = (ip: Interpreter) => {
  ip.stack = filterStack((num: number) => num >= 18, ip.stack)
}

/**
 * スタック関連のアクション
 */
const stackActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🚮'),
    action: pop,
  },
  {
    emoji: emojiToClass('💕'),
    action: dup,
  },
  {
    emoji: emojiToClass('💞'),
    action: swap,
  },
  {
    emoji: emojiToClass('♻️'),
    action: swap3,
  },
  {
    emoji: emojiToClass('🙃'),
    action: reverse,
  },
  {
    emoji: emojiToClass('🎆'),
    action: clear,
  },
  {
    emoji: emojiToClass('🔞'),
    action: r18,
  },
]

export { stackActions }
