import { Emoji } from '@/modules/emoji'

import { Interpreter } from './interpreter'

/** アクション */
type Action = (interpreter: Interpreter) => void

/** emoji と アクションを結びつける */
type EmojiAction = {
  emoji: Emoji
  action: Action
}

type EmojistrToActionMap = Map<string, Action>

export type { Action, EmojiAction, EmojistrToActionMap }
