import { median } from 'mathjs'

import { StackState } from '@/interpreter/interpreter'

/** スタックの要素 */
type StackElm = number | Stack

// 1 -> [1]
const convertNumberTo1ElmStack = (num: number): Stack => {
  const stack = new Stack()
  stack.push(num)
  return stack
}

class Stack {
  innerStack: StackElm[]

  constructor() {
    this.innerStack = []
  }

  push(num: number): void {
    this.innerStack.push(num)
  }

  // 数値として pop する
  popNumber(): number {
    let elm: StackElm | null = null
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let stack: Stack | null = this
    while (!(typeof elm === 'number')) {
      elm = stack.innerStack.pop() ?? -1
      if (elm instanceof Stack) {
        stack = elm
      }
    }
    return elm
  }

  // stack として pop する
  popStack(): Stack {
    const elm = this.innerStack.pop() ?? -1
    if (typeof elm === 'number') {
      return convertNumberTo1ElmStack(elm)
    }
    return elm
  }

  // 計算用に、スタックとして取り出す
  pop(state: StackState): Stack {
    if (state === 'normal') {
      return convertNumberTo1ElmStack(this.popNumber())
    }
    if (state === 'stack') {
      return this.popStack()
    }
    throw new Error()
  }

  reverse(): void {
    this.innerStack = this.innerStack.reverse()
  }

  r18(): void {
    this.innerStack = this.innerStack.filter((num) => num >= 18)
  }

  clear(): void {
    this.innerStack = []
  }

  get length(): number {
    return this.innerStack.length
  }

  median(): number {
    return median(this.innerStack)
  }

  // 上から何番目かのやつ
  sortRank(rank: number): number {
    return this.innerStack.sort((a, b) => b - a)?.[rank] ?? -1
  }
}

export { Stack }
