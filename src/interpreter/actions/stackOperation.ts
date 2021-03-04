import { emojiToClass } from '@/modules/emoji'
import { filterStack } from '@/modules/operation'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const pop: Action = (ip: Interpreter) => {
  const elm = ip.stack.popByState(ip.stackState)
  ip.garbageCan.pushAsNewElm(elm)
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

const swapN: Action = (ip: Interpreter) => {
  const x = ip.stack.popNumber()
  const ary = []
  // x - 1 回 pop
  for (let i = 0; i < x - 1; ++i) {
    ary.push(ip.stack.popByState(ip.stackState))
  }
  const elm = ip.stack.popByState(ip.stackState)

  // x - 1 回 push
  for (let i = 0; i < x - 1; ++i) {
    ip.stack.pushAsNewElm(ary.pop() ?? -1)
  }
  ip.stack.pushAsNewElm(elm)
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

const pushLength: Action = (ip: Interpreter) => {
  ip.stack.pushAsRaw(ip.stack.length)
}

const pushFromGarbage: Action = (ip: Interpreter) => {
  const elm = ip.garbageCan.popByState(ip.stackState)
  ip.stack.pushAsNewElm(elm)
  ip.garbageCan.clear()
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
    emoji: emojiToClass('🏗'),
    action: swapN,
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
  {
    emoji: emojiToClass('📐'),
    action: pushLength,
  },
  {
    emoji: emojiToClass('🗑️'),
    action: pushFromGarbage,
  },
]

export { stackActions }
