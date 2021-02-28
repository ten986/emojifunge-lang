import * as fs from 'fs'

import { Interpreter } from '@/interpreter'

test('inout_test', () => {
  const path = '/src/lib/inout_code'
  const pathInput = './src/lib/inout_input'
  const pathOutput = './src/lib/inout_output'

  const board = fs.readFileSync(path).toString()
  const input = fs.readFileSync(pathInput).toString()
  const output = fs.readFileSync(pathOutput).toString()
  const interpreter = new Interpreter(board, input)
  interpreter.stepAll()

  expect(interpreter.getTestOutput()).toBe(output)
})
