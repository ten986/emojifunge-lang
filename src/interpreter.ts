import { Board } from './board'
import { Stack } from './stack'

type State = 'normal' | 'end'

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
  state: State

  /** スタック */
  stack: Stack

  constructor(file: string, input: string) {
    this.x = 0
    this.y = 0
    this.dirX = 1
    this.dirY = 0
    this.state = 'normal'

    this.input = input
    this.firstInput = input

    this.board = new Board(file)
    this.stack = new Stack()
  }

  /** 終わった？ */
  isEnd(): boolean {
    return this.state == 'end'
  }

  /** 出力 */
  output(str: string): void {
    console.log(str)
  }

  /** 出力 */
  error(str: string): void {
    console.error(str)
  }

  /** dir の方向に進む */
  move(): State {
    // リトライ回数
    let retryCount = 0
    const retryMax = 4

    while (retryCount < retryMax) {
      // 進む場所
      const dx = this.x + this.dirX
      const dy = this.y + this.dirY

      // dir の方向に進む
      if (this.board.existEmoji(dx, dy)) {
        this.x += this.dirX
        this.y += this.dirY
        return 'normal'
      }

      // 右回転
      this.dirY = this.dirX
      this.dirX = -this.dirY
      retryCount++
    }

    // 移動できずに終了
    return 'end'
  }

  exec(): State {
    // 現在位置のemoji
    const emoji = this.board.getEmojiStr(this.x, this.y)

    // emoji がない
    if (emoji === undefined) {
      return 'end'
    }

    // 数値入力
    if (emoji.eq('🔢')) {
      this.stack.push(+(this.input.match(/-?\d+/) || [0])[0] || 0)
      this.input = this.input.replace(/^[^]*?\d+/, '')
      return 'normal'
    }
    // 文字入力
    if (emoji.eq('🔠')) {
      this.stack.push(this.input ? this.input.charCodeAt(0) : -1)
      this.input = this.input.slice(1)
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
    console.log('x:' + this.x + ', y:' + this.y)
    console.log('dx:' + this.dirX + ', dy:' + this.dirY)
    console.log(this.stack)
  }
}

export { Interpreter }
