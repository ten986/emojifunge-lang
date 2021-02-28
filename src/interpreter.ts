import { Board } from '@/board'

import { Stack } from './stack'

type EndState = 'normal' | 'end'

class Interpreter {
  /** ファイルを受け取るボード */
  board: Board

  /** 入力 */
  input: string

  /** 入力（最初） */
  firstInput: string

  /** 場所 */
  x: number
  y: number

  /** 移動 */
  dirX: number
  dirY: number

  /** 状態 */
  endState: EndState

  /** スタック */
  stack: Stack

  /** outputdist */
  outputdist: 'console' | 'inner'
  outputdistInner: string

  constructor(file: string, input: string, dist: 'console' | 'inner' = 'console') {
    this.x = 0
    this.y = 0
    this.dirX = 1
    this.dirY = 0
    this.endState = 'normal'

    this.input = input
    this.firstInput = input

    this.outputdist = dist
    this.outputdistInner = ''

    this.board = new Board(file)
    this.stack = new Stack()
  }

  /** 終わった？ */
  isEnd(): boolean {
    return this.endState == 'end'
  }

  getTestOutput(): string {
    return this.outputdistInner
  }

  /** 出力 */
  output(str: string): void {
    if (this.outputdist == 'console') {
      console.log(str)
    }
    if (this.outputdist == 'inner') {
      this.outputdistInner += str
    }
  }

  /** 出力 */
  error(str: string): void {
    console.error(str)
  }

  /** 1ステップ */
  step(): void {
    this.endState = this.exec()
    if (this.isEnd()) {
      return
    }
    this.endState = this.move()
    if (this.isEnd()) {
      return
    }
    // console.log('x:' + this.x + ', y:' + this.y)
    // console.log('dx:' + this.dirX + ', dy:' + this.dirY)
    // console.log(this.stack)
  }

  /** dir の方向に進む */
  move(): EndState {
    // リトライ回数
    let retryCount = 0
    const retryMax = 4

    while (retryCount < retryMax) {
      // 進む場所
      const dx = this.x + this.dirX
      const dy = this.y + this.dirY

      // dir の方向に進む
      if (this.board.existEmoji(dx, dy)) {
        this.x = dx
        this.y = dy
        return 'normal'
      }

      // 右回転
      ;[this.dirX, this.dirY] = [-this.dirY, this.dirX]
      retryCount++
    }

    // 移動できずに終了
    return 'end'
  }

  /** 足元のやつを実行 */
  exec(): EndState {
    // 現在位置のemoji
    const emoji = this.board.getEmojiStr(this.x, this.y)

    // emoji がない
    if (emoji === undefined) {
      return 'end'
    }

    // 数値入力
    if (emoji.eq('ℹ️')) {
      this.stack.push(+(this.input.match(/-?\d+/) || [0])[0] || 0)
      this.input = this.input.replace(/^[^]*?\d+/, '')
      return 'normal'
    }
    // 文字入力
    if (emoji.eq('🔤')) {
      this.stack.push(this.input ? this.input.charCodeAt(0) : -1)
      this.input = this.input.slice(1)
      return 'normal'
    }
    // 数値出力
    if (emoji.eq('🔢')) {
      this.output(this.stack.pop().toString())
      return 'normal'
    }
    // 文字出力
    if (emoji.eq('🔡')) {
      this.output(String.fromCharCode(this.stack.pop()))
      return 'normal'
    }

    if (emoji.eq('👍')) {
      this.stack.push(0)
      return 'normal'
    }

    // unexpected token
    this.error('unexpected emoji')
    return 'end'
  }

  stepAll(): void {
    for (;;) {
      this.step()
      if (this.isEnd()) {
        break
      }
    }
  }
}

export { Interpreter }
