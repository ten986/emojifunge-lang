import * as fs from 'fs'

import { Interpreter } from './interpreter'

const path = './src/sample/test'
const board = fs.readFileSync(path).toString()

const interpreter = new Interpreter(board)
for (let i = 0; i < 10; ++i) {
  interpreter.step()
  if (interpreter.isEnd()) {
    break
  }
}

console.log(interpreter.stack)
