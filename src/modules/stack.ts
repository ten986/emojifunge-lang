import { median } from 'mathjs'

class Stack {
  stack: number[]

  constructor() {
    this.stack = []
  }

  push(num: number): void {
    this.stack.push(num)
  }

  pop(): number {
    return this.stack.pop() ?? -1
  }

  reverse(): void {
    this.stack = this.stack.reverse()
  }

  r18(): void {
    this.stack = this.stack.filter((num) => num >= 18)
  }

  clear(): void {
    this.stack = []
  }

  get length(): number {
    return this.stack.length
  }

  median(): number {
    return median(this.stack)
  }

  // 上から何番目かのやつ
  sortRank(rank: number): number {
    return this.stack.sort((a, b) => b - a)?.[rank] ?? -1
  }
}

export { Stack }
