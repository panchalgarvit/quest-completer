// ╔═══════════════════════════════════════════════════╗
// ║        ⚡ RAINY Quest Completer v4.0              ║
// ║           made by RAINY                           ║
// ║     © RAINY — all rights reserved                 ║
// ╚═══════════════════════════════════════════════════╝

// ── Integrity check ───────────────────────────────────
const _W = ["⚡ RAINY Quest Completer", "made by RAINY", "© RAINY — all rights reserved", "RAINY"];
const _j = _W.join("");
const _l = _j.length;
const _s = [..._j].reduce((s,c) => s + c.charCodeAt(0), 0);
let _h = 5381;
for (const c of _j) _h = ((((_h << 5) + _h) + c.charCodeAt(0)) & 0xffffffff) >>> 0;
if (_l !== 70 || _s !== 24067 || _h !== 0xebe13088) {
    console.log("%c⛔ RAINY — Integrity check failed.", "color:#f87171;font-weight:bold;");
    throw new Error("Integrity check failed");
}

// ── Styling ───────────────────────────────────────────
const _ok   = m => console.log(`✓ ${m}`);
const _err  = m => console.log(`✗ ${m}`);
const _warn = m => console.log(`⚠ ${m}`);
const _prog = m => console.log(`→ ${m}`);
const _info = m => console.log(`• ${m}`);
const _bar  = (d,t) => {
    const p = Math.floor((d/t)*20);
    return `[${"█".repeat(p)}${"░".repeat(20-p)}] ${d}/${t}s (${Math.floor((d/t)*100)}%)`;
};

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("⚡ RAINY Quest Completer — Android");
console.log("made by RAINY · all rights reserved");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

// ── Get token from webpack ────────────────────────────
delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();

let token = null;
for (let m of Object.values(wpRequire.c)) {
    try {
        for (let key of Object.keys(m?.exports ?? {})) {
            let t = m.exports[key]?.getToken?.();
            if (typeof t === 'string' && t.length > 30) { token = t; break; }
        }
        if (token) break;
    } catch(e) {}
}

let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A;

if (!token)       { _err("Could not get token!"); throw new Error("No token"); }
if (!QuestsStore) { _err("QuestsStore not found!"); throw new Error("No QuestsStore"); }

_ok(`Token found: ${token.substring(0,15)}...`);
_ok("QuestsStore loaded");

// ── API using raw fetch (works on Android!) ───────────
async function discordPost(url, body) {
    const res = await fetch(`https://discord.com/api/v9${url}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) throw { status: res.status, body: json };
    return json;
}

// ── Load video quests ─────────────────────────────────
const VIDEO_TASKS = ["WATCH_VIDEO", "WATCH_VIDEO_ON_MOBILE"];

let quests = [...QuestsStore.quests.values()].filter(q => {
    if (!q.userStatus?.enrolledAt) return false;
    if (q.userStatus?.completedAt) return false;
    if (new Date(q.config.expiresAt).getTime() <= Date.now()) return false;
    return Object.keys((q.config.taskConfig ?? q.config.taskConfigV2)?.tasks ?? {}).some(t => VIDEO_TASKS.includes(t));
});

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

if (!quests.length) {
    _warn("No video quests found!");
} else {
    _ok(`Found ${quests.length} video quest(s):`);
    quests.forEach((q,i) => {
        const tasks  = Object.keys((q.config.taskConfig ?? q.config.taskConfigV2)?.tasks ?? {});
        const task   = VIDEO_TASKS.find(t => tasks.includes(t));
        const target = (q.config.taskConfig ?? q.config.taskConfigV2)?.tasks?.[task]?.target ?? 0;
        _info(`${i+1}. ${q.config.messages?.questName ?? "Quest"} [${task} • ${target}s]`);
    });

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    async function doJob() {
        const quest = quests.pop();
        if (!quest) {
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            _ok("All video quests completed!");
            console.log("made by RAINY · all rights reserved");
            return;
        }

        const questName  = quest.config.messages?.questName ?? "Quest";
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const taskName   = VIDEO_TASKS.find(t => taskConfig?.tasks?.[t] != null);
        if (!taskName) { _warn(`Skipping: ${questName}`); return doJob(); }

        const secondsNeeded = taskConfig.tasks[taskName].target;
        let   secondsDone   = quest.userStatus?.progress?.[taskName]?.value ?? 0;

        console.log(`\n⚡ ${questName}`);
        _info(`Task: ${taskName}`);
        _info(`Progress: ${secondsDone}/${secondsNeeded}s`);
        _info("Keep this tab open!");

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
                _err(`Error (${errors}): ${e?.status ?? ""} ${JSON.stringify(e?.body ?? e)}`);
                if (errors >= 5) { _err("Too many errors, skipping."); break; }
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        _ok(`${questName} — completed!`);
        doJob();
    }

    doJob();
}
