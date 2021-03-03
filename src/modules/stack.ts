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

const converElmToStack = (elm: StackElm): Stack => {
  if (typeof elm === 'number') {
    return convertNumberTo1ElmStack(elm)
  }
  return elm
}

type NumOp2 = (a: number, b: number) => number
type NumOp1 = (a: number) => number
type IfOp1 = (a: number) => boolean

// 2個受け取って1個返すやつ
const elmOp2 = (func: NumOp2, elm1: StackElm, elm2: StackElm): StackElm => {
  // どっちも数値の場合ただ演算
  if (typeof elm1 === 'number' && typeof elm2 === 'number') {
    return func(elm1, elm2)
  }
  // スタックに変換
  const stack1 = converElmToStack(elm1)
  const stack2 = converElmToStack(elm2)
  stack1.reverse()
  stack2.reverse()
  const res = new Stack()
  while (!stack1.isEmpty && !stack2.isEmpty) {
    const elm = elmOp2(func, stack1.pop(), stack2.pop())
    res.push(elm)
  }
  return res
}

// 1個受け取って1個返すやつ
const elmOp1 = (func: NumOp1, elm: StackElm): StackElm => {
  // 数値の場合ただ演算
  if (typeof elm === 'number') {
    return func(elm)
  }
  // スタックに変換
  const stack = converElmToStack(elm)
  stack.reverse()
  const res = new Stack()
  while (!stack.isEmpty) {
    const elm = elmOp1(func, stack.pop())
    res.push(elm)
  }
  return res
}

// stackを開く
const spreadStack = (stack: StackElm[]): number[] => {
  const res: number[] = []
  const f = (stack: StackElm[], res: number[]) => {
    stack.reverse()
    while (stack.length > 0) {
      const elm = stack.pop()
      if (elm === undefined) {
        return Error('impossible error')
      }
      if (typeof elm === 'number') {
        res.push(elm)
      } else {
        f(elm.innerStack, res)
      }
    }
  }
  f(stack, res)
  return res
}

// stack を filter して返す
const filterStack = (filter: IfOp1, stack: StackElm[]): StackElm[] => {
  const res: StackElm[] = []
  const f = (filter: IfOp1, stack: StackElm[], res: StackElm[]) => {
    stack.reverse()
    while (stack.length > 0) {
      const elm = stack.pop()
      if (elm === undefined) {
        return Error('impossible error')
      }
      if (typeof elm === 'number') {
        if (filter(elm)) {
          res.push(elm)
        }
      } else {
        f(filter, elm.innerStack, res)
      }
    }
  }
  f(filter, stack, res)
  return res
}

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

export { Stack, elmOp2, elmOp1 }
export type { NumOp2, NumOp1 }
