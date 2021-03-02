import { Emoji } from '@/emoji'

import { Interpreter } from './interpreter'

/** アクション */
type Action = (interpreter: Interpreter) => void

/** emoji と アクションを結びつける */
type EmojiAction = {
  emoji: Emoji
  action: Action
}

export type { Action, EmojiAction }
