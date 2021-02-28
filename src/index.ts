import * as fs from 'fs'
import { argv } from 'process'

import { Interpreter } from './interpreter'

// プログラム
const path = argv[2]
const board = fs.readFileSync(path).toString()

// 入力
const input = fs.readFileSync(0).toString()

// 実行
const interpreter = new Interpreter(board, input)
let i = 0
for (; i < 100; ++i) {
  interpreter.step()
  if (interpreter.isEnd()) {
    break
  }
}
if (i == 100) {
  console.log('infinity loop')
}

console.log(interpreter.stack)
