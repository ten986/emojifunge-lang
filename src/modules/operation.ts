import { Action } from '@/interpreter/actionTypes'
import { Interpreter } from '@/interpreter/interpreter'

import { Stack, StackElm } from './stack'

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
type Condition2 = (a: number, b: number) => boolean
type Condition1 = (a: number) => boolean

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

const op2 = (op: NumOp2): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.popByState(ip.stackState)
    const b = ip.stack.popByState(ip.stackState)
    ip.stack.push(elmOp2(op, a, b))
  }
}

const op1 = (op: NumOp1): Action => {
  return (ip: Interpreter) => {
    const a = ip.stack.popByState(ip.stackState)
    ip.stack.push(elmOp1(op, a))
  }
}

// stackを開く
const spreadStack = (stack: StackElm[]): number[] => {
  const res: number[] = []
  const f = (stack: StackElm[], res: number[]) => {
    stack.reverse()
    while (stack.length > 0) {
      const elm = stack.pop()
      if (elm === undefined) {
        throw Error('impossible error')
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
// なお、これで deepcopyができる
const filterStack = (filter: Condition1, stack: Stack): Stack => {
  const res: Stack = new Stack()
  stack.reverse()
  while (stack.length > 0) {
    const elm = stack.pop()
    if (elm === undefined) {
      throw Error('impossible error')
    }
    if (typeof elm === 'number') {
      if (filter(elm)) {
        res.push(elm)
      }
    } else {
      res.push(filterStack(filter, elm))
    }
  }
  // プロパティをコピー
  res.copyPropertyFrom(stack)
  return res
}

// innerStack の deepCopy をして返す
const deepCopy = (stack: Stack): Stack => {
  return filterStack(() => true, stack)
}

export { elmOp2, elmOp1, spreadStack, filterStack, op2, op1, deepCopy }
export type { NumOp1, NumOp2, Condition1, Condition2 }
