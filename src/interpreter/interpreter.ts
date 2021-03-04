import { Board } from '@/modules/board'
import { Stack } from '@/modules/stack'

import { rotateClockwise } from './actions/move'
import { Action } from './actionTypes'
import { emojistrToAction } from './emojiActions'

// 終了するか
type EndState = 'normal' | 'end'
// コメント中か
type CommentState = 'normal' | 'commented'
// スタックの操作方法
type StackState = 'normal' | 'stack'
// 終了を無視するか
type IgnoreEndState = 'normal' | 'ignore'
// 出力命令を無視するか
type IgnoreOutputState = 'normal' | 'ignore'

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
  commentState: CommentState
  stackState: StackState
  ignoreEndState: IgnoreEndState
  ignoreOutputState: IgnoreOutputState

  /** 回数操作 */
  operationNum: Stack

  /** mailbox */
  mailBox: Stack

  /** 現在操作中のスタック */
  stack: Stack

  /** 一番底のスタック */
  rootStack: Stack

  /** アウトプット全体 */
  allOutput: string

  /** :hoge: -> Action */
  emojistrToAction: Map<string, Action>

  /** 停止までの step 数 */
  stepToStop: number | null

  constructor(file: string, input: string) {
    this.x = 0
    this.y = 0
    this.dirX = 1
    this.dirY = 0
    this.endState = 'normal'
    this.commentState = 'normal'
    this.stackState = 'normal'
    this.ignoreEndState = 'normal'
    this.ignoreOutputState = 'normal'

    this.input = input
    this.firstInput = input

    this.board = new Board(file)
    this.rootStack = new Stack()
    this.stack = this.rootStack

    this.mailBox = new Stack()
    this.operationNum = new Stack()

    this.allOutput = ''

    this.emojistrToAction = emojistrToAction

    this.stepToStop = null
  }

  /** 終わった？ */
  isEnd(): boolean {
    return this.endState == 'end'
  }

  /** 出力 */
  output(str: string): void {
    if (this.ignoreOutputState != 'ignore') {
      this.allOutput += str
      process.stdout.write(str)
    }
  }

  /** 出力 */
  error(str: string): void {
    console.error(str)
  }

  /** 1ステップ */
  step(): void {
    // 命令実行回数
    let op = 1
    if (this.operationNum.length > 0) {
      op = this.operationNum.popNumber() ?? 1
    }
    for (let i = 0; i < op; ++i) {
      this.exec()
      if (this.isEnd()) {
        return
      }
    }

    // 停止するまでの時間をデクリメント
    if (typeof this.stepToStop === 'number') {
      if (this.stepToStop <= 0) {
        if (this.ignoreEndState != 'ignore') {
          this.endState = 'end'
          return
        } else {
          this.stepToStop = null
        }
      } else {
        this.stepToStop--
      }
    }

    this.move()
    if (this.isEnd()) {
      return
    }
    // console.log('x:' + this.x + ', y:' + this.y)
    // console.log('dx:' + this.dirX + ', dy:' + this.dirY)
    // console.log(this.rootStack.getDebugOutput(this))
  }

  /** 最後まで */
  stepAll(): void {
    for (;;) {
      this.step()
      if (this.isEnd()) {
        break
      }
    }
  }

  /** dir の方向に進む */
  move(): void {
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
        return
      }

      // 右回転
      rotateClockwise(this)
      retryCount++
    }

    // 移動できずに終了
    this.endState = 'end'
  }

  /** 足元のやつを実行 */
  exec(): void {
    // 現在位置のemoji
    const emoji = this.board.getEmoji(this.x, this.y)

    // emoji がない
    if (emoji === undefined) {
      this.error('emoji not found')
      this.endState = 'end'
      return
    }

    // コメント
    if (this.commentState == 'commented') {
      if (emoji.eq('🍚')) {
        this.commentState = 'normal'
      }
      return
    }

    // action を取得
    const action = this.emojistrToAction.get(emoji.emojiStr)
    if (action !== undefined) {
      action(this)
      return
    }

    // unexpected token
    this.error('unexpected emoji')
    this.endState = 'end'
    return
  }
}

export { Interpreter }
export type { StackState, IgnoreOutputState }
