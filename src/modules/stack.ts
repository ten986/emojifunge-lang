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
  // 親のスタック
  parentStack: Stack | null

  innerStack: StackElm[]

  constructor(parentStack: Stack | null = null) {
    this.innerStack = []
    this.parentStack = parentStack
  }

  push(num: number): void {
    this.innerStack.push(num)
  }

  // 数値として pop する
  popNumber(): number {
    let elm: StackElm | null = null
    // 現在見てるstack
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let stack: Stack = this
    while (!(typeof elm === 'number')) {
      // pop したい要素
      elm = stack.innerStack[stack.innerStack.length - 1] ?? null
      // stack は [] であるので親のstackに戻って [] をpop
      if (elm === null) {
        // 起点の stack なら -1
        if (stack === this) {
          elm = -1
        } else {
          // 自身が起点の場合も -1
          // 通らないはず？
          if (stack.parentStack === null) {
            elm = -1
          } else {
            stack = stack.parentStack
            stack.innerStack.pop()
          }
        }
      } else if (elm instanceof Stack) {
        stack = elm
      }
    }
    return elm
  }

  // stack として pop する
  popStack(): StackElm {
    const elm = this.innerStack.pop() ?? -1
    if (typeof elm === 'number') {
      return elm
    }
    return elm
  }

  // 計算用に、スタックとして取り出す
  pop(state: StackState): StackElm {
    if (state === 'normal') {
      return this.popNumber()
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
    throw Error('not implement')
    // return median(this.innerStack)
  }

  // 上から何番目かのやつ
  sortRank(rank: number): number {
    throw Error('not implement')
    // return this.innerStack.sort((a, b) => b - a)?.[rank] ?? -1
  }
}

export { Stack }
