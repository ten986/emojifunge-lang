import fs from 'fs'
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

const getTestCase = () => {
  const cases: TestCase[] = []

  // 各 directory で操作
  const listFiles = (dir: string): void => {
    const files: fs.Dirent[] = []
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((dirent) =>
      dirent.isFile() ? files.push(dirent) : listFiles(`${dir}/${dirent.name}`),
    )
    // "code"というファイルを探す
    const codeFile = files.find((f) => f.name === 'code')
    if (!codeFile) {
      return
    }
    // in out の対応づけ
    const outFiles = files.filter((f) => f.name.startsWith('in')).map((f) => f.name.substring(2))
    const outFileSet = new Set(outFiles)
    const inFiles = files.filter((f) => f.name.startsWith('in')).map((f) => f.name.substring(2))

    const pathInOuts = inFiles
      .filter((n) => outFileSet.has(n))
      .map((n) => {
        return {
          pathInput: path.join(dir, 'in' + n),
          pathOutput: path.join(dir, 'out' + n),
        }
      })

    cases.push({
      pathCode: path.join(dir, 'code'),
      pathInOuts: pathInOuts,
    })
  }

  listFiles(__dirname)

  return cases
}

const cases = getTestCase()

// const cases: TestCase[] = [
//   {
//     pathCode: './code/inout/code',
//     pathInOuts: [
//       {
//         pathInput: './code/inout/in',
//         pathOutput: './code/inout/out',
//       },
//     ],
//   },
//   {
//     pathCode: './code/cat/code',
//     pathInOuts: [
//       {
//         pathInput: './code/cat/in1',
//         pathOutput: './code/cat/out1',
//       },
//       {
//         pathInput: './code/cat/in2',
//         pathOutput: './code/cat/out2',
//       },
//     ],
//   },
// ]

describe.each(cases)('%p', ({ pathCode, pathInOuts }) => {
  // コード, 入力, 出力 を取得
  const codeFile = pathCode
  const board = fs.readFileSync(codeFile).toString()

  test.each(pathInOuts)('%p', ({ pathInput, pathOutput }) => {
    const inputFile = pathInput
    const outputFile = pathOutput
    const input = fs.readFileSync(inputFile).toString()
    const output = fs.readFileSync(outputFile).toString()

    // 実行
    const interpreter = new Interpreter(board, input)
    interpreter.stepAll()

    // 入力、出力が一致するか
    expect(interpreter.allOutput).toBe(output)
  })
})
