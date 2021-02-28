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
}

export { Stack }
