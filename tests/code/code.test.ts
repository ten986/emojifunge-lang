import * as fs from 'fs'
import path from 'path'

import { Interpreter } from '@/interpreter/interpreter'

type TestCase = {
  pathCode: string
  pathInOuts: InOut[]
}

type InOut = {
  pathInput: string
  pathOutput: string
}

const cases: TestCase[] = [
  {
    pathCode: './inout/code',
    pathInOuts: [
      {
        pathInput: './inout/in',
        pathOutput: './inout/out',
      },
    ],
  },
  {
    pathCode: './cat/code',
    pathInOuts: [
      {
        pathInput: './cat/in1',
        pathOutput: './cat/out1',
      },
      {
        pathInput: './cat/in2',
        pathOutput: './cat/out2',
      },
    ],
  },
  {
    pathCode: './helloworld/code',
    pathInOuts: [
      {
        pathInput: './helloworld/in',
        pathOutput: './helloworld/out',
      },
    ],
  },
]

describe.each(cases)('%p', ({ pathCode, pathInOuts }) => {
  // コード, 入力, 出力 を取得
  const codeFile = path.join(__dirname, pathCode)
  const board = fs.readFileSync(codeFile).toString()

  test.each(pathInOuts)('%p', ({ pathInput, pathOutput }) => {
    const inputFile = path.join(__dirname, pathInput)
    const outputFile = path.join(__dirname, pathOutput)
    const input = fs.readFileSync(inputFile).toString()
    const output = fs.readFileSync(outputFile).toString()

    // 実行
    const interpreter = new Interpreter(board, input)
    interpreter.stepAll()

    // 入力、出力が一致するか
    expect(interpreter.allOutput).toBe(output)
  })
})
