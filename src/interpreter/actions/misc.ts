import { emojiToClass } from '@/modules/emoji'

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
    ip.stack.push(ip.stack.sortRank(rank))
  }
}

const median: Action = (ip: Interpreter) => {
  ip.stack.push(ip.stack.median())
}

const calendar: Action = (ip: Interpreter) => {
  const time = new Date()
  ip.stack.push(time.getSeconds())
  ip.stack.push(time.getMinutes())
  ip.stack.push(time.getHours())
  ip.stack.push(time.getDate())
  ip.stack.push(time.getMonth() + 1)
  ip.stack.push(time.getFullYear())
}

const kazoeageOneesan: Action = (ip: Interpreter) => {
  const a = ip.stack.popNumber()
  if (a <= 0) {
    ip.stack.push(1)
  }
  if (a == 1) {
    ip.stack.push(2)
  }
  if (a == 2) {
    ip.stack.push(12)
  }
  if (a == 3) {
    ip.stack.push(184)
  }
  if (a == 4) {
    ip.stack.push(8512)
  }
  if (a == 5) {
    ip.stack.push(1262816)
  }
  if (a == 6) {
    ip.stack.push(575780564)
  }
  if (a == 7) {
    // 2秒
    sleep(2 * 1000)
    ip.stack.push(789360053252)
  }
  if (a == 8) {
    // 4時間
    sleep(4 * 60 * 60 * 1000)
    ip.stack.push(3266598486981642)
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
    action: median,
  },
  {
    emoji: emojiToClass('📅'),
    action: calendar,
  },
  {
    emoji: emojiToClass('🤖'),
    action: kazoeageOneesan,
  },
]

export { miscActions }
