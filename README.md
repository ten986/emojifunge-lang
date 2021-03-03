# emojifunge

## これは何

befunge + emoji

ありそうでなかったので作った

## emojiについて

` Command + Control + Space ` で出せる

## 仕様

emojiを二次元上に配置する言語

コードは、emoji と 改行 のみ有効

スタックベースの言語

空のスタック stack = `(top)[](bottom)` と、(x, y) = (0, 0)を指すポインタがある

空の stack から pop するとき、 -1 を返す

操作回数のstackがある

操作回数のstackが空ではない時、操作回数のstackからpopして、その回数次の命令を行う

## スタックモード

スタックのネストができる

最初は通常モードで、通常モードとスタックモードがある

要素は、スタックもしくは数値である。

通常モードは、
`(top)[[a, b, c], [], [d, e], f, [g, h]]` のようなスタックがあったとき、
`a, b, c, d, ...` のように pop していく。
すなわち、どのようにスタックがネストされていても、数値による1次元配列のように振る舞う。
`[]` を pop した際は、`[]` を破棄し、次の値を pop する。

TODO: 直観的じゃないので、stackを開く操作にした方がいいかも
TODO: stackを開く操作に変更した
スタックモードは、ただpopする操作になった

スタックモードは、
`(top)[[a, b, c], [], [d, e], f, [g, h]]` のようなスタックがあったとき、
`[a, b, c], [], [d, e], [f], ...` のように pop していく。
すなわち、スタックを1つの値として見る。
また、数値は、1要素のスタックとして扱われる。
`[]` も、通常のスタックのように pop される。
例えば「➕」演算の時は、`[a, b, c], [d, e]`をpopしたとき、`[a + d, b + e]` を返す。
`c` のような値は破棄される。

## 移動に関する仕様

最初は(x, y) = (0, 0)に位置し、移動方向は(dx, dy) = (1,0)

移動先を、(x, y) = (x+dx, y+dy)
移動先にemojiがあれば移動する

emojiがなければ、(dx, dy) = (-dy, dx) として試す。
右回りに試すと思えば良い

4回試してemojiがなければ終了する

## コマンド一覧

### 入出力

| emoji | name | mode | action | example |
|---|---|---|---|---|
|ℹ️|　Input Number | x | 数値入力 入力を数値として受け取る。空白などの直前まで受け取る。  | stack `[53, 2] -> [32, 53, 2]` input: `32 54 AA` -> ` 54 AA`|
|🔤| Input ASCII | x | 文字入力 ASCII CODEとして受け取る。|stack `[53, 2] -> [41, 53, 2]` input: `ABC` -> `BC`|
|🔢| Output Number | x | 数値出力 stackのtopを数値として出力する。popする。| stack `[32, 53, 2] -> [53, 2]` output: `32`|
|🔡| Output ASCII | x | 文字出力 stackのtopをASCII CODEとして出力する。popする。| stack `[41, 53, 2] -> [53, 2]` output: `A`|
|🐱| cat | x | 入力をそのままoutputする。 |input:`ABC` output:`ABC`|
|🐶| dog | x | 入力を反転してoutputする。 |input:`ABC` output:`CBA`|

### 制御

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🔚| end | x | プログラムを終了する ||
|⬜️ | empty | x | 何もしない ||
|⬛️ | wall | x | 壁。プログラムの外側と同じ扱いとなる。 ||
|🍚 | comment | x | 次の comment まで、壁以外の命令を無視する。 ||

### 定数

| emoji | name | mode | action | example |
|---|---|---|---|---|
|0️⃣| 0| x | 0 を push する。|stack `[53, 2] -> [0, 53, 2]`|
|1️⃣| 1| x | 1 を push する。||
|2️⃣| 2| x | 2 を push する。||
|3️⃣| 3| x | 3 を push する。||
|4️⃣| 4| x | 4 を push する。||
|5️⃣| 5| x | 5 を push する。||
|6️⃣| 6| x | 6 を push する。||
|7️⃣| 7| x | 7 を push する。||
|8️⃣| 8| x | 8 を push する。||
|9️⃣| 9| x | 9 を push する。||
|🔟| 10| x | 10 を push する。||
|🅰️| A | x | 65 を push する。||
|🅱️| B | x | 66 を push する。||
|©️| C | x | 67 を push する。||
|🅾️| O | x | 77 を push する。||
|Ⓜ️| M | x | 79 を push する。||
|🅿️| P | x | 80 を push する。||
|®️| R | x | 82 を push する。||
|💯| 100| x | 100 を push する。||

### 乱数

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🎲| dice | x | 1 - 6 のランダムな値をpush||
|🤞| judgement | x | 0 - 1 のランダムな値をpush||

### 計算

| emoji | name | mode | action | example |
|---|---|---|---|---|
|➕| plus| o | (top)`a`, `b` を pop し、`a+b` を push する。|stack `[7, 4, 6] -> [11, 6]`|
|➖| minus| o | (top)`a`, `b` を pop し、`a-b` を push する。|stack `[7, 4, 6] -> [3, 6]`|
|✖️| mul| o | (top)`a`, `b` を pop し、`a*b` を push する。|stack `[7, 4, 6] -> [28, 6]`|
|➗| div| o | (top)`a`, `b` を pop し、`a/b` を push する。|stack `[7, 4, 6] -> [1, 6]`|
|🈹| mod| o | (top)`a`, `b` を pop し、`a%b` を push する。|stack `[7, 4, 6] -> [3, 6]`|
|❗️| fact| o | `a` を pop し、`a`  の階乗 を push する。|stack `[7, 4, 6] -> [5040, 4, 6]`|

### スタック操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🚮| pop| o | popする。値は破棄する。|stack `[7, 4, 6] -> [4, 6]`|
|💕| dup| o | `a` を pop し、`a`, `a` を push する。 |stack `[7, 4, 6] -> [7, 7, 4, 6]`|
|💞| swap| o | (top)`a`, `b` を pop し、(top)`b`, `a` を push する。|stack `[7, 4, 6] -> [4, 7, 6]`|
|♻️| swap3| o | (top)`a`, `b`, `c` を pop し、(top)`c`, `a`, `b` を push する。|stack `[7, 4, 6] -> [6, 7, 4]`|
|🙃| reverse| x | stackを反転する。 |stack `[7, 4, 6] -> [6, 4, 7]`|
|🎆| fireworks | x | stack を clear する |stack `[18, 4, 26] -> []`|
|🔞| R-18| x | stack から、 18未満の数を取り除く|stack `[18, 4, 26] -> [18, 26]`|

### 記憶領域操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|📥| mailbox-in| o | `a` を pop し、stackとは異なるstack(mailbox)にpushする。||
|📤| mailbox-out| o | mailbox から　`a` を pop し、stackにpushする。||

### 移動

| emoji | name | mode | action | example |
|---|---|---|---|---|
|➡️| right | x | (dx, dy) = (1, 0)||
|⬅️| left | x | (dx, dy) = (-1, 0)||
|⬆️| up | x | (dx, dy) = (0, -1)||
|⬇️| down | x | (dx, dy) = (0, 1)||
|↗️| up-right | x | (dx, dy) = (1, -1)||
|↘️| down-right | x | (dx, dy) = (1, 1)||
|↖️| up-left | x | (dx, dy) = (-1, -1)||
|↙️| down-left | x | (dx, dy) = (-1, 1)||
|⏩| fast-right | x | dx++ ||
|⏪| fast-right | x | dx-- ||
|⏫| fast-right | x | dy-- ||
|⏬| fast-right | x | dy++ ||
|🔃| turn-clockwise | x | (dx, dy) = (-dy, dx) ||
|🔄| turn-counterclockwise | x | (dx, dy) = (dy, -dx) ||

### 条件分岐

| emoji | name | mode | action | example |
|---|---|---|---|---|
|↪️| right-if-true| x | `a` を pop し、`a > 0` なら right||
|↩️| left-if-true| x | `a` を pop し、`a > 0` なら left||
|⤴️| up-if-true| x | `a` を pop し、`a > 0` なら up||
|⤵️| down-if-true| x | `a` を pop し、`a > 0` なら down||
|📏| equal-to | o | (top)`a`, `b` を pop し、 `a == b ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 6]`|
|📈| greater-than | o | (top)`a`, `b` を pop し、 `a > b ? 1 : 0` を push|stack `[7, 4, 6] -> [1, 6]`|
|📉| less-than | o | (top)`a`, `b` を pop し、 `a < b ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 6]`|
|❕| not| o | `a` を pop し、`a > 0 ? 0 : 1` を push する。|stack `[7, 4, 6] -> [3, 6]`|
|🉑| fair | o | `a` を pop し、 `60 <= a < 80 ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 4, 6]`|
|🈴| passed | o | `a` を pop し、 `60 <= a ? 1 : 0` を push|stack `[7, 4, 6] -> [0, 4, 6]`|

### 回数操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🏃‍♀️| speedrun | x | 次の命令を2回行う。操作回数stackに `2` をpushする。||
|🎰| slot | x | (top)`a`, `b`, `c` を pop し、`a == b == c`なら、操作回数stackに `7`,`7`,`7` をpushする。||
|💤| sleep | x | 操作回数stackに `0`,`0`,`0` をpushする。||

### misc

| emoji | name | mode | action | example |
|---|---|---|---|---|
|🥇 | gold | x | stackの最大値を取得し、pushする。 |stack `[7, 4, 6, 2] -> [7, 7, 4, 6, 2]`|
|🥈 | silver | x | stackの2番目に大きい値を取得し、pushする。 |stack `[7, 4, 6, 2] -> [6, 7, 4, 6, 2]`|
|🥉 | bronze | x | stackの3番目に大きい値を取得し、pushする。 |stack `[7, 4, 4, 2] -> [4, 7, 4, 4, 2]`|
|🀄 | median | x | stackの中央値を取得し、pushする。 |stack `[7, 4, 6, 2] -> [5, 7, 4, 6, 2]`|
|📅| calendar| x | 日付をpushする|stack `[7, 4, 6] -> [2021, 2, 28, 11, 20, 43, 7, 4, 6]`|
|🤖| kazoeage-oneesan| x | `a` を pop し、 a * a のグリッド上の左上から右下に行く時、同じところを2度通らない道順の数を頑張って数える。 |stack `[8, 4, 6] ->(4 hours later)->[3266598486981642, 4, 6]`|
