import * as fs from 'fs'

import { Interpreter } from './interpreter'

const path = './src/sample/test'
const board = fs.readFileSync(path).toString()

const pathInput = './src/sample/input'
const input = fs.readFileSync(pathInput).toString()

const interpreter = new Interpreter(board, input)
for (let i = 0; i < 10; ++i) {
  interpreter.step()
  if (interpreter.isEnd()) {
    break
  }
}

console.log(interpreter.stack)
