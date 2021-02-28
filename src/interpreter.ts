import * as nodeEmoji from 'node-emoji'

type Direction = 'up' | 'down' | 'right' | 'left'
type State = 'normal' | 'end'

class Interpreter {
  /** ボード */
  board: string[][]

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
    this.board = board.split('\n').map((str) => this.splitEmojiStr(str))
    console.log(this.board)

    this.x = 0
    this.y = 0
    this.dirX = 0
    this.dirY = 0
    this.state = 'normal'
    this.stack = []

    this.setDir('right')
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
        this.dirX = 1
        this.dirY = 0
        break
      case 'left':
        this.dirX = -1
        this.dirY = 0
        break
    }
  }

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

  /** dir の方向に進む */
  move(): State {
    // TODO: ループ？piet？の対応をする
    this.x += this.dirX
    this.y += this.dirY
    return 'normal'
  }

  exec(): State {
    // TODO: emoji の実装と合わせて実装する

    const str = ':' + (this.board?.[this.y]?.[this.x] ?? 'X') + ':'
    console.log(str)
    console.log(nodeEmoji.unemojify('👍'))
    console.log(str == nodeEmoji.unemojify('👍'))

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
  }
}

export { Interpreter }
