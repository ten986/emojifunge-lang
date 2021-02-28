import * as fs from 'fs'
import { argv } from 'process'

import { Interpreter } from './interpreter'

// プログラム
const path = argv[2]
const board = fs.readFileSync(path).toString()

// 入力
const pathInput = argv[3]
const input = fs.readFileSync(pathInput).toString()

// 実行
const interpreter = new Interpreter(board, input)
for (let i = 0; i < 10; ++i) {
  interpreter.step()
  if (interpreter.isEnd()) {
    break
  }
}

console.log(interpreter.stack)
