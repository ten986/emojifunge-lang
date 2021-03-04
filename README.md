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

root stack についての説明

## スタックモード

要素は、スタックもしくは数値である。

スタックのネストができる

最初は通常モードで、通常モードとスタックモードがある

モードが変わると、pop の仕様が変わる

通常モードは、stack を開いてから pop する。
`(top)[[a, b, c], [], [d, e], f, [g, h]]` のようなスタックがあったとき、
1度目の pop では、`[a, b, c]` が top にあるので、
開いて
`(top)[a, b, c, [], [d, e], f, [g, h]]`となる。
改めて、`a, b, c, ...` と pop する。

スタックモードは、stack でも 数値 でも 構わず pop する。
`(top)[[a, b, c], [], [d, e], f, [g, h]]` のようなスタックがあったとき、
`[a, b, c], [], [d, e], [f], ...` のように pop していく。

## 演算について

n個の要素の演算を行うとき、

すべての要素が 数値 である場合は、
指定された演算を行い、結果を返す、

それ以外の場合は、数値を要素数1のスタックとみなし、
すべてのスタックの 0番目、1番目、2番目、...、min(スタックの要素数) - 1 番目 に対してそれぞれ再帰的に処理をし、0番目の結果、 1番目の結果、... を保持した スタックを返す。
min(スタックの要素数) - 1 番目 より 後の要素は破棄される。

## 移動に関する仕様

最初は(x, y) = (0, 0)に位置し、移動方向は(dx, dy) = (1,0)

移動先を、(x, y) = (x+dx, y+dy)
移動先にemojiがあれば移動する

emojiがなければ、(dx, dy) = (-dy, dx) として試す。
右回りに試すと思えば良い

4回試してemojiがなければ終了する

## emoji と stack

emoji は codeUnit による Stack として表現される。
例えば、0️⃣ の codeUnit は [48, 65039, 8419] であり、
プログラム上では、 [8419, 65039, 48] という逆順のstackで表現される。

https://jsprimer.net/basic/string-unicode/



## コマンド一覧

### 入出力

| emoji | name | mode | action | example |
|---|---|---|---|---|
|ℹ️| input-number | x | 入力を数値として受け取り、 pushする。空白などの直前まで受け取る。 | stack `[53, 2] -> [32, 53, 2]` input: `32 54 AA` -> ` 54 AA`|
|🔤| input-ascii | x | 入力を ASCII CODE として受け取り、 pushする。|stack `[53, 2] -> [41, 53, 2]` input: `ABC` -> `BC`|
|🔢| output-number | o | `a` を pop し、数値として出力する。| stack `[32, 53, 2] -> [53, 2]` output: `32`|
|🔡| output-ascii | o | `a` を pop し、ASCII CODEとして出力する。| stack `[41, 53, 2] -> [53, 2]` output: `A`|
|🔣| output-emoji | x | `a` を pop し、文字出力 stackのtopを emoji として出力する。| stack `[[8419, 65039, 48], 53, 2] -> [53, 2]` output: `0️⃣`|
|🐱| cat | x | 入力をそのままoutputする。 |input:`ABC` output:`ABC`|
|🐶| dog | x | 入力を反転してoutputする。 |input:`ABC` output:`CBA`|

### 盤面のemojii

| emoji | name | mode | action | example |
|---|---|---|---|---|
|👀| pick-emoji | x | (x + dx, y + dy) の emoji の codeunit を、stackとしてpush する。操作回数 stack に 0 を push する。||

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
|❗️| fact| o | `a` を pop し、`a` の階乗 を push する。|stack `[7, 4, 6] -> [5040, 4, 6]`|
|‼️| semifact| o | `a` を pop し、`a` の半階乗 を push する。|stack `[7, 4, 6] -> [105, 4, 6]`|
|👍| increment | o | `a` を pop し、`a + 1` を push する。|stack `[7, 4, 6] -> [8, 4, 6]`|
|👎| decrement | o | `a` を pop し、`a - 1` を push する。|stack `[7, 4, 6] -> [8, 4, 6]`|

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
|📧| create-empty-stack| x | 空の stack を作り、pushする。||
|💌| create-new-stack| o | `a` を 数値として pop し、 `a` 回 pop する。空の stack を作り、空の stack に対し、`a` 回 pop したものを 逆順に push する（すなわち元通りの順番のstackができる）。 この stack を push する。 ||
|📨 | change-stackmode  | x | stackmode の 通常モード と スタックモード を切り替える。|||

### ネストスタック操作

| emoji | name | mode | action | example |
|---|---|---|---|---|
|📬 | into-nested-stack | x | 操作中の stack の top を、現在の操作中の stack とする。 数値だった場合、1要素の stack に変換してから行う。 ||
|📫 | exit-nested-stack | x | 現在操作中の stack の親を、現在操作中の stack とする。 親 stack がない場合は、この stack のみを要素とする 新たな stack を作成し、それを親 stack とする。 root stack は、この新たな stack に変更される。 ||
|📪 | goto-root-stack | x | root stack を、現在操作中の stack とする。 ||
|📭 | open-stack | x | `a` を raw-state で pop し、 stack だった場合、開いて push する。数値の場合、そのままpushする。||

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
