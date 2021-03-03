import { median } from 'mathjs'

import { StackState } from '@/interpreter/interpreter'

import { filterStack, spreadStack } from './operation'

/** スタックの要素 */
type StackElm = number | Stack

class Stack {
  // 親のスタック
  parentStack: Stack | null

  innerStack: StackElm[]

  constructor(parentStack: Stack | null = null) {
    this.innerStack = []
    this.parentStack = parentStack
  }

  get isEmpty(): boolean {
    return this.innerStack.length == 0
  }

  push(elm: StackElm): void {
    this.innerStack.push(elm)
  }

  // 通常モード時の pop
  popNumber(): number {
    let elm = this.innerStack.pop() ?? -1
    // stack の場合、開いてもう1度 pop
    while (elm instanceof Stack) {
      elm.reverse()
      while (!elm.isEmpty) {
        this.push(elm.pop())
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

  r18(): void {
    this.innerStack = filterStack((num) => num >= 18, this.innerStack)
  }

  clear(): void {
    this.innerStack = []
  }

  get length(): number {
    return this.innerStack.length
  }

  median(): number {
    return median(spreadStack(this.innerStack))
  }

  // 上から何番目かのやつ
  sortRank(rank: number): number {
    return spreadStack(this.innerStack).sort((a, b) => b - a)?.[rank] ?? -1
  }
}

export { Stack }
export type { StackElm }
