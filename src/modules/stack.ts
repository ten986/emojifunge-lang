import { Guid } from 'guid-typescript'

import { Interpreter, StackState } from '@/interpreter/interpreter'

import { deepCopy } from './operation'

/** スタックの要素 */
type StackElm = number | Stack

class Stack {
  // 親のスタック
  parentStack: Stack | null

  innerStack: StackElm[]

  // unique な id
  id: Guid

  constructor(parentStack: Stack | null = null) {
    this.innerStack = []
    this.parentStack = parentStack
    this.id = Guid.create()
  }

  get isEmpty(): boolean {
    return this.innerStack.length == 0
  }

  // スタックの一致判定
  isEqual(stack: Stack): boolean {
    return this.id.toString() == stack.id.toString()
  }

  // push する。 Stack は deepCopyをとる。
  pushAsNewElm(elm: StackElm): void {
    if (elm instanceof Stack) {
      const stack = deepCopy(elm)
      stack.parentStack = this
      this.innerStack.push(stack)
    } else if (typeof elm === 'number') {
      this.innerStack.push(elm)
    }
  }

  // push する deepCopy もしない
  pushAsRaw(elm: StackElm): void {
    this.innerStack.push(elm)
  }

  // 通常モード時の pop
  popNumber(): number {
    let elm = this.innerStack.pop() ?? -1
    // stack の場合、開いてもう1度 pop
    while (elm instanceof Stack) {
      elm.reverse()
      while (!elm.isEmpty) {
        this.pushAsNewElm(elm.pop())
      }
      elm = this.innerStack.pop() ?? -1
    }
    return elm
  }

  // ふつうに pop する スタックモード時
  pop(): StackElm {
    const elm = this.innerStack.pop() ?? -1
    return elm
  }

  // state に応じて pop
  popByState(state: StackState): StackElm {
    if (state === 'normal') {
      return this.popNumber()
    }
    if (state === 'stack') {
      return this.pop()
    }
    throw Error()
  }

  reverse(): void {
    this.innerStack = this.innerStack.reverse()
  }

  clear(): void {
    this.innerStack = []
  }

  get length(): number {
    return this.innerStack.length
  }

  getDebugOutput(ip: Interpreter, tab = 1): string {
    let str = ''
    if (this.isEqual(ip.stack)) {
      str += '*'
    }
    str += '['
    if (this.innerStack.length != 0) {
      str += '\n' + '  '.repeat(tab)
      for (let i = this.innerStack.length - 1; i >= 0; --i) {
        const elm = this.innerStack[i]
        if (typeof elm === 'number') {
          str += elm
        }
        if (elm instanceof Stack) {
          str += elm.getDebugOutput(ip, tab + 1)
        }
        if (i != 0) {
          str += ', '
        }
      }
      str += '\n' + '  '.repeat(tab - 1)
    }
    str += ']'
    if (this.isEqual(ip.stack)) {
      str += '*'
    }
    return str
  }
}

export { Stack }
export type { StackElm }
