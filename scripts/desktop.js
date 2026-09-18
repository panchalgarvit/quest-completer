// ╔═══════════════════════════════════════════════════╗
// ║        ⚡ RAINY Quest Completer v4.0              ║
// ║           made by RAINY                           ║
// ║     © RAINY — all rights reserved                 ║
// ╚═══════════════════════════════════════════════════╝
//
// Usage: Paste in Discord Desktop App DevTools Console
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
_info("Mode: All Quests  |  Platform: Discord Desktop");

// ── Init webpack ──────────────────────────────────────
delete window.$;
let wpRequire = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();

let QuestsStore    = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A;
let ChannelStore   = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getAllThreadsForParent)?.exports?.A;
let GuildChanStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getSFWDefaultChannel)?.exports?.Ay;
let api            = Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get)?.exports?.Bo
                  ?? Object.values(wpRequire.c).find(x => x?.exports?.ht?.get)?.exports?.ht
                  ?? Object.values(wpRequire.c).find(x => x?.exports?.Qp?.get)?.exports?.Qp;
let RPCModule      = Object.values(wpRequire.c).find(x => x?.exports?.F?.setLocalPresence)?.exports?.F
                  ?? Object.values(wpRequire.c).find(x => x?.exports?.default?.setLocalPresence)?.exports?.default;

if (!QuestsStore) { _err("QuestsStore not found!"); throw new Error("QuestsStore missing"); }
_ok(`API: ${api ? "found" : "not found"}  |  RPC: ${RPCModule ? "found" : "not found"}`);

async function discordPost(url, body) {
    if (api?.post) { const res = await api.post({ url, body }); return res.body ?? res; }
    throw new Error("API module not found");
}

// ── Load quests ───────────────────────────────────────
const SUPPORTED = ["PLAY_ON_DESKTOP","STREAM_ON_DESKTOP","PLAY_ACTIVITY","WATCH_VIDEO","WATCH_VIDEO_ON_MOBILE"];

let quests = [...QuestsStore.quests.values()].filter(q =>
    q.userStatus?.enrolledAt &&
    !q.userStatus?.completedAt &&
    new Date(q.config.expiresAt).getTime() > Date.now() &&
    SUPPORTED.some(t => Object.keys((q.config.taskConfig ?? q.config.taskConfigV2)?.tasks ?? {}).includes(t))
);

console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", S.sub);

if (!quests.length) {
    _warn("No uncompleted quests found!");
} else {
    _ok(`Found ${quests.length} quest(s):`);
    quests.forEach((q,i) => {
        const taskConfig = q.config.taskConfig ?? q.config.taskConfigV2;
        const task = SUPPORTED.find(t => taskConfig?.tasks?.[t]);
        console.log(`%c    ${i+1}. ${q.config.messages?.questName ?? "Quest"}  %c[${task}]`, "color:inherit;", S.prog);
    });

    console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", S.sub);

    async function doJob() {
        const quest = quests.pop();
        if (!quest) {
            console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", S.sub);
            _ok("All quests completed!");
            console.log("%cmade by RAINY  •  © RAINY — all rights reserved", S.sub);
            return;
        }

        const questName  = quest.config.messages?.questName ?? "Quest";
        const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
        const taskName   = SUPPORTED.find(t => taskConfig?.tasks?.[t] != null);
        if (!taskName) { _warn(`Skipping: ${questName}`); return doJob(); }

        const secondsNeeded = taskConfig.tasks[taskName].target;
        let   secondsDone   = quest.userStatus?.progress?.[taskName]?.value ?? 0;

        console.log(`%c\n⚡ ${questName}`, S.title);
        _info(`Task: ${taskName}  |  Progress: ${secondsDone}/${secondsNeeded}s`);

        const linkedGame = quest.config.linkedGames?.[0];
        if (linkedGame && RPCModule?.setLocalPresence) {
            try {
                RPCModule.setLocalPresence({
                    pid: Math.floor(Math.random() * 99999) + 1000,
                    socketId: "questhack",
                    presence: { application_id: linkedGame.id, name: linkedGame.name ?? questName, type: 0, timestamps: { start: Date.now() } }
                });
                _ok(`Spoofed presence: ${linkedGame.name ?? questName}`);
                await new Promise(r => setTimeout(r, 3000));
            } catch(e) { _warn("Could not spoof presence"); }
        }

        if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
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
                    _err(`Video error (${errors}): ${e?.message ?? JSON.stringify(e)}`);
                    if (errors >= 5) { _err("Too many errors, skipping."); break; }
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
        } else {
            const channelId = ChannelStore?.getSortedPrivateChannels?.()?.[0]?.id ??
                Object.values(GuildChanStore?.getAllGuilds?.() ?? {}).find(x => x?.VOCAL?.length > 0)?.VOCAL[0]?.channel?.id ?? "0";
            const streamKey = `call:${channelId}:1`;
            _info(`Stream key: ${streamKey}`);
            let errors = 0;
            while (secondsDone < secondsNeeded) {
                await new Promise(r => setTimeout(r, 20000));
                try {
                    const res = await discordPost(`/quests/${quest.id}/heartbeat`, { stream_key: streamKey, terminal: false });
                    secondsDone = Math.min(secondsNeeded, res.progress?.[taskName]?.value ?? secondsDone + 20);
                    errors = 0;
                    _prog(_bar(secondsDone, secondsNeeded));
                    if (secondsDone >= secondsNeeded) {
                        await discordPost(`/quests/${quest.id}/heartbeat`, { stream_key: streamKey, terminal: true });
                        break;
                    }
                } catch(err) {
                    errors++;
                    _err(`Heartbeat error (${errors}): ${JSON.stringify(err)}`);
                    if (errors >= 5) { _err("Too many errors, skipping."); break; }
                }
            }
        }

        _ok(`${questName} — completed!`);
        doJob();
    }

    doJob();
}
