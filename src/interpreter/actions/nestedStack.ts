import { emojiToClass } from '@/modules/emoji'
import { Stack } from '@/modules/stack'

import { EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

const intoNestedStack = (ip: Interpreter): void => {
  const elm = ip.stack.pop()
  if (typeof elm === 'number') {
    // 数値だった場合、1要素の stack に変換してから行う
    const stack = new Stack(ip.stack)
    stack.pushAsNewElm(elm)
    ip.stack.pushAsRaw(stack)
    ip.stack = stack
  } else if (elm instanceof Stack) {
    ip.stack.pushAsRaw(elm)
    ip.stack = elm
  } else {
    throw Error('impossible error')
  }
}

const exitNestedStack = (ip: Interpreter): void => {
  if (ip.stack.parentStack === null) {
    // 親 stack がない場合は、この stack のみを要素とする
    // 新たな stack を作成し、それを親 stack とする。
    const stack = new Stack()
    ip.stack.parentStack = stack
    stack.pushAsRaw(ip.stack.parentStack)
    ip.rootStack = stack
  }
  // 親スタックを変更する
  ip.stack = ip.stack.parentStack
}

const gotoRootStack = (ip: Interpreter): void => {
  ip.stack = ip.rootStack
}

const openStack = (ip: Interpreter): void => {
  const elm = ip.stack.pop()
  // stack の場合、開いてもう1度 pop
  if (elm instanceof Stack) {
    ip.stack.openStackAndPush(elm)
  } else if (typeof elm === 'number') {
    ip.stack.pushAsRaw(elm)
  }
}

const changeStackMode = (ip: Interpreter): void => {
  if (ip.stackState === 'normal') {
    ip.stackState = 'stack'
  } else if (ip.stackState === 'stack') {
    ip.stackState = 'normal'
  }
}

/**
 * ネストしたスタック関連のアクション
 */
const nestedStackActions: EmojiAction[] = [
  {
    emoji: emojiToClass('📬'),
    action: intoNestedStack,
  },
  {
    emoji: emojiToClass('📫'),
    action: exitNestedStack,
  },
  {
    emoji: emojiToClass('📪'),
    action: gotoRootStack,
  },
  {
    emoji: emojiToClass('📭'),
    action: openStack,
  },
  {
    emoji: emojiToClass('📨'),
    action: changeStackMode,
  },
]

export { nestedStackActions }
