# window.focus 鑷姩鍖栨祴璇?
> **娴嬭瘯鐩爣**: 楠岃瘉 `window.focus` 鍦?AttachThreadInput 淇鍚庣殑琛屼负姝ｇ‘鎬т笌鎬ц兘銆? 
> **鍏宠仈鎻愪氦**: `c216a59` 鈥?fix: window.focus 缁曡繃鍓嶅彴閿佽秴鏃讹紝AttachThreadInput 绉掑垏寮圭獥  
> **鐢ㄦ埛鍙嶉鍘熸枃**: "window.focus 濡傛灉浠庝富椤靛彂閫佹寚浠よ寮圭獥缃《鎴栬€呴€氳繃娑堟伅浼犻€掕寮圭獥鑷繁婵€娲荤疆椤讹紝鐣岄潰鍙嶅簲鏈夋椂蹇湁鏃舵參锛堝挨鍏跺脊绐楅〉闈㈠昂瀵稿ぇ涓€鐐规椂锛夛紝浣嗗湪鎺у埗鍙版墽琛?window.focus 绉掑垏鎹€傛槸涓嶆槸鎶㈣繘绋嬶紵"

## 缂洪櫡鑳屾櫙

Windows `ForegroundLockTimeout` 鏈哄埗浼氬湪璋冪敤 `SetForegroundWindow` 鐨勮繘绋?**涓嶆槸褰撳墠鍓嶅彴杩涚▼** 鏃讹紝瀵规縺娲昏姹傚己鍒跺欢杩?200ms鈥?s锛堥粯璁わ級锛屾湡闂村彧闂儊浠诲姟鏍忚€屼笉鐪熸缃《銆傝繖灏辫В閲婁簡涓轰綍鐢ㄦ埛鎰熺煡鍒扮殑鍝嶅簲"鏃跺揩鏃舵參"锛?
1. 鐢ㄦ埛鐐瑰嚮 fb2k 涓荤獥鍙ｉ噷鐨勬寜閽紙鎴?DevTools 閲岀殑鎺у埗鍙帮級鍙戝嚭 `fb2k.invoke('window.focus', {windowId})` 鎸囦护銆?2. 鎸囦护寮傛鍥炲埌 C++ UI 绾跨▼鎵ц `SetForegroundWindow(popupHwnd)`銆?3. 鍦ㄦ寚浠ゅ埌杈?UI 绾跨▼鐨勮繃绋嬩腑锛岀敤鎴峰彲鑳藉凡缁忓垏鍒板叾浠栫獥鍙ｏ紙杈撳叆娉曟潯銆佸埆鐨?app銆丏evTools锛夛紝姝ゆ椂 fb2k 涓嶆槸鍓嶅彴杩涚▼ 鈫?`ForegroundLockTimeout` 鐢熸晥 鈫?鐪嬪埌"鍗￠】"銆?
`c216a59` 淇閫氳繃 `AttachThreadInput` 涓存椂鎶婂綋鍓嶇嚎绋嬮檮鐫€鍒板墠鍙扮嚎绋嬶紝浣?`SetForegroundWindow` 瑙嗕负鍚岃繘绋嬭皟鐢紝缁曡繃闄愬埗锛涜皟鐢ㄥ畬姣曠珛鍗?`AttachThreadInput(..., FALSE)` 鏂紑锛岄伩鍏嶇暀涓嬫畫鐣欒繛鎺ャ€?
瀹炵幇瑙?`src/api/WindowApi.cpp:930-946`锛坄WindowFocus` 鍑芥暟锛夈€?
## 娴嬭瘯鐢ㄤ緥娓呭崟

| # | 鐢ㄤ緥鍚?| 鑷姩鍖?| 楠岃瘉鐐?| 棰勬湡 |
|---|--------|--------|--------|------|
| T1 | 鍩虹娴佺▼ 鈥?鍒涘缓灏忓脊绐楀苟 focus | 鉁?| `success=true`锛屾棤寮傚父 | pass |
| T2 | 寮圭獥鍐呰嚜韬?focus 鏃犲弬鏁?| 馃枑 | 鍦ㄥ脊绐楀唴璋冪敤 `focus()` | pass |
| T3 | 澶у昂瀵稿脊绐?focus (1600脳1000) | 鉁?| 寤惰繜 < 500ms | pass |
| T4 | focus 涓嶅瓨鍦ㄧ殑 windowId | 鉁?| `success=false, error="Window not found"` | pass |
| T5 | 鏈€灏忓寲鍚?focus 鎭㈠ | 馃枑 | 绐楀彛浠庢渶灏忓寲鎭㈠骞惰仛鐒?| pass |
| T6 | 蹇€熻繛缁?focus 绋冲畾鎬?| 鉁?| n=20, p95 < 200ms | pass |
| T7 | 鍓嶅彴閿佺粫杩囷紙璺ㄨ繘绋嬪満鏅級| 馃枑 | 鍒囧埌 Notepad 鍚?focus 寮圭獥 < 100ms | pass |
| T8 | 澶氬脊绐楄疆璇㈠垏鎹?| 鉁?| 3 涓?popup 脳 3 杞紝max < 500ms | pass |
| T9 | focus("main") 鍥炲埌涓荤獥鍙?| 鉁?| `success=true` | pass |
| T10 | 寮圭獥鑷韩 focus 鑷繁 | 馃枑 | 寮圭獥鍐?focus(self.windowId) | pass |

**鍥句緥**锛氣渽 = 鑷姩鍖栬鐩栵紱馃枑 = 闇€瑕佷汉宸ラ厤鍚堛€?
鑷姩鍖栭儴鍒嗙敱 `test-window-focus.js` 鎵ц锛涗汉宸ラ儴鍒嗚鏈枃"鎵嬪伐澶嶇幇娴佺▼"銆?
---

## 杩愯鏂瑰紡 A锛欴evTools 鎺у埗鍙帮紙鎺ㄨ崘蹇€熼獙璇侊級

1. 鍚姩 foobar2000锛堝凡瀹夎 foo_ui_webview2 缁勪欢锛夈€?2. 鍦ㄤ富绐楀彛鎸?`F12` 鎵撳紑 DevTools锛堣嫢鏈惎鐢紝瑙?`docs/DEVTOOLS.md`锛夈€?3. 鍒囧埌 **Console** 闈㈡澘銆?4. 鎵撳紑 `tests/manual/test-window-focus.js`锛屽鍒跺叏閮ㄥ唴瀹广€?5. 绮樿创鍒?Console 骞跺洖杞︺€?6. 瑙傚療杈撳嚭锛氭瘡涓敤渚嬩竴琛?`鉁?鉂?鈴笍`锛屾湯灏捐緭鍑烘€荤粨銆?7. 瀹屾暣缁撴灉瀵硅薄淇濆瓨鍦?`window.__fb2kFocusTest`锛屽彲杩涗竴姝ユ煡鐪嬶細

```javascript
// 鏌ョ湅鎵€鏈夎鏃?window.__fb2kFocusTest.timings;

// 鏌ョ湅澶辫触鐨勭敤渚?window.__fb2kFocusTest.cases.filter(c => c.status === 'fail');

// T6 寤惰繜鐩存柟鍥?window.__fb2kFocusTest.cases.find(c => c.name === 'T6-rapid-succession');
```

### 鏈熸湜杈撳嚭绀轰緥锛堜慨澶嶅悗锛?
```
鉁?T1-basic-focus: focus(popup_1) ok in 3.2ms
鉁?T3-large-popup: large focus in 8.7ms (闃堝€?< 500ms)
鉁?T4-invalid-id: 姝ｇ‘鎷掔粷: Window not found
鉁?T6-rapid-succession: n=20 mean=2.1 p50=1.8 p95=4.3 p99=5.9 max=6.1 (ms)
鉁?T8-multi-cycle: n=9 max=5.4ms (闃堝€?< 500ms)
鉁?T9-focus-main: focus(main) ok in 2.7ms
鈴笍 T5-minimized-restore: 绋嬪簭鍖栦笉鍙 ...
鈴笍 T2-self-focus: 闇€鍦ㄥ脊绐楅〉闈㈠唴鎵ц ...
鈴笍 T7-foreground-lock-bypass: 闇€浜哄伐鍒囧埌 Notepad ...
鈴笍 T10-popup-self-focus: 闇€鍦ㄥ脊绐?DevTools 鍐呮墽琛?...

鈺愨晲鈺?window.focus 娴嬭瘯鎬荤粨 鈺愨晲鈺?  閫氳繃: 6  澶辫触: 0  璺宠繃: 4
  閫氳繃鐜? 100.0% (6/6)
```

---

## 杩愯鏂瑰紡 B锛歁CP锛坒b2k_evaluate锛?
浠呭綋闇€瑕?AI/鑴氭湰鍖栧洖褰掓椂浣跨敤銆傝姹傦細

- MCP Server 鍚姩鏃惰缃幆澧冨彉閲?`FB2K_ENABLE_EVAL=1`
- fb2k 杩愯涓紝CDP 绔彛锛堥粯璁?9222锛夊彲杈?
### 涓€閿墽琛岃剼鏈紙PowerShell锛?
```powershell
$script = Get-Content -Path "tests/manual/test-window-focus.js" -Raw -Encoding UTF8

# 閫氳繃宸插惎鍔ㄧ殑 MCP 瀹㈡埛绔皟鐢?fb2k_evaluate锛堜吉浠ｇ爜锛屽彇鍐充簬 MCP 瀹夸富锛?# mcp_foo-ui-webvie_fb2k_evaluate -Expression $script
```

鍦ㄦ敮鎸?MCP 鐨?AI Agent 閲岋紝鐩存帴璋冪敤锛?
```
fb2k_evaluate({ expression: "<绮樿创鏁翠釜 test-window-focus.js 鍐呭>" })
```

**杩斿洖鍊?*鍗充负 IIFE 杩斿洖鐨勭粨鏋滃璞★紙JSON 鍖栵級锛屽寘鍚?`passed/failed/skipped/cases/timings/version`銆?
璇诲彇淇濆瓨鐨勪笂娆＄粨鏋滐細

```
fb2k_evaluate({ expression: "JSON.stringify(window.__fb2kFocusTest, null, 2)" })
```

---

## 鎵嬪伐澶嶇幇娴佺▼

> 鑷姩鍖栬剼鏈棤娉曞鐜?`ForegroundLockTimeout` 鍦烘櫙锛屽洜涓?DevTools/CDP 鎵ц鏃?fb2k 涓?JS 閮藉湪鍚岃繘绋嬩笂涓嬫枃涓€備互涓嬫祦绋嬬敤鏉ラ獙璇?**T2/T5/T7/T10** 杩欏嚑涓渶瑕佺湡瀹炵敤鎴疯涓虹殑鍏抽敭鐢ㄤ緥銆?
### T7 鈥?鍓嶅彴閿佺粫杩囷紙鏈€閲嶈鐨勫洖褰掔敤渚嬶級

**鐩殑**锛氶獙璇?fb2k 涓嶆槸鍓嶅彴杩涚▼鏃讹紝浠庝富绐楀彛 focus 寮圭獥涔熻兘绔嬪嵆鐢熸晥銆?
1. 鍚姩 foobar2000锛屾墦寮€涓荤獥鍙ｃ€?2. 鍦ㄤ富绐楀彛 DevTools锛團12锛夋墽琛岋細

   ```javascript
   // 鍑嗗锛氬垱寤?1 涓ぇ灏哄 popup锛屾斁鍦ㄥ彸渚т笉纰嶇溂鐨勪綅缃?   const { windowId: P } = await fb2k.invoke('window.createPopup', {
     url: 'about:blank',
     width: 1600, height: 1000,
     x: 100, y: 100,
     title: 'Focus Test T7'
   });
   window.__T7_popup = P;
   console.log('鍑嗗濂?popup:', P);
   ```

3. 鎵撳紑涓€涓?**Notepad**锛堣浜嬫湰锛夛紝鐢?Alt+Tab 鍒囧埌 Notepad锛屼娇 fb2k **瀹屽叏涓嶅湪鍓嶅彴**銆?4. 淇濇寔 Notepad 鍓嶅彴锛屾寜 `Win + R` 璋冨嚭杩愯妗?鈫?鍐嶆纭繚 fb2k 涓嶆槸鍓嶅彴銆?5. 閫氳繃涓€涓缃殑瀹氭椂鍣ㄥ洖鍒?fb2k锛堝叧閿細璁╂祻瑙堝櫒浠ｇ爜鍦?fb2k **闈炲墠鍙?* 鏃惰窇璧锋潵锛夛細

   > 鐢变簬 DevTools 鐩存帴绮樿创浼氭妸鍓嶅彴鍒囧洖 fb2k锛屽繀椤荤敤 `setTimeout` 寤舵椂銆?
   鍦?fb2k 涓荤獥鍙?DevTools 閲?**棰勫厛** 绮樿创涓嬮潰浠ｇ爜骞跺洖杞︼紝鐒跺悗**绔嬪埢** Alt+Tab 鍒?Notepad锛?
   ```javascript
   // 寤惰繜 5 绉掑啀鍙?focus 鈥?鏈熼棿璇?Alt+Tab 鍒?Notepad
   setTimeout(async () => {
     const t0 = performance.now();
     const r = await fb2k.invoke('window.focus', { windowId: window.__T7_popup });
     const ms = performance.now() - t0;
     console.log(`[T7] focus: success=${r.success}, invoke=${ms.toFixed(1)}ms`);
     // 瑙傛祴: 寮圭獥搴旇绔嬪嵆璺冲埌鍓嶅彴锛堜慨澶嶅墠浼氬欢杩?0.2-5s 鎴栧彧闂儊浠诲姟鏍忥級
   }, 5000);
   console.log('5 绉掑悗鑷姩鎵ц focus 鈥?绔嬪埢 Alt+Tab 鍒?Notepad');
   ```

6. 瑙傛祴锛?   - **淇鍓嶏紙鏃?AttachThreadInput锛?*锛? 绉掑悗锛宲opup 鏈珛鍗崇疆椤讹紝浠诲姟鏍忓浘鏍囬棯鐑侊紱鍑犵鍚庢墠鍒囧洖銆?   - **淇鍚?*锛? 绉掑悗锛宲opup 绉掑垏鍒板墠鍙帮紝Notepad 琚帇鍒板悗闈€?
7. 娓呯悊锛歚await fb2k.invoke('window.closeAllPopups');`

---

### T2 / T10 鈥?寮圭獥鍐呴儴 focus

1. 鍒涘缓涓€涓甫鐪熷疄椤甸潰鐨勫脊绐楋紙涓嶆槸 about:blank锛夛細

   ```javascript
   const { windowId: P } = await fb2k.invoke('window.createPopup', {
     url: 'test.html',  // 鎴栦换浣曞凡鍦?resources/dist/ 涓嬬殑椤甸潰
     width: 600, height: 400, title: 'T2/T10 popup'
   });
   ```

2. 鍦ㄥ脊绐楀唴鎵撳紑 DevTools锛堝彸閿?鈫?Inspect锛屾垨 F12锛夈€?3. 鍦ㄥ脊绐楃殑 Console 鎵ц锛?
   ```javascript
   // T2 鈥?鏃犲弬鏁?focus锛堝簲鑱氱劍 caller = 鏈脊绐楋級
   await fb2k.invoke('window.focus');

   // T10 鈥?鏄惧紡浼犲叆鏈獥鍙?ID
   const id = (await fb2k.invoke('window.getCurrentWindowId')).windowId;
   await fb2k.invoke('window.focus', { windowId: id });
   ```

4. 涓ゆ閮藉簲杩斿洖 `{success: true}`锛屼笖寮圭獥淇濇寔鍓嶅彴銆?
---

### T5 鈥?鏈€灏忓寲鍚?focus 鎭㈠

1. 鍦ㄤ富绐楀彛 DevTools锛?
   ```javascript
   const { windowId: P } = await fb2k.invoke('window.createPopup', {
     url: 'about:blank', width: 400, height: 300,
     title: 'T5 minimize test'
   });
   window.__T5 = P;
   ```

2. 鍦ㄥ脊绐楀唴鎵撳紑 DevTools锛屾墽琛?`await fb2k.invoke('window.minimize');`銆傚脊绐楀簲鏈€灏忓寲鍒颁换鍔℃爮銆?3. 鍥炲埌涓荤獥鍙?DevTools锛?
   ```javascript
   const r = await fb2k.invoke('window.focus', { windowId: window.__T5 });
   console.log('T5:', r);  // 鏈熸湜 {success: true}
   ```

4. 寮圭獥搴斾粠鏈€灏忓寲鎭㈠骞剁疆椤躲€?
---

## 閫氳繃/澶辫触鍒ゅ畾

**PASS 瑕佹眰**锛堝叏閮ㄨ嚜鍔ㄥ寲鐢ㄤ緥閮藉繀椤绘弧瓒筹級锛?
- T1/T3/T9锛歚success=true` 涓?`invoke` 寤惰繜 < 500ms
- T4锛歚success=false` 涓?error 鍚?"not found"
- T6锛歯=20 閲囨牱锛宲95 < 200ms锛宮ax < 1000ms
- T8锛歯=9 閲囨牱锛宮ax < 500ms
- 鎵嬪伐鐢ㄤ緥 T2/T5/T7/T10锛氭寜瑙傛祴鍒ゆ柇锛圱7 鏈€鍏抽敭锛?
**FAIL 淇″彿**锛?
- 浠讳綍鐢ㄤ緥 `success=false` 鎴栨姏寮傚父
- T6 p95 瓒呰繃 200ms锛氭彁绀?UI 绾跨▼琚樆濉炴垨瀛樺湪姝婚攣
- T6 max 瓒呰繃 1000ms锛氭彁绀哄墠鍙伴攣閫昏緫鍙兘鍥炲綊

## 鍥炲綊璐熻矗浜?
- **鎻愬嚭浜?*锛氱敤鎴峰弽棣堬紙2026-04锛?- **淇鑰?*锛歂ereaFantasia
- **娴嬭瘯鑴氭湰**锛歚tests/manual/test-window-focus.js`
- **C++ 瀹炵幇**锛歚src/api/WindowApi.cpp:905-949`
