class Stack {
  stack: number[]

  constructor() {
    this.stack = []
  }

  push(num: number): void {
    this.stack.push(num)
  }
}

export { Stack }
