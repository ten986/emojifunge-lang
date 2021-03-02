import { emojiToClass } from '@/emoji'

import { Action, EmojiAction } from '../action'
import { Interpreter } from '../interpreter'

const pop: Action = (ip: Interpreter) => {
  ip.stack.pop()
}

const dup: Action = (ip: Interpreter) => {
  const a = ip.stack.pop()
  ip.stack.push(a)
  ip.stack.push(a)
}

const swap: Action = (ip: Interpreter) => {
  const a = ip.stack.pop()
  const b = ip.stack.pop()
  ip.stack.push(a)
  ip.stack.push(b)
}

const swap3: Action = (ip: Interpreter) => {
  const a = ip.stack.pop()
  const b = ip.stack.pop()
  const c = ip.stack.pop()
  ip.stack.push(b)
  ip.stack.push(a)
  ip.stack.push(c)
}

const reverse: Action = (ip: Interpreter) => {
  ip.stack.reverse()
}

const clear: Action = (ip: Interpreter) => {
  ip.stack.clear()
}

const r18: Action = (ip: Interpreter) => {
  ip.stack.r18()
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
