import * as nodeEmoji from 'node-emoji'

import { Stack } from './stack'

type State = 'normal' | 'end'

class Interpreter {
  /** ボード */
  board: string[][]

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
  state: State

  /** スタック */
  stack: Stack

  constructor(board: string, input: string) {
    this.board = board.split('\n').map((str) => this.splitEmojiStr(str))
    console.log(this.board)

    this.x = 0
    this.y = 0
    this.dirX = 1
    this.dirY = 0
    this.state = 'normal'
    this.stack = new Stack()

    this.input = input
    this.firstInput = input
  }

  /** 絵文字変換用 */
  splitEmojiStr(str: string): string[] {
    return nodeEmoji
      .unemojify(str)
      .split(/[::]+/)
      .filter((str) => str)
  }

  isEnd(): boolean {
    return this.state == 'end'
  }

  isEmojiEq(str: string, emo: string): boolean {
    return str == nodeEmoji.unemojify(emo)
  }

  /** */
  output(str: string): void {
    process.stdout.write(String(str))
  }

  /** dir の方向に進む */
  move(): State {
    // TODO: ループ？piet？の対応をする
    this.x += this.dirX
    this.y += this.dirY
    return 'normal'
  }

  exec(): State {
    const { stack, input } = this

    // 現在位置のemoji
    const str = ':' + (this.board?.[this.y]?.[this.x] ?? 'X') + ':'

    // 数値入力
    if (this.isEmojiEq(str, '🔢')) {
      stack.push(+(input.match(/-?\d+/) || [0])[0] || 0)
      this.input = input.replace(/^[^]*?\d+/, '')
      return 'normal'
    }
    // 文字入力
    if (this.isEmojiEq(str, '🔠')) {
      stack.push(input ? input.charCodeAt(0) : -1)
      this.input = input.slice(1)
      return 'normal'
    }

    if (this.isEmojiEq(str, '👍')) {
      this.stack.push(0)
      return 'normal'
    }
    if (str == ':X:') {
      this.stack.push(0)
      return 'end'
    }

    this.stack.push(-1)
    return 'end'
  }

  /** 1ステップ */
  step(): void {
    this.state = this.exec()
    if (this.isEnd()) {
      return
    }
    this.state = this.move()
    if (this.isEnd()) {
      return
    }
  }
}

export { Interpreter }
