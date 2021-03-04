import { emojiToClass } from '@/modules/emoji'
import { Stack } from '@/modules/stack'

import { EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const createEmptyStack = (ip: Interpreter): void => {
  const stack = new Stack()
  ip.stack.pushAsRaw(stack)
}

const createNewStack = (ip: Interpreter): void => {
  const num = ip.stack.popNumber()
  const stack = new Stack()
  for (let i = 0; i < num; ++i) {
    const elm = ip.stack.popByState(ip.stackState)
    stack.pushAsRaw(elm)
  }
  stack.reverse()
  ip.stack.pushAsRaw(stack)
}
/**
 * スタック作成関連のアクション
 */
const makeStackActions: EmojiAction[] = [
  {
    emoji: emojiToClass('📧'),
    action: createEmptyStack,
  },
  {
    emoji: emojiToClass('💌'),
    action: createNewStack,
  },
]

export { makeStackActions }
