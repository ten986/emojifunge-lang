import { median } from 'mathjs'

import { emojiToClass } from '@/modules/emoji'
import { spreadStack } from '@/modules/operation'

import { Action, EmojiAction } from '../actionTypes'
import { Interpreter } from '../interpreter'

// this is 最悪な sleep
const sleep = (ms: number) => {
  const time = new Date().getTime()
  // eslint-disable-next-line no-empty
  while (new Date().getTime() < time + ms) {}
}

const sortRank = (rank: number): Action => {
  return (ip: Interpreter) => {
    const num = spreadStack(ip.stack.innerStack).sort((a, b) => b - a)?.[rank] ?? -1
    ip.stack.pushAsNewElm(num)
  }
}

const pushMedian: Action = (ip: Interpreter) => {
  const med = median(spreadStack(ip.stack.innerStack))
  ip.stack.pushAsNewElm(med)
}

const calendar: Action = (ip: Interpreter) => {
  const time = new Date()
  ip.stack.pushAsNewElm(time.getSeconds())
  ip.stack.pushAsNewElm(time.getMinutes())
  ip.stack.pushAsNewElm(time.getHours())
  ip.stack.pushAsNewElm(time.getDate())
  ip.stack.pushAsNewElm(time.getMonth() + 1)
  ip.stack.pushAsNewElm(time.getFullYear())
}

const stopwatch = (ip: Interpreter): void => {
  if (ip.stopWatchState === 'off') {
    ip.stopWatchState = 'on'
    ip.stopWatchCount = 0
  } else if (ip.stopWatchState === 'on') {
    ip.stack.pushAsRaw(ip.stopWatchCount)
    ip.stopWatchState = 'off'
  }
}

const kazoeageOneesan: Action = (ip: Interpreter) => {
  const a = ip.stack.popNumber()
  if (a <= 0) {
    ip.stack.pushAsNewElm(1)
  }
  if (a == 1) {
    ip.stack.pushAsNewElm(2)
  }
  if (a == 2) {
    ip.stack.pushAsNewElm(12)
  }
  if (a == 3) {
    ip.stack.pushAsNewElm(184)
  }
  if (a == 4) {
    ip.stack.pushAsNewElm(8512)
  }
  if (a == 5) {
    ip.stack.pushAsNewElm(1262816)
  }
  if (a == 6) {
    ip.stack.pushAsNewElm(575780564)
  }
  if (a == 7) {
    // 2秒
    sleep(2 * 1000)
    ip.stack.pushAsNewElm(789360053252)
  }
  if (a == 8) {
    // 4時間
    sleep(4 * 60 * 60 * 1000)
    ip.stack.pushAsNewElm(3266598486981642)
  }
  if (a >= 9) {
    // eslint-disable-next-line no-empty
    for (;;) {}
  }
}

/**
 * よくわからんアクション
 */
const miscActions: EmojiAction[] = [
  {
    emoji: emojiToClass('🥇'),
    action: sortRank(0),
  },
  {
    emoji: emojiToClass('🥈'),
    action: sortRank(1),
  },
  {
    emoji: emojiToClass('🥉'),
    action: sortRank(2),
  },
  {
    emoji: emojiToClass('🀄'),
    action: pushMedian,
  },
  {
    emoji: emojiToClass('📅'),
    action: calendar,
  },
  {
    emoji: emojiToClass('🤖'),
    action: kazoeageOneesan,
  },
  {
    emoji: emojiToClass('⏱️'),
    action: stopwatch,
  },
]

export { miscActions }
