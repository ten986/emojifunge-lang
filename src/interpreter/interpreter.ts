import { Board } from '@/modules/board'
import { Emoji } from '@/modules/emoji'
import { Stack } from '@/modules/stack'

import { rotateClockwise, rotateCounterclockwise } from './actions/move'
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
// ストップウォッチ
type StopWatchState = 'off' | 'on'
// 乗り物
type RideState = 'off' | 'bicycle'
// 回転方向
type RotateState = 'clockwise' | 'counterclockwise'
// 録画
type RecordingState = 'off' | 'recoding'

class Interpreter {
  /** ファイルを受け取るボード */
  board: Board

  /** 入力 */
  input: string

  /** 入力（最初） */
  firstInput: string

  /** プログラムそのもの */
  rawFile: string

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
  stopWatchState: StopWatchState
  rideState: RideState
  rotateState: RotateState
  recordingState: RecordingState

  /** 回数操作 */
  operationNum: Stack

  /** mailbox */
  mailBox: Stack

  /** 現在操作中のスタック */
  stack: Stack

  /** 一番底のスタック */
  rootStack: Stack

  /** ゴミ箱 */
  garbageCan: Stack

  /** 録画 */
  recordingStack: Stack

  /** アウトプット全体 */
  allOutput: string

  /** :hoge: -> Action */
  emojistrToAction: Map<string, Action>

  /** 停止までの step 数 */
  stepToStop: number | null

  /** ストップウォッチのカウント数 */
  stopWatchCount: number

  /** 標準出力する設定か */
  isOutStd: boolean

  /** ステップ数 */
  stepNum: number

  /** 強制停止するステップ数 */
  stepToAbort: number | undefined

  constructor(file: string, input: string, isOutStd?: boolean, stepToAbort?: number) {
    this.endState = 'normal'
    this.commentState = 'normal'
    this.stackState = 'normal'
    this.ignoreEndState = 'normal'
    this.ignoreOutputState = 'normal'
    this.stopWatchState = 'off'
    this.rideState = 'off'
    this.rotateState = 'clockwise'
    this.recordingState = 'off'

    this.input = input
    this.firstInput = input
    this.rawFile = file
    this.isOutStd = isOutStd ?? true

    this.board = new Board(file)
    this.rootStack = new Stack()
    this.stack = this.rootStack

    this.mailBox = new Stack()
    this.operationNum = new Stack()
    this.garbageCan = new Stack()
    this.recordingStack = new Stack()

    this.allOutput = ''

    this.emojistrToAction = emojistrToAction

    this.stepToStop = null

    this.stopWatchCount = 0

    this.stepNum = 0
    this.stepToAbort = stepToAbort

    this.x = 0
    this.y = 0
    this.dirX = 1
    this.dirY = 0

    const xys = this.board.getEntryPoint()
    if (xys.length > 0) {
      const xy = xys[Math.floor(Math.random() * xys.length)]
      this.x = xy.x
      this.y = xy.y
    }
  }

  /** 終わった？ */
  isEnd(): boolean {
    return this.endState == 'end'
  }

  /** 出力 */
  output(str: string): void {
    if (this.ignoreOutputState != 'ignore') {
      this.allOutput += str
      if (this.isOutStd) process.stdout.write(str)
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

    // ストップウォッチで使うカウンターをインクリメント
    if (this.stopWatchState === 'on') {
      this.stopWatchCount++
    }

    this.move()
    if (this.isEnd()) {
      return
    }
    this.stepNum++
    if (this.stepToAbort && this.stepNum >= this.stepToAbort) {
      this.endState = 'end'
    }
    // console.log('x:' + this.x + ', y:' + this.y)
    // console.log('dx:' + this.dirX + ', dy:' + this.dirY)
    // console.log('rootStack')
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
      if (!this.board.isWall(dx, dy, this)) {
        this.x = dx
        this.y = dy
        return
      }

      // 状態により回転
      if (this.rotateState === 'clockwise') {
        rotateClockwise(this)
      } else if (this.rotateState === 'counterclockwise') {
        rotateCounterclockwise(this)
      }
      retryCount++
    }

    // 移動できずに終了（終了無視状態でも構わず終了）
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

    this.execEmoji(emoji)
  }

  execEmoji(emoji: Emoji): void {
    // 録画状況
    if (this.recordingState === 'recoding') {
      const stack = new Stack(this.recordingStack)
      stack.innerStack = emoji.codeUnit
      this.recordingStack.pushAsNewElm(stack)
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
