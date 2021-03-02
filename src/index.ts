import * as fs from 'fs'
import { argv } from 'process'

import { Interpreter } from './interpreter/interpreter'

// プログラム
const path = argv[2]
const board = fs.readFileSync(path).toString()

// 入力
const input = fs.readFileSync(0).toString()

// 実行
const interpreter = new Interpreter(board, input)
for (;;) {
  interpreter.step()
  if (interpreter.isEnd()) {
    break
  }
}

// console.log(interpreter.stack)
