type Direction = 'up' | 'down' | 'right' | 'left'
type State = 'normal'

class Interpreter {
  /** ボード */
  board: string

  /** 場所 */
  x: number
  y: number

  /** 移動 */
  dirX: number
  dirY: number

  /** 状態 */
  state: State

  /** スタック */
  stack: number[]

  constructor(board: string) {
    this.board = board
    this.x = 0
    this.y = 0
    this.dirX = 0
    this.dirY = 0
    this.state = 'normal'
    this.stack = []
  }

  setDir(dir: Direction): void {
    switch (dir) {
      case 'up':
        this.dirX = 0
        this.dirY = -1
        break
      case 'down':
        this.dirX = 0
        this.dirY = 1
        break
      case 'right':
        this.dirX = 0
        this.dirY = 1
        break
      case 'left':
        this.dirX = 0
        this.dirY = -1
        break
      default:
        throw Error('setDir: invalid Direction')
    }
  }

  /** dir の方向に進む */
  move(): State {
    // TODO: ループ？piet？の対応をする
    this.x += this.dirX
    this.y += this.dirY
    return 'normal'
  }

  /** 今いるとこのやつやる */
  exec(): State {
    // TODO: emoji の実装と合わせて実装する
    return 'normal'
  }

  /** 1ステップ */
  step(): void {
    this.state = this.exec()
    this.state = this.move()
  }
}

export { Interpreter }
