// ╔═══════════════════════════════════════════════════╗
// ║        ⚡ RAINY Quest Completer v4.0              ║
// ║           made by RAINY                           ║
// ║     © RAINY — all rights reserved                 ║
// ╚═══════════════════════════════════════════════════╝
//
// Usage: Paste in Kiwi Browser DevTools Console (discord.com)
//        Also works in Edge/Chrome browser on desktop
// Repo:  github.com/rainy/quest-completer

// ── Integrity check ───────────────────────────────────
const _W = ["⚡ RAINY Quest Completer", "made by RAINY", "© RAINY — all rights reserved", "RAINY"];
const _j = _W.join("");
const _l = _j.length;
const _s = [..._j].reduce((s,c) => s + c.charCodeAt(0), 0);
let _h = 5381;
for (const c of _j) _h = ((((_h << 5) + _h) + c.charCodeAt(0)) & 0xffffffff) >>> 0;
if (_l !== 70 || _s !== 24067 || _h !== 0xebe13088) {
    console.log("%c⛔ RAINY — Integrity check failed. Do not modify credits.", "color:#f87171;font-weight:bold;font-size:13px;");
    throw new Error("Integrity check failed");
}

// ── Styling ───────────────────────────────────────────
const S = {
    banner: "color:#818cf8;font-weight:bold;font-size:15px;",
    sub:    "color:#6366f1;font-size:11px;",
    title:  "color:#818cf8;font-weight:bold;font-size:12px;",
    ok:     "color:#22c55e;font-weight:bold;",
    err:    "color:#f87171;font-weight:bold;",
    warn:   "color:#fbbf24;font-weight:bold;",
    prog:   "color:#818cf8;",
    dim:    "color:#4b5263;",
};

const _ok   = m => console.log(`%c  ✓ ${m}`, S.ok);
const _err  = m => console.log(`%c  ✗ ${m}`, S.err);
const _warn = m => console.log(`%c  ⚠ ${m}`, S.warn);
const _prog = m => console.log(`%c  → ${m}`, S.prog);
const _info = m => console.log(`%c  • ${m}`, S.dim);
const _bar  = (d,t) => {
    const p = Math.floor((d/t)*20);
    return `[${"█".repeat(p)}${"░".repeat(20-p)}] ${d}/${t}s (${Math.floor((d/t)*100)}%)`;
};

// ── Banner ────────────────────────────────────────────
console.clear();
console.log("%c⚡ RAINY Quest Completer", S.banner);
console.log("%cmade by RAINY  •  © RAINY — all rights reserved", S.sub);
console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", S.sub);
_info("Mode: Video Quests Only  |  Platform: Browser / Android");

// ── Init webpack ──────────────────────────────────────
delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();

let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A;
let api = Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get)?.exports?.Bo
       ?? Object.values(wpRequire.c).find(x => x?.exports?.ht?.get)?.exports?.ht
       ?? Object.values(wpRequire.c).find(x => x?.exports?.Qp?.get)?.exports?.Qp;

if (!QuestsStore) { _err("QuestsStore not found! Make sure you are on discord.com"); throw new Error("QuestsStore missing"); }
if (!api)         { _err("API module not found!"); throw new Error("API missing"); }
_ok("Modules loaded");

async function discordPost(url, body) {
    const res = await api.post({ url, body });
    return res.body ?? res;
}

// ── Load video quests ─────────────────────────────────
const VIDEO_TASKS = ["WATCH_VIDEO", "WATCH_VIDEO_ON_MOBILE"];

let quests = [...QuestsStore.quests.values()].filter(q => {
    if (!q.userStatus?.enrolledAt) return false;
    if (q.userStatus?.completedAt) return false;
    if (new Date(q.config.expiresAt).getTime() <= Date.now()) return false;
    return Object.keys((q.config.taskConfig ?? q.config.taskConfigV2)?.tasks ?? {}).some(t => VIDEO_TASKS.includes(t));
});

console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", S.sub);

if (!quests.length) {
    _warn("No video quests found! Make sure you are enrolled in quests.");
} else {
    _ok(`Found ${quests.length} video quest(s):`);
    quests.forEach((q,i) => {
        const tasks  = Object.keys((q.config.taskConfig ?? q.config.taskConfigV2)?.tasks ?? {});
        const task   = VIDEO_TASKS.find(t => tasks.includes(t));
        const target = (q.config.taskConfig ?? q.config.taskConfigV2)?.tasks?.[task]?.target ?? 0;
        console.log(`%c    ${i+1}. ${q.config.messages?.questName ?? "Quest"}  %c[${task} • ${target}s]`, "color:inherit;", S.prog);
    });

    console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", S.sub);

    async function doJob() {
        const quest = quests.pop();
        if (!quest) {
            console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", S.sub);
            _ok("All video quests completed!");
            console.log("%cmade by RAINY  •  © RAINY — all rights reserved", S.sub);
            return;
        }

        const questName  = quest.config.messages?.questName ?? "Quest";
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const taskName   = VIDEO_TASKS.find(t => taskConfig?.tasks?.[t] != null);
        if (!taskName) { _warn(`Skipping: ${questName}`); return doJob(); }

        const secondsNeeded = taskConfig.tasks[taskName].target;
        let   secondsDone   = quest.userStatus?.progress?.[taskName]?.value ?? 0;

        console.log(`%c\n⚡ ${questName}`, S.title);
        _info(`Task: ${taskName}  |  Progress: ${secondsDone}/${secondsNeeded}s`);
        _info("Keep this tab open while running!");

        let errors = 0;
        while (secondsDone < secondsNeeded) {
            await new Promise(r => setTimeout(r, 7000));
            secondsDone = Math.min(secondsNeeded, secondsDone + 7);
            try {
                const res = await discordPost(`/quests/${quest.id}/video-progress`, {
                    timestamp: Math.min(secondsNeeded, secondsDone + Math.random())
                });
                errors = 0;
                _prog(_bar(secondsDone, secondsNeeded));
                if (res.completed_at) break;
            } catch(e) {
                errors++;
                _err(`Error (${errors}): ${e?.message ?? JSON.stringify(e)}`);
                if (errors >= 5) { _err("Too many errors, skipping quest."); break; }
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        _ok(`${questName} — completed!`);
        doJob();
    }

    doJob();
}
