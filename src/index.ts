import { Interpreter } from './interpreter'

export function main(): void {
  const board = ''

  const interpreter = new Interpreter(board)
  for (let i = 0; i < 10; ++i) {
    interpreter.step()
  }

  console.log(interpreter.stack[0])
}
