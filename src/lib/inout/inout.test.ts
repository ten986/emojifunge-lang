import * as fs from 'fs'
import path from 'path'

import { Interpreter } from '@/interpreter'

test('inout_test', () => {
  const pathCode = path.join(__dirname, 'code')
  const pathInput = path.join(__dirname, 'input')
  const pathOutput = path.join(__dirname, 'output')

  const board = fs.readFileSync(pathCode).toString()
  const input = fs.readFileSync(pathInput).toString()
  const output = fs.readFileSync(pathOutput).toString()
  const interpreter = new Interpreter(board, input)
  interpreter.stepAll()

  expect(interpreter.allOutput).toBe(output)
})
