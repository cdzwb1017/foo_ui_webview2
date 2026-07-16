/**
 * window.focus 鑷姩鍖栧洖褰掕剼鏈? *
 * 鍏宠仈鎻愪氦: c216a59  鈥?fix: window.focus 缁曡繃鍓嶅彴閿佽秴鏃讹紝AttachThreadInput 绉掑垏寮圭獥
 *
 * 瑕嗙洊鐩爣:
 *   1. 鍔熻兘姝ｇ‘鎬?鈥?浠庝富绐楀彛 focus(popupId) 绋冲畾杩斿洖 success锛屼笖 invoke 璋冪敤涓嶆姤閿? *   2. 寤惰繜绋冲畾鎬?鈥?蹇€熻繛缁皟鐢?20 娆★紝p50/p95/p99/max 鍧囧湪鍚堢悊闃堝€煎唴
 *   3. 杈圭晫澶勭悊   鈥?focus 涓嶅瓨鍦ㄧ殑 windowId 蹇呴』杩斿洖 success=false
 *   4. 澶氱獥鍙ｅ垏鎹?鈥?3 涓?popup 杞 focus锛宮ax 寤惰繜蹇呴』 < 500ms
 *   5. 鍥炲埌涓荤獥鍙?鈥?focus({windowId: "main"}) 鍙敤
 *
 * 杩愯鏂瑰紡:
 *   A) DevTools 鎺у埗鍙? *      1. 鍦?foobar2000 涓荤獥鍙ｆ寜 F12 鎵撳紑 DevTools
 *      2. 鍒囧埌 Console
 *      3. 绮樿创鏈枃浠跺叏閮ㄥ唴瀹瑰苟鍥炶溅
 *      4. 鏌ョ湅鎺у埗鍙拌緭鍑猴紱瀹屾暣缁撴灉瀛樹簬 window.__fb2kFocusTest
 *
 *   B) MCP fb2k_evaluate锛堥渶鍚姩 MCP 鏈嶅姟鏃惰缃?FB2K_ENABLE_EVAL=1锛? *      1. 璇诲彇鏈枃浠跺唴瀹逛负瀛楃涓? *      2. 璋冪敤 fb2k_evaluate({ expression: <鏈枃浠跺唴瀹? })
 *      3. 杩斿洖鍊煎嵆涓烘祴璇曠粨鏋滃璞?(IIFE 杩斿洖 out)
 *      4. 鍙﹁璋冪敤 fb2k_evaluate({ expression: "JSON.stringify(window.__fb2kFocusTest)" })
 *         鍙噸澶嶈鍙栦笂娆＄粨鏋? *
 * 娉ㄦ剰:
 *   - 鑴氭湰鏈韩鍙兘楠岃瘉"鍔熻兘 + 杩涚▼鍐呭欢杩?锛涜澶嶇幇 Windows ForegroundLockTimeout
 *     瀵艰嚧鐨勫墠鍙伴攣鍦烘櫙锛岄渶鎸?test-window-focus.md 鐨?鎵嬪伐澶嶇幇娴佺▼"鎿嶄綔銆? *   - 杩愯鏃朵細鍒涘缓/閿€姣佸涓?popup锛屼細鐭殏鎶㈠崰鍓嶅彴銆傝鍦ㄧ┖闂茬姸鎬佷笅鎵ц銆? */

(async () => {
    'use strict';

    const out = {
        version: 'c216a59-regression-v1',
        startedAt: new Date().toISOString(),
        cases: [],
        timings: [],
        passed: 0,
        failed: 0,
        skipped: 0,
    };

    const log = (name, status, detail, extra) => {
        const entry = { name, status, detail };
        if (extra) Object.assign(entry, extra);
        out.cases.push(entry);
        if (status === 'pass') out.passed++;
        else if (status === 'fail') out.failed++;
        else if (status === 'skip') out.skipped++;
        const icon = status === 'pass' ? '\u2705' : status === 'fail' ? '\u274C' : '\u23ED\uFE0F';
        console.log(`${icon} ${name}: ${detail}`);
    };

    const hasBridge = typeof fb2k === 'object' && fb2k !== null && typeof fb2k.invoke === 'function';
    if (!hasBridge) {
        log('preflight', 'fail', 'fb2k.invoke 涓嶅彲鐢紙蹇呴』鍦?foobar2000 涓荤獥鍙?WebView2 DevTools 鎴?MCP 涓墽琛岋級');
        window.__fb2kFocusTest = out;
        return out;
    }

    const invoke = (method, params) => fb2k.invoke(method, params || {});

    const timedInvoke = async (method, params) => {
        const t0 = performance.now();
        const result = await invoke(method, params);
        const ms = performance.now() - t0;
        return { result, ms };
    };

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    const cleanup = async () => {
        try { await invoke('window.closeAllPopups'); } catch (_) { /* ignore */ }
    };

    // 棰勬竻鐞?    await cleanup();
    await sleep(150);

    let popupSmall = null;
    let popupLarge = null;

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T1: 鍩虹娴佺▼ 鈥?鍒涘缓灏忓脊绐楀苟浠庝富绐楀彛 focus
    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    try {
        const r = await invoke('window.createPopup', {
            url: 'about:blank',
            width: 400, height: 300,
            title: 'FocusTest T1 (small)',
        });
        if (!r || !r.success) throw new Error((r && r.error) || 'createPopup failed');
        popupSmall = r.windowId;
        await sleep(250); // 绛夊緟 WebView2 棣栧抚锛岄伩鍏嶅共鎵板悗缁鏃?
        const focusRes = await timedInvoke('window.focus', { windowId: popupSmall });
        out.timings.push({ case: 'T1', windowId: popupSmall, ms: focusRes.ms });
        if (focusRes.result && focusRes.result.success) {
            log('T1-basic-focus', 'pass',
                `focus(${popupSmall}) ok in ${focusRes.ms.toFixed(1)}ms`);
        } else {
            log('T1-basic-focus', 'fail',
                (focusRes.result && focusRes.result.error) || 'unknown error');
        }
    } catch (e) {
        log('T1-basic-focus', 'fail', e && e.message ? e.message : String(e));
    }

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T3: 澶у昂瀵稿脊绐?鈥?楠岃瘉 SetForegroundWindow 涓嶅洜绐楀彛澶у皬閫€鍖?    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    try {
        const r = await invoke('window.createPopup', {
            url: 'about:blank',
            width: 1600, height: 1000,
            title: 'FocusTest T3 (large 1600x1000)',
        });
        if (!r || !r.success) throw new Error((r && r.error) || 'createPopup failed');
        popupLarge = r.windowId;
        await sleep(500); // 澶х獥鍙ｉ甯ф洿鎱?
        const focusRes = await timedInvoke('window.focus', { windowId: popupLarge });
        out.timings.push({ case: 'T3', windowId: popupLarge, ms: focusRes.ms });
        const threshold = 500;
        const pass = !!(focusRes.result && focusRes.result.success) && focusRes.ms < threshold;
        log('T3-large-popup', pass ? 'pass' : 'fail',
            `large focus in ${focusRes.ms.toFixed(1)}ms (闃堝€?< ${threshold}ms)`);
    } catch (e) {
        log('T3-large-popup', 'fail', e && e.message ? e.message : String(e));
    }

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T4: 涓嶅瓨鍦ㄧ殑 windowId 鈥?蹇呴』 success=false + 鏄庣‘閿欒
    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    try {
        const r = await invoke('window.focus', { windowId: 'popup_does_not_exist_xyz' });
        const looksCorrect = r && r.success === false && /not found/i.test(r.error || '');
        log('T4-invalid-id', looksCorrect ? 'pass' : 'fail',
            looksCorrect
                ? `姝ｇ‘鎷掔粷: ${r.error}`
                : `寮傚父杩斿洖: ${JSON.stringify(r)}`);
    } catch (e) {
        log('T4-invalid-id', 'fail', e && e.message ? e.message : String(e));
    }

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T6: 蹇€熻繛缁?focus 鈥?绋冲畾鎬?+ 寤惰繜鐩存柟鍥?    //     娉? 棣栨璋冪敤鍙兘璺ㄨ繘绋嬶紙DevTools 鍓嶅彴锛夛紝鍚庣画鍚岃繘绋嬶紱
    //     AttachThreadInput 淇搴斾繚璇佹墍鏈夐噰鏍峰潎 < 200ms銆?    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    try {
        const targets = [popupSmall, popupLarge].filter(Boolean);
        if (targets.length === 0) throw new Error('鍓嶇疆鐢ㄤ緥鏈垱寤轰换浣?popup');

        const N = 20;
        const samples = [];
        for (let i = 0; i < N; i++) {
            const target = targets[i % targets.length];
            const r = await timedInvoke('window.focus', { windowId: target });
            if (!r.result || !r.result.success) {
                throw new Error(`iter ${i}: ${(r.result && r.result.error) || 'no success'}`);
            }
            samples.push(r.ms);
            out.timings.push({ case: 'T6', windowId: target, iter: i, ms: r.ms });
            await sleep(15); // 缁?UI 绾跨▼涓€涓秷鎭车 tick
        }
        samples.sort((a, b) => a - b);
        const pick = (p) => samples[Math.min(samples.length - 1, Math.floor(samples.length * p))];
        const p50 = pick(0.5), p95 = pick(0.95), p99 = pick(0.99);
        const max = samples[samples.length - 1];
        const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
        // 闃堝€硷細p95 < 200ms锛堣繘绋嬪唴 fast path锛夛紝鎵€鏈夐噰鏍?< 1000ms
        const pass = samples.every((ms) => ms < 1000) && p95 < 200;
        log('T6-rapid-succession', pass ? 'pass' : 'fail',
            `n=${N} mean=${mean.toFixed(1)} p50=${p50.toFixed(1)} p95=${p95.toFixed(1)} p99=${p99.toFixed(1)} max=${max.toFixed(1)} (ms)`,
            { n: N, mean, p50, p95, p99, max });
    } catch (e) {
        log('T6-rapid-succession', 'fail', e && e.message ? e.message : String(e));
    }

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T8: 澶氬脊绐楄疆璇㈠垏鎹?鈥?3 涓?popup 鍏?9 娆″垏鎹?    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    const t8Popups = [];
    try {
        for (let i = 0; i < 3; i++) {
            const r = await invoke('window.createPopup', {
                url: 'about:blank',
                width: 320, height: 240,
                title: `FocusTest T8-${i}`,
            });
            if (r && r.success) t8Popups.push(r.windowId);
        }
        if (t8Popups.length !== 3) throw new Error(`浠呭垱寤?${t8Popups.length}/3 涓?popup`);
        await sleep(400);

        const cycleSamples = [];
        for (let i = 0; i < 9; i++) {
            const target = t8Popups[i % t8Popups.length];
            const r = await timedInvoke('window.focus', { windowId: target });
            if (!r.result || !r.result.success) {
                throw new Error(`cycle ${i}: ${(r.result && r.result.error) || 'no success'}`);
            }
            cycleSamples.push(r.ms);
            out.timings.push({ case: 'T8', windowId: target, iter: i, ms: r.ms });
            await sleep(60);
        }
        const maxCycle = Math.max.apply(null, cycleSamples);
        const pass = maxCycle < 500;
        log('T8-multi-cycle', pass ? 'pass' : 'fail',
            `n=${cycleSamples.length} max=${maxCycle.toFixed(1)}ms (闃堝€?< 500ms)`);
    } catch (e) {
        log('T8-multi-cycle', 'fail', e && e.message ? e.message : String(e));
    }

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T9: focus("main") 鈥?鍥炲埌涓荤獥鍙?    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    try {
        const r = await timedInvoke('window.focus', { windowId: 'main' });
        out.timings.push({ case: 'T9', windowId: 'main', ms: r.ms });
        const pass = !!(r.result && r.result.success);
        log('T9-focus-main', pass ? 'pass' : 'fail',
            pass
                ? `focus(main) ok in ${r.ms.toFixed(1)}ms`
                : (r.result && r.result.error) || 'unknown');
    } catch (e) {
        log('T9-focus-main', 'fail', e && e.message ? e.message : String(e));
    }

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T5: 鏈€灏忓寲鍚?focus 鎭㈠ 鈥?鏍囪涓?skip锛堥渶浜哄伐锛?    //     window.minimize 鍩轰簬 caller hwnd锛屼笉鎺ュ彈 windowId锛?    //     鏃犳硶浠庝富绐楀彛绋嬪簭鍖栨渶灏忓寲鎸囧畾 popup锛岀粺涓€鏀惧叆鎵嬪伐娴佺▼銆?    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    log('T5-minimized-restore', 'skip',
        '绋嬪簭鍖栦笉鍙锛坵indow.minimize 浠呭 caller 鐢熸晥锛夛紝瑙?test-window-focus.md 鎵嬪伐娴佺▼');

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // T2, T7, T10: 璺ㄩ〉闈?璺ㄨ繘绋嬪満鏅?鈥?鏍囪涓?skip
    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    log('T2-self-focus', 'skip',
        '闇€鍦ㄥ脊绐楅〉闈㈠唴鎵ц fb2k.invoke("window.focus") 鈥?瑙?test-window-focus.md');
    log('T7-foreground-lock-bypass', 'skip',
        'Windows ForegroundLockTimeout 澶嶇幇闇€浜哄伐鍒囧埌 Notepad 鈥?瑙?test-window-focus.md');
    log('T10-popup-self-focus', 'skip',
        '闇€鍦ㄥ脊绐?DevTools 鍐呮墽琛?鈥?瑙?test-window-focus.md');

    // 娓呯悊
    await cleanup();

    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    // Summary
    // 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
    out.finishedAt = new Date().toISOString();
    const total = out.passed + out.failed;
    const pct = total ? ((out.passed / total) * 100).toFixed(1) : '0';
    console.log('\n\u2550\u2550\u2550 window.focus \u6d4b\u8bd5\u603b\u7ed3 \u2550\u2550\u2550');
    console.log(`  \u901a\u8fc7: ${out.passed}  \u5931\u8d25: ${out.failed}  \u8df3\u8fc7: ${out.skipped}`);
    console.log(`  \u5f00\u59cb: ${out.startedAt}`);
    console.log(`  \u7ed3\u675f: ${out.finishedAt}`);
    console.log(`  \u901a\u8fc7\u7387: ${pct}% (${out.passed}/${total})`);
    if (out.failed > 0) {
        console.warn('\u26A0\uFE0F \u6709\u5931\u8d25\u7528\u4f8b\uff0c\u67e5\u770b\u4e0a\u65b9\u8be6\u7ec6\u8f93\u51fa');
    }
    console.log('\u5b8c\u6574\u7ed3\u679c: window.__fb2kFocusTest');

    window.__fb2kFocusTest = out;
    return out;
})();
