import { useState, useEffect, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Nunito:wght@300;400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0d1b2a;
    --navy-mid: #152238;
    --navy-light: #1e3354;
    --navy-card: #16263d;
    --gold: #c9a84c;
    --gold-light: #e8c96d;
    --gold-glow: rgba(201,168,76,0.18);
    --gold-dim: rgba(201,168,76,0.35);
    --white: #f8f4ec;
    --white-dim: rgba(248,244,236,0.7);
    --white-faint: rgba(248,244,236,0.12);
    --accent: #4a90d9;
    --green: #3dba7a;
    --red: #e05c5c;
    --purple: #8b5cf6;
    --border: rgba(201,168,76,0.2);
    --shadow: 0 8px 32px rgba(0,0,0,0.45);
    --radius: 16px;
    --radius-sm: 10px;
  }

  body { background: var(--navy); color: var(--white); font-family: 'Nunito', sans-serif; overflow-x: hidden; }

  .app-shell { display: flex; height: 100vh; overflow: hidden; }

  /* ─── SIDEBAR ─── */
  .sidebar {
    width: 240px; min-width: 240px; background: var(--navy-mid);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 0; overflow-y: auto; position: relative; z-index: 10;
    transition: width 0.3s;
  }
  .sidebar-logo {
    padding: 28px 20px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .logo-cross { font-size: 26px; color: var(--gold); line-height: 1; }
  .logo-text { font-family: 'Cinzel', serif; font-size: 14px; font-weight: 700; color: var(--gold); line-height: 1.2; }
  .logo-sub { font-size: 9px; color: var(--white-dim); font-weight: 400; letter-spacing: 0.5px; }
  .sidebar-nav { flex: 1; padding: 12px 0; }
  .nav-item {
    display: flex; align-items: center; gap: 12px; padding: 13px 20px; cursor: pointer;
    font-size: 13px; font-weight: 600; color: var(--white-dim); transition: all 0.2s;
    border-left: 3px solid transparent; position: relative;
  }
  .nav-item:hover { background: var(--white-faint); color: var(--white); }
  .nav-item.active { background: var(--gold-glow); color: var(--gold); border-left-color: var(--gold); }
  .nav-icon { font-size: 18px; width: 24px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: var(--gold); color: var(--navy); border-radius: 20px;
    font-size: 10px; font-weight: 800; padding: 2px 7px; min-width: 20px; text-align: center;
  }
  .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); }
  .tier-chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px;
    border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.3px;
  }
  .tier-sent { background: rgba(255,255,255,0.08); color: var(--white-dim); }
  .tier-laborer { background: rgba(201,168,76,0.2); color: var(--gold); border: 1px solid var(--gold-dim); }
  .tier-field { background: linear-gradient(135deg, rgba(201,168,76,0.3), rgba(74,144,217,0.2)); color: var(--gold-light); border: 1px solid var(--gold); }

  /* ─── MAIN ─── */
  .main { flex: 1; overflow-y: auto; background: var(--navy); position: relative; }
  .page { padding: 28px 32px; max-width: 900px; }

  /* ─── CARDS ─── */
  .card {
    background: var(--navy-card); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 22px; margin-bottom: 18px; position: relative; overflow: hidden;
  }
  .card-glow { box-shadow: 0 0 40px var(--gold-glow); }
  .card-title { font-family: 'Cinzel', serif; font-size: 13px; color: var(--gold); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; }
  .card-subtitle { font-size: 12px; color: var(--white-dim); margin-bottom: 8px; font-weight: 500; }

  /* ─── BUTTONS ─── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 10px 20px; border-radius: var(--radius-sm); font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-gold { background: linear-gradient(135deg, var(--gold), var(--gold-light)); color: var(--navy); }
  .btn-gold:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(201,168,76,0.4); }
  .btn-outline { background: transparent; border: 1.5px solid var(--gold-dim); color: var(--gold); }
  .btn-outline:hover { background: var(--gold-glow); }
  .btn-ghost { background: var(--white-faint); color: var(--white); }
  .btn-ghost:hover { background: rgba(255,255,255,0.15); }
  .btn-danger { background: rgba(224,92,92,0.15); color: var(--red); border: 1px solid rgba(224,92,92,0.3); }
  .btn-sm { padding: 7px 14px; font-size: 12px; }
  .btn-full { width: 100%; }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  /* ─── INPUTS ─── */
  input, textarea, select {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-sm);
    color: var(--white); font-family: 'Nunito', sans-serif; font-size: 14px; padding: 11px 14px;
    width: 100%; outline: none; transition: border 0.2s;
  }
  input:focus, textarea:focus, select:focus { border-color: var(--gold-dim); background: rgba(255,255,255,0.09); }
  input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }
  select option { background: var(--navy-mid); }
  label { font-size: 12px; font-weight: 700; color: var(--white-dim); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }
  .form-group { margin-bottom: 16px; }

  /* ─── PROGRESS BAR ─── */
  .progress-track { background: rgba(255,255,255,0.08); border-radius: 99px; height: 10px; overflow: hidden; }
  .progress-fill { background: linear-gradient(90deg, var(--gold), var(--gold-light)); height: 100%; border-radius: 99px; transition: width 0.8s ease; }

  /* ─── GLOBAL COUNTER ─── */
  .counter-big { font-family: 'Cinzel', serif; font-size: 42px; font-weight: 900; color: var(--gold); line-height: 1; letter-spacing: -1px; }
  .counter-goal { font-size: 12px; color: var(--white-dim); margin-top: 4px; }

  /* ─── STREAK ─── */
  .streak-flame { font-size: 32px; }
  .streak-num { font-family: 'Cinzel', serif; font-size: 36px; font-weight: 900; color: var(--gold); line-height: 1; }

  /* ─── CHECKIN CARD ─── */
  .checkin-morning { background: linear-gradient(135deg, #1a3a5c, #0d2641); }
  .checkin-night { background: linear-gradient(135deg, #0d1b2e, #1a1040); }

  /* ─── AVATAR ─── */
  .avatar {
    width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, var(--gold-dim), var(--gold));
    display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px;
    color: var(--navy); flex-shrink: 0; border: 2px solid var(--gold-dim);
  }
  .avatar-sm { width: 32px; height: 32px; font-size: 12px; }

  /* ─── ROW ─── */
  .row { display: flex; align-items: center; gap: 12px; }
  .row-between { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .col { display: flex; flex-direction: column; gap: 4px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }

  /* ─── TAGS / CHIPS ─── */
  .chip {
    display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 700;
  }
  .chip-gold { background: rgba(201,168,76,0.18); color: var(--gold); border: 1px solid var(--gold-dim); }
  .chip-blue { background: rgba(74,144,217,0.18); color: var(--accent); border: 1px solid rgba(74,144,217,0.3); }
  .chip-green { background: rgba(61,186,122,0.15); color: var(--green); border: 1px solid rgba(61,186,122,0.3); }
  .chip-purple { background: rgba(139,92,246,0.15); color: var(--purple); border: 1px solid rgba(139,92,246,0.3); }

  /* ─── MILESTONE BANNER ─── */
  .milestone-banner {
    background: linear-gradient(135deg, #2a1f00, #3d2e00); border: 1px solid var(--gold);
    border-radius: var(--radius); padding: 16px 20px; margin-bottom: 18px;
    display: flex; align-items: center; gap: 14px;
    animation: pulse-glow 2s ease-in-out infinite alternate;
  }
  @keyframes pulse-glow { from { box-shadow: 0 0 20px rgba(201,168,76,0.3); } to { box-shadow: 0 0 40px rgba(201,168,76,0.5); } }
  .milestone-text { font-family: 'Cinzel', serif; font-size: 14px; color: var(--gold-light); font-weight: 700; }

  /* ─── SCRIPTURE CARD ─── */
  .scripture-card {
    background: linear-gradient(135deg, #0f2438, #1a3456);
    border: 1px solid rgba(201,168,76,0.3); border-radius: var(--radius); padding: 22px;
    margin-bottom: 18px; position: relative;
  }
  .scripture-text { font-size: 16px; line-height: 1.7; color: var(--white); font-style: italic; font-weight: 500; margin-bottom: 8px; }
  .scripture-ref { font-family: 'Cinzel', serif; font-size: 12px; color: var(--gold); letter-spacing: 1px; }
  .quote-mark { font-family: 'Cinzel', serif; font-size: 60px; color: var(--gold-dim); line-height: 0.5; float: left; margin-right: 8px; margin-top: 16px; }

  /* ─── TESTIMONY CARD ─── */
  .testimony-card { border-left: 3px solid var(--gold); }
  .testimony-type { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--gold); margin-bottom: 6px; }
  .testimony-text { font-size: 14px; line-height: 1.6; color: var(--white); margin-bottom: 10px; }

  /* ─── PRAYER CARD ─── */
  .prayer-card { border-left: 3px solid var(--accent); }
  .prayer-meta { font-size: 11px; color: var(--white-dim); margin-bottom: 4px; }

  /* ─── PERSON LIST ─── */
  .person-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .person-item:last-child { border-bottom: none; }
  .person-name { font-weight: 700; font-size: 14px; }
  .person-sub { font-size: 12px; color: var(--white-dim); }

  /* ─── TIER CARD ─── */
  .tier-card { border-radius: var(--radius); padding: 24px; position: relative; overflow: hidden; }
  .tier-free { background: var(--navy-card); border: 1px solid var(--border); }
  .tier-laborer-card { background: linear-gradient(145deg, #1e2e1a, #162812); border: 1px solid rgba(61,186,122,0.3); }
  .tier-field-card { background: linear-gradient(145deg, #1e1a10, #2a2408); border: 2px solid var(--gold-dim); }
  .tier-price { font-family: 'Cinzel', serif; font-size: 32px; font-weight: 900; color: var(--gold); margin: 10px 0; }
  .tier-price span { font-size: 14px; font-weight: 400; color: var(--white-dim); }
  .tier-name { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; }
  .tier-feature { font-size: 12px; color: var(--white-dim); padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: flex-start; gap: 8px; }
  .tier-feature:last-child { border-bottom: none; }
  .check-icon { color: var(--green); font-size: 13px; flex-shrink: 0; margin-top: 1px; }

  /* ─── STAT PILL ─── */
  .stat-pill { background: var(--white-faint); border-radius: var(--radius-sm); padding: 12px 16px; text-align: center; }
  .stat-num { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; color: var(--gold); }
  .stat-label { font-size: 10px; color: var(--white-dim); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; font-weight: 700; }

  /* ─── ONBOARDING ─── */
  .onboarding-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--navy); padding: 20px; }
  .onboarding-card { background: var(--navy-card); border: 1px solid var(--border); border-radius: 24px; padding: 40px; max-width: 480px; width: 100%; box-shadow: var(--shadow); }
  .onboarding-title { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 900; color: var(--gold); text-align: center; margin-bottom: 6px; }
  .onboarding-sub { font-size: 14px; color: var(--white-dim); text-align: center; margin-bottom: 28px; line-height: 1.5; }
  .step-indicator { display: flex; gap: 8px; justify-content: center; margin-bottom: 28px; }
  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--white-faint); }
  .step-dot.active { background: var(--gold); }
  .comfort-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
  .comfort-option {
    background: var(--white-faint); border: 1.5px solid transparent; border-radius: var(--radius-sm);
    padding: 14px 12px; cursor: pointer; text-align: center; transition: all 0.2s;
  }
  .comfort-option:hover { border-color: var(--gold-dim); background: var(--gold-glow); }
  .comfort-option.selected { border-color: var(--gold); background: var(--gold-glow); color: var(--gold); }
  .comfort-emoji { font-size: 22px; display: block; margin-bottom: 4px; }
  .comfort-label { font-size: 12px; font-weight: 700; }
  .tier-select-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 8px; }
  .tier-option {
    background: var(--white-faint); border: 1.5px solid transparent; border-radius: var(--radius-sm);
    padding: 14px 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px;
  }
  .tier-option:hover { border-color: var(--gold-dim); }
  .tier-option.selected { border-color: var(--gold); background: var(--gold-glow); }
  .tier-option-info { flex: 1; }
  .tier-option-name { font-weight: 800; font-size: 14px; }
  .tier-option-price { font-size: 12px; color: var(--white-dim); }

  /* ─── TOAST ─── */
  .toast-wrap { position: fixed; top: 24px; right: 24px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
  .toast {
    background: var(--navy-mid); border: 1px solid var(--gold-dim); border-radius: var(--radius-sm);
    padding: 14px 18px; font-size: 13px; font-weight: 600; color: var(--white);
    max-width: 320px; box-shadow: var(--shadow);
    animation: slide-in 0.3s ease;
  }
  @keyframes slide-in { from { transform: translateX(40px); opacity: 0; } to { transform: none; opacity: 1; } }

  /* ─── UPGRADE MODAL ─── */
  .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-card { background: var(--navy-mid); border: 1px solid var(--gold-dim); border-radius: 20px; padding: 32px; max-width: 420px; width: 100%; box-shadow: var(--shadow); }
  .modal-title { font-family: 'Cinzel', serif; font-size: 20px; color: var(--gold); text-align: center; margin-bottom: 10px; }
  .modal-sub { font-size: 13px; color: var(--white-dim); text-align: center; margin-bottom: 24px; line-height: 1.6; }

  /* ─── TABS ─── */
  .tabs { display: flex; gap: 4px; margin-bottom: 20px; background: var(--white-faint); border-radius: var(--radius-sm); padding: 4px; }
  .tab { flex: 1; padding: 9px 8px; border-radius: 8px; border: none; background: transparent; color: var(--white-dim); font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .tab.active { background: var(--gold); color: var(--navy); }

  /* ─── MISSION CARD ─── */
  .mission-card { background: linear-gradient(135deg, #12253b, #1a3454); border: 1px solid rgba(201,168,76,0.35); border-radius: var(--radius); padding: 22px; margin-bottom: 18px; }
  .mission-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--gold); margin-bottom: 8px; }
  .mission-text { font-size: 16px; font-weight: 700; line-height: 1.5; color: var(--white); }

  /* ─── DIVIDER ─── */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .divider-text { display: flex; align-items: center; gap: 12px; font-size: 11px; color: var(--white-dim); text-transform: uppercase; letter-spacing: 1px; margin: 20px 0; }
  .divider-text::before, .divider-text::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 700px) {
    .sidebar { display: none; }
    .page { padding: 18px 14px; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .counter-big { font-size: 32px; }
  }

  /* ─── SCROLLBAR ─── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--navy); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* ─── CROSS DECORATION ─── */
  .cross-decoration { font-size: 60px; opacity: 0.04; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); pointer-events: none; }

  .separator { height: 24px; }

  .page-header { margin-bottom: 24px; }
  .page-title { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; color: var(--white); }
  .page-desc { font-size: 13px; color: var(--white-dim); margin-top: 4px; }

  .event-type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 8px 0; }
  .event-type-option { background: var(--white-faint); border: 1.5px solid transparent; border-radius: 10px; padding: 10px 6px; text-align: center; cursor: pointer; font-size: 11px; font-weight: 700; transition: all 0.2s; }
  .event-type-option:hover { border-color: var(--gold-dim); }
  .event-type-option.selected { border-color: var(--gold); background: var(--gold-glow); color: var(--gold); }
  .event-type-emoji { font-size: 18px; display: block; margin-bottom: 3px; }

  .reach-input-row { display: flex; gap: 10px; align-items: flex-end; }
  .reach-input-row input { flex: 1; }
  .num-btn { background: var(--white-faint); border: 1px solid var(--border); border-radius: 8px; color: var(--white); font-size: 18px; font-weight: 700; width: 40px; height: 44px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .num-btn:hover { background: var(--gold-glow); border-color: var(--gold-dim); }

  .growth-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--border); }
  .growth-item:last-child { border-bottom: none; }
  .growth-icon { font-size: 24px; min-width: 36px; text-align: center; }
  .growth-title { font-weight: 800; font-size: 14px; margin-bottom: 3px; }
  .growth-desc { font-size: 12px; color: var(--white-dim); line-height: 1.5; }

  .global-goal-decor { position: absolute; right: -20px; top: -20px; font-size: 120px; opacity: 0.03; pointer-events: none; }
`;

// ─── CONSTANTS ─────────────────────────────────────────────────────────────

const DAILY_SCRIPTURES = [
  { ref: "Matthew 28:19-20", text: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you." },
  { ref: "Mark 16:15", text: "And he said to them, 'Go into all the world and proclaim the gospel to the whole creation.'" },
  { ref: "Romans 10:14", text: "How then will they call on him in whom they have not believed? And how are they to believe in him of whom they have never heard? And how are they to hear without someone preaching?" },
  { ref: "Acts 1:8", text: "But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth." },
  { ref: "Isaiah 52:7", text: "How beautiful upon the mountains are the feet of him who brings good news, who publishes peace, who brings good news of happiness, who publishes salvation." },
];

const DAILY_MISSIONS = [
  "Pray for one person by name today, then look for a natural opportunity to share hope with them.",
  "Ask the Holy Spirit to lead you to one divine appointment today. Stay open and obedient.",
  "Share your testimony — even just one sentence of what God has done for you — with someone who needs encouragement.",
  "Pray for boldness this morning. Then walk through every open door the Spirit places before you.",
  "Look for the one person today who seems forgotten or overlooked. That is your mission field today.",
];

const SUGGESTED_HARVEST_MATES = [
  { id: "hm1", name: "Emmanuel Osei", city: "Atlanta, GA", level: "Bold", mutual: 3 },
  { id: "hm2", name: "Grace Adeyemi", city: "Houston, TX", level: "Active", mutual: 1 },
  { id: "hm3", name: "Marcus Webb", city: "Chicago, IL", level: "Growing", mutual: 5 },
  { id: "hm4", name: "Sarah Njoku", city: "Lagos, Nigeria", level: "Bold", mutual: 2 },
  { id: "hm5", name: "David Kim", city: "Los Angeles, CA", level: "Active", mutual: 4 },
  { id: "hm6", name: "Blessing Okoro", city: "London, UK", level: "Bold", mutual: 0 },
];

const DEFAULT_GROUPS = [
  { id: "g1", name: "Atlanta Soul Winners", type: "City Group", members: 142, city: "Atlanta, GA", emoji: "🏙️" },
  { id: "g2", name: "Campus Mission Team", type: "Outreach Team", members: 38, city: "Houston, TX", emoji: "🎓" },
  { id: "g3", name: "Prayer Warriors Circle", type: "Prayer Circle", members: 67, city: "Global", emoji: "🙏" },
  { id: "g4", name: "Street Evangelism Crew", type: "Outreach Team", members: 29, city: "Chicago, IL", emoji: "📢" },
  { id: "g5", name: "New Life Church Outreach", type: "Church Group", members: 91, city: "Dallas, TX", emoji: "⛪" },
];

const EVENT_TYPES = [
  { value: "street", label: "Street", emoji: "📢" },
  { value: "campus", label: "Campus", emoji: "🎓" },
  { value: "prayer_walk", label: "Prayer Walk", emoji: "🚶" },
  { value: "crusade", label: "Crusade", emoji: "✝️" },
  { value: "hospital", label: "Hospital", emoji: "🏥" },
  { value: "prison", label: "Prison", emoji: "🔐" },
  { value: "community", label: "Community", emoji: "🏘️" },
  { value: "city_invasion", label: "City Invasion", emoji: "🌆" },
];

const GROWTH_RESOURCES = [
  { emoji: "🌱", title: "New Believer Path", desc: "A 30-day guided journey for new believers — foundational faith, prayer, and identity in Christ." },
  { emoji: "⚡", title: "Daily Charge", desc: "Short, fire-filled daily devotional to keep your spirit sharp and your mission focus clear." },
  { emoji: "🕊️", title: "Walk with the Holy Spirit", desc: "A multi-week series on learning to hear, follow, and partner with the Holy Spirit in evangelism." },
  { emoji: "💬", title: "How to Share Your Faith", desc: "Practical conversation guides, testimony frameworks, and the 1-2-3 of sharing the Gospel naturally." },
  { emoji: "📋", title: "Follow-Up Guidance", desc: "How to disciple new believers, what to say in follow-up conversations, and how to connect them to a local church." },
  { emoji: "📖", title: "Scripture for Witnesses", desc: "Key scriptures to memorize, meditate on, and use when sharing the Gospel in any situation." },
];

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getMilestone(count) {
  const milestones = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  for (let m of milestones) {
    if (count >= m && count < m * 5) return m;
  }
  return null;
}

// ─── STORAGE HELPERS ────────────────────────────────────────────────────────

function load(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── TOAST ───────────────────────────────────────────────────────────────────

function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className="toast">{t.msg}</div>
      ))}
    </div>
  );
}

// ─── UPGRADE MODAL ───────────────────────────────────────────────────────────

function UpgradeModal({ reason, onClose, onUpgrade }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-title">⬆️ Upgrade Your Mission</div>
        <p className="modal-sub">{reason}<br /><br />Unlock more Kingdom impact with a GoYe Connect paid tier.</p>
        <div style={{ marginBottom: 12 }}>
          <button className="btn btn-gold btn-full" style={{ marginBottom: 10 }} onClick={() => onUpgrade("laborer")}>
            🌾 Upgrade to Laborer — $4.99/mo
          </button>
          <button className="btn btn-outline btn-full" onClick={() => onUpgrade("field")}>
            🏆 Upgrade to Field Leader — $14.99/mo
          </button>
        </div>
        <p style={{ fontSize: 11, color: "var(--gold)", textAlign: "center", marginTop: 8 }}>
          90% of net profits support accountable Go Ye missions worldwide.
        </p>
        <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 12 }} onClick={onClose}>Maybe Later</button>
      </div>
    </div>
  );
}

// ─── ONBOARDING ──────────────────────────────────────────────────────────────

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [church, setChurch] = useState("");
  const [level, setLevel] = useState("");
  const [tier, setTier] = useState("sent");

  const steps = 5;

  const canNext = () => {
    if (step === 0) return name.trim().length > 1;
    if (step === 1) return city.trim().length > 1;
    if (step === 3) return level !== "";
    if (step === 4) return tier !== "";
    return true;
  };

  const next = () => { if (step < steps - 1) setStep(s => s + 1); else finish(); };
  const finish = () => onComplete({ name: name.trim(), city: city.trim(), church: church.trim(), level, tier });

  return (
    <div className="onboarding-wrap">
      <style>{STYLES}</style>
      <div className="onboarding-card">
        <div className="onboarding-title">✝ GoYe Connect</div>
        <p className="onboarding-sub">You are sent. You are a witness.<br />Welcome to the Great Commission network.</p>
        <div className="step-indicator">
          {Array(steps).fill(0).map((_, i) => <div key={i} className={`step-dot${i === step ? " active" : ""}`} />)}
        </div>

        {step === 0 && (
          <div>
            <div className="form-group"><label>Your Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" /></div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div className="form-group"><label>Your City</label><input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Atlanta, GA" /></div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="form-group"><label>Your Church (Optional)</label><input value={church} onChange={e => setChurch(e.target.value)} placeholder="Church name or skip" /></div>
          </div>
        )}
        {step === 3 && (
          <div>
            <label style={{ marginBottom: 12, display: "block" }}>Evangelism Comfort Level</label>
            <div className="comfort-options">
              {[
                { v: "beginner", e: "🌱", l: "Beginner" },
                { v: "growing", e: "📖", l: "Growing" },
                { v: "active", e: "🔥", l: "Active" },
                { v: "bold", e: "⚡", l: "Bold" },
              ].map(o => (
                <div key={o.v} className={`comfort-option${level === o.v ? " selected" : ""}`} onClick={() => setLevel(o.v)}>
                  <span className="comfort-emoji">{o.e}</span>
                  <span className="comfort-label">{o.l}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <label style={{ marginBottom: 12, display: "block" }}>Choose Your Mission Tier</label>
            <div className="tier-select-grid">
              {[
                { v: "sent", e: "📜", name: "Sent", price: "Free forever" },
                { v: "laborer", e: "🌾", name: "Laborer", price: "$4.99/month" },
                { v: "field", e: "🏆", name: "Field Leader", price: "$14.99/month" },
              ].map(o => (
                <div key={o.v} className={`tier-option${tier === o.v ? " selected" : ""}`} onClick={() => setTier(o.v)}>
                  <span style={{ fontSize: 24 }}>{o.e}</span>
                  <div className="tier-option-info">
                    <div className="tier-option-name">{o.name}</div>
                    <div className="tier-option-price">{o.price}</div>
                  </div>
                  {tier === o.v && <span style={{ color: "var(--gold)", fontSize: 18 }}>✓</span>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: "var(--gold)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
              90% of GoYe Connect net app profits support accountable Go Ye missions worldwide.
            </p>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button className="btn btn-gold btn-full" onClick={next} disabled={!canNext()}>
            {step === steps - 1 ? "Enter the Mission →" : "Continue →"}
          </button>
          {step > 0 && <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 8 }} onClick={() => setStep(s => s - 1)}>← Back</button>}
        </div>
      </div>
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────

function HomePage({ user, appState, dispatch, showUpgrade, addToast }) {
  const today = todayStr();
  const todayCI = appState.checkIns[today] || {};
  const scripture = DAILY_SCRIPTURES[new Date().getDay() % DAILY_SCRIPTURES.length];
  const mission = DAILY_MISSIONS[new Date().getDay() % DAILY_MISSIONS.length];
  const hour = new Date().getHours();
  const isEvening = hour >= 17;

  const [reaching, setReaching] = useState(todayCI.reaching || "");
  const [shared, setShared] = useState(todayCI.shared ?? null);
  const [soulsCount, setSoulsCount] = useState(todayCI.souls || 0);
  const [reflection, setReflection] = useState(todayCI.reflection || "");
  const [nightDone, setNightDone] = useState(todayCI.nightDone || false);
  const [morningDone, setMorningDone] = useState(todayCI.morningDone || false);

  const milestone = getMilestone(appState.globalSouls);

  function doMorningCI() {
    if (!reaching.trim()) { addToast("Enter who you're reaching today!"); return; }
    const newCI = { ...todayCI, reaching, morningDone: true };
    dispatch({ type: "SET_CHECKIN", date: today, data: newCI });
    setMorningDone(true);
    addToast("🌅 Morning check-in complete! Go be a witness today.");
  }

  function doNightCI() {
    const soulsNum = parseInt(soulsCount) || 0;
    const newCI = { ...todayCI, shared, souls: soulsNum, reflection, nightDone: true };
    dispatch({ type: "SET_CHECKIN", date: today, data: newCI });
    dispatch({ type: "ADD_SOULS", count: soulsNum });
    dispatch({ type: "UPDATE_STREAK" });
    setNightDone(true);
    addToast(shared ? `🔥 Praise God! Streak updated. ${soulsNum > 0 ? soulsNum + " soul(s) reported to global counter." : ""}` : "Tomorrow is a new opportunity. Keep going!");
  }

  return (
    <div className="page">
      {milestone && (
        <div className="milestone-banner">
          <span style={{ fontSize: 28 }}>🎉</span>
          <div>
            <div className="milestone-text">{milestone.toLocaleString()} souls reached so far. Glory to God!</div>
            <div style={{ fontSize: 12, color: "var(--white-dim)" }}>Keep going — the world needs the Gospel.</div>
          </div>
        </div>
      )}

      {/* GLOBAL COUNTER */}
      <div className="card card-glow" style={{ position: "relative", overflow: "hidden" }}>
        <div className="global-goal-decor">✝</div>
        <div className="card-title">🌍 Great Commission Goal</div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "var(--white-dim)", marginBottom: 4 }}>GLOBAL GOAL</div>
          <div className="counter-big">1 Billion Souls</div>
          <div className="counter-goal">Goal: 1,000,000,000 people reached with the Gospel</div>
        </div>
        <div className="progress-track" style={{ marginBottom: 10 }}>
          <div className="progress-fill" style={{ width: `${Math.min(100, (appState.globalSouls / 1000000000) * 100)}%` }} />
        </div>
        <div className="grid-3" style={{ marginTop: 14 }}>
          <div className="stat-pill">
            <div className="stat-num">{appState.globalSouls.toLocaleString()}</div>
            <div className="stat-label">Total Reported</div>
          </div>
          <div className="stat-pill">
            <div className="stat-num">{(appState.checkIns[today]?.souls || 0).toLocaleString()}</div>
            <div className="stat-label">Today</div>
          </div>
          <div className="stat-pill">
            <div className="stat-num">{appState.weekSouls.toLocaleString()}</div>
            <div className="stat-label">This Week</div>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>
          ✝ Only God saves. These numbers reflect Gospel conversations and salvation decisions reported by our community.
        </p>
      </div>

      {/* STREAK */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ textAlign: "center" }}>
          <div className="streak-flame">🔥</div>
          <div className="streak-num">{appState.streak}</div>
          <div style={{ fontSize: 10, color: "var(--white-dim)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Day Streak</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>You are part of the Great Commission.</div>
          <div style={{ fontSize: 13, color: "var(--white-dim)", lineHeight: 1.5 }}>
            "I am a witness. I am sent. I am part of the Great Commission." Stay faithful — every conversation matters.
          </div>
        </div>
      </div>

      {/* SCRIPTURE */}
      <div className="scripture-card">
        <div className="card-title">📖 Today's Mission Scripture</div>
        <div className="quote-mark">"</div>
        <div className="scripture-text">{scripture.text}</div>
        <div className="scripture-ref">— {scripture.ref}</div>
      </div>

      {/* DAILY MISSION */}
      <div className="mission-card">
        <div className="mission-label">⚡ Daily Mission</div>
        <div className="mission-text">{mission}</div>
      </div>

      {/* MORNING CHECK-IN */}
      {!isEvening && (
        <div className="card checkin-morning">
          <div className="card-title">🌅 Morning Check-In</div>
          <p style={{ fontSize: 13, color: "var(--white-dim)", marginBottom: 14 }}>Who are you reaching today? Set your intention with the Holy Spirit.</p>
          {!morningDone ? (
            <>
              <div className="form-group">
                <label>Name or initials of who you're reaching</label>
                <input value={reaching} onChange={e => setReaching(e.target.value)} placeholder="e.g. My coworker James, my neighbor..." />
              </div>
              <button className="btn btn-gold" onClick={doMorningCI}>Set My Morning Mission 🔥</button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>✅</span>
              <div>
                <div style={{ fontWeight: 800, color: "var(--green)" }}>Morning mission set!</div>
                <div style={{ fontSize: 12, color: "var(--white-dim)" }}>Reaching: {reaching} — Go with boldness.</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EVENING CHECK-IN */}
      {isEvening && (
        <div className="card checkin-night">
          <div className="card-title">🌙 Evening Check-In</div>
          <p style={{ fontSize: 13, color: "var(--white-dim)", marginBottom: 16 }}>Did you share the Gospel today? Report your impact.</p>
          {!nightDone ? (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button className={`btn btn-full${shared === true ? " btn-gold" : " btn-ghost"}`} onClick={() => setShared(true)}>
                  ✝️ Yes — Praise God!
                </button>
                <button className={`btn btn-full${shared === false ? " btn-outline" : " btn-ghost"}`} onClick={() => setShared(false)}>
                  🙏 Not yet
                </button>
              </div>
              {shared === true && (
                <>
                  <div className="form-group">
                    <label>People ministered to / Gospel conversations</label>
                    <div className="reach-input-row">
                      <button className="num-btn" onClick={() => setSoulsCount(Math.max(0, soulsCount - 1))}>−</button>
                      <input type="number" value={soulsCount} onChange={e => setSoulsCount(parseInt(e.target.value) || 0)} style={{ textAlign: "center" }} />
                      <button className="num-btn" onClick={() => setSoulsCount(soulsCount + 1)}>+</button>
                    </div>
                  </div>
                </>
              )}
              <div className="form-group">
                <label>Reflection (optional)</label>
                <textarea rows={3} value={reflection} onChange={e => setReflection(e.target.value)} placeholder="What happened today? What did God do?" />
              </div>
              <button className="btn btn-gold" onClick={doNightCI}>Submit Check-In & Update Streak</button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>🌙</span>
              <div>
                <div style={{ fontWeight: 800, color: "var(--gold)" }}>Evening check-in complete!</div>
                <div style={{ fontSize: 12, color: "var(--white-dim)" }}>{soulsCount > 0 ? `${soulsCount} soul(s) reported to the global counter.` : "Tomorrow is a new day. Go again!"}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── NETWORK ─────────────────────────────────────────────────────────────────

function NetworkPage({ user, appState, dispatch, showUpgrade, addToast }) {
  const [tab, setTab] = useState("my");
  const maxMates = user.tier === "sent" ? 2 : 999;

  function addMate(person) {
    if (appState.harvestMates.find(m => m.id === person.id)) { addToast("Already added!"); return; }
    if (appState.harvestMates.length >= maxMates) {
      showUpgrade("Free accounts can add up to 2 Harvest Mates. Upgrade to connect with unlimited co-laborers.");
      return;
    }
    dispatch({ type: "ADD_MATE", mate: person });
    addToast(`✝️ ${person.name} added as a Harvest Mate!`);
  }

  const myMates = appState.harvestMates;
  const suggested = SUGGESTED_HARVEST_MATES.filter(s => !myMates.find(m => m.id === s.id));

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">⚓ Network</div>
        <div className="page-desc">Connect with co-laborers in the harvest field.</div>
      </div>
      <div className="tabs">
        <button className={`tab${tab === "my" ? " active" : ""}`} onClick={() => setTab("my")}>My Harvest Mates ({myMates.length})</button>
        <button className={`tab${tab === "discover" ? " active" : ""}`} onClick={() => setTab("discover")}>Discover</button>
      </div>

      {tab === "my" && (
        <div className="card">
          <div className="row-between" style={{ marginBottom: 14 }}>
            <div className="card-title" style={{ margin: 0 }}>Harvest Mates</div>
            {user.tier === "sent" && <span className="chip chip-gold">{myMates.length}/{maxMates} used</span>}
          </div>
          {myMates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "var(--white-dim)" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🤝</div>
              <div style={{ fontSize: 14 }}>No Harvest Mates yet.</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Discover believers in your city and beyond.</div>
            </div>
          ) : myMates.map(m => (
            <div key={m.id} className="person-item">
              <div className="avatar">{getInitials(m.name)}</div>
              <div className="col">
                <div className="person-name">{m.name}</div>
                <div className="person-sub">{m.city} · {m.level}</div>
              </div>
              <span className="chip chip-green">✓ Mate</span>
            </div>
          ))}
        </div>
      )}

      {tab === "discover" && (
        <div className="card">
          <div className="card-title">Suggested Co-Laborers</div>
          {suggested.map(p => (
            <div key={p.id} className="person-item">
              <div className="avatar">{getInitials(p.name)}</div>
              <div className="col" style={{ flex: 1 }}>
                <div className="person-name">{p.name}</div>
                <div className="person-sub">{p.city} · Level: {p.level}{p.mutual > 0 ? ` · ${p.mutual} mutual` : ""}</div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => addMate(p)}>+ Add</button>
            </div>
          ))}
        </div>
      )}

      {user.tier === "sent" && (
        <div className="card" style={{ background: "linear-gradient(135deg, #1a200a, #232c10)", border: "1px solid rgba(201,168,76,0.3)" }}>
          <div className="card-title">Upgrade for Unlimited Harvest Mates</div>
          <p style={{ fontSize: 13, color: "var(--white-dim)", marginBottom: 14 }}>Free accounts are limited to 2 Harvest Mates. Upgrade to Laborer or Field Leader for unlimited co-laborers across the globe.</p>
          <button className="btn btn-gold" onClick={() => showUpgrade("Unlock unlimited Harvest Mates and grow your Gospel network.")}>Upgrade Now →</button>
        </div>
      )}
    </div>
  );
}

// ─── GROUPS ──────────────────────────────────────────────────────────────────

function GroupsPage({ user, appState, dispatch, showUpgrade, addToast }) {
  const [tab, setTab] = useState("my");
  const maxGroups = user.tier === "sent" ? 3 : 999;
  const canCreate = user.tier === "field";

  function joinGroup(g) {
    if (appState.joinedGroups.includes(g.id)) { addToast("Already a member!"); return; }
    if (appState.joinedGroups.length >= maxGroups) {
      showUpgrade("Free accounts can join up to 3 groups. Upgrade to Laborer or Field Leader for unlimited groups.");
      return;
    }
    dispatch({ type: "JOIN_GROUP", id: g.id });
    addToast(`✝️ Joined "${g.name}"!`);
  }

  const myGroups = DEFAULT_GROUPS.filter(g => appState.joinedGroups.includes(g.id));
  const discoverGroups = DEFAULT_GROUPS.filter(g => !appState.joinedGroups.includes(g.id));

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">👥 Groups</div>
        <div className="page-desc">City groups, church outreach teams, prayer circles.</div>
      </div>
      <div className="tabs">
        <button className={`tab${tab === "my" ? " active" : ""}`} onClick={() => setTab("my")}>My Groups ({myGroups.length})</button>
        <button className={`tab${tab === "discover" ? " active" : ""}`} onClick={() => setTab("discover")}>Discover</button>
        {canCreate && <button className={`tab${tab === "create" ? " active" : ""}`} onClick={() => setTab("create")}>+ Create</button>}
      </div>

      {tab === "my" && (
        <>
          {myGroups.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🏘️</div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>No groups yet</div>
              <div style={{ fontSize: 13, color: "var(--white-dim)" }}>Find your city group or outreach team in Discover.</div>
            </div>
          ) : myGroups.map(g => (
            <div key={g.id} className="card">
              <div className="row-between">
                <div className="row">
                  <span style={{ fontSize: 28 }}>{g.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: "var(--white-dim)" }}>{g.city} · {g.members} members</div>
                  </div>
                </div>
                <span className="chip chip-gold">{g.type}</span>
              </div>
            </div>
          ))}
        </>
      )}

      {tab === "discover" && (
        <>
          {discoverGroups.map(g => (
            <div key={g.id} className="card">
              <div className="row-between">
                <div className="row">
                  <span style={{ fontSize: 28 }}>{g.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{g.name}</div>
                    <div style={{ fontSize: 12, color: "var(--white-dim)" }}>{g.city} · {g.members} members</div>
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => joinGroup(g)}>Join</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <span className="chip chip-blue">{g.type}</span>
              </div>
            </div>
          ))}
          {user.tier === "sent" && (
            <p style={{ fontSize: 12, color: "var(--white-dim)", textAlign: "center", marginTop: 12 }}>
              Free: join up to 3 groups · <span style={{ color: "var(--gold)", cursor: "pointer" }} onClick={() => showUpgrade("Join unlimited groups as a Laborer or Field Leader.")}>Upgrade for unlimited</span>
            </p>
          )}
        </>
      )}

      {tab === "create" && canCreate && (
        <CreateGroupForm addToast={addToast} dispatch={dispatch} onCreated={() => setTab("my")} />
      )}
    </div>
  );
}

function CreateGroupForm({ addToast, dispatch, onCreated }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("city");
  const [city, setCity] = useState("");

  function submit() {
    if (!name.trim() || !city.trim()) { addToast("Fill in all fields"); return; }
    addToast(`🏘️ Group "${name}" created!`);
    onCreated();
  }

  return (
    <div className="card">
      <div className="card-title">Create New Group</div>
      <div className="form-group"><label>Group Name</label><input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Dallas Soul Winners" /></div>
      <div className="form-group"><label>City</label><input value={city} onChange={e => setCity(e.target.value)} placeholder="City, State" /></div>
      <div className="form-group">
        <label>Group Type</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="city">City Group</option>
          <option value="church">Church Group</option>
          <option value="outreach">Outreach Team</option>
          <option value="prayer">Prayer Circle</option>
        </select>
      </div>
      <button className="btn btn-gold" onClick={submit}>Create Group 🏘️</button>
    </div>
  );
}

// ─── OUTREACH ────────────────────────────────────────────────────────────────

function OutreachPage({ user, appState, dispatch, showUpgrade, addToast }) {
  const [tab, setTab] = useState("events");
  const canCreate = user.tier === "field";

  function rsvp(eventId) {
    if (appState.rsvpd.includes(eventId)) { addToast("Already RSVP'd!"); return; }
    if (user.tier === "sent" && appState.rsvpd.length >= 2) {
      showUpgrade("Free accounts can RSVP to 2 events/month. Upgrade to Laborer for unlimited event participation.");
      return;
    }
    dispatch({ type: "RSVP", eventId });
    addToast("✅ RSVP confirmed! See you at the outreach.");
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">📢 Outreach Events</div>
        <div className="page-desc">Join or lead evangelism in your city and beyond.</div>
      </div>
      <div className="tabs">
        <button className={`tab${tab === "events" ? " active" : ""}`} onClick={() => setTab("events")}>Upcoming Events</button>
        {canCreate && <button className={`tab${tab === "create" ? " active" : ""}`} onClick={() => setTab("create")}>+ Create Event</button>}
        {!canCreate && <button className="tab" style={{ opacity: 0.5 }} onClick={() => showUpgrade("Field Leader tier allows you to create and manage outreach events.")}>+ Create (Field Leader)</button>}
      </div>

      {tab === "events" && (
        <>
          {appState.events.map(ev => (
            <div key={ev.id} className="card">
              <div className="row-between" style={{ marginBottom: 10 }}>
                <span className="chip chip-gold">{EVENT_TYPES.find(t => t.value === ev.type)?.emoji} {EVENT_TYPES.find(t => t.value === ev.type)?.label}</span>
                <span style={{ fontSize: 12, color: "var(--white-dim)" }}>{ev.date}</span>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{ev.title}</div>
              <div style={{ fontSize: 13, color: "var(--white-dim)", marginBottom: 12 }}>📍 {ev.city} · {ev.participants} expected</div>
              {ev.soulsReported > 0 && (
                <div style={{ fontSize: 13, color: "var(--green)", marginBottom: 10 }}>🌿 {ev.soulsReported} soul(s) reached reported</div>
              )}
              <button
                className={`btn btn-sm ${appState.rsvpd.includes(ev.id) ? "btn-ghost" : "btn-outline"}`}
                onClick={() => rsvp(ev.id)}
              >
                {appState.rsvpd.includes(ev.id) ? "✅ RSVP'd" : "RSVP →"}
              </button>
            </div>
          ))}
          {appState.events.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🌆</div>
              <div>No events yet. A Field Leader can create the first one.</div>
            </div>
          )}
        </>
      )}

      {tab === "create" && canCreate && (
        <CreateEventForm addToast={addToast} dispatch={dispatch} onCreated={() => setTab("events")} />
      )}
    </div>
  );
}

function CreateEventForm({ addToast, dispatch, onCreated }) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("street");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [souls, setSouls] = useState(0);

  function submit() {
    if (!title.trim() || !city.trim() || !date) { addToast("Fill in required fields"); return; }
    const newEvent = { id: `ev_${Date.now()}`, title, city, type, date, participants: parseInt(participants) || 0, soulsReported: parseInt(souls) || 0 };
    dispatch({ type: "ADD_EVENT", event: newEvent });
    if (souls > 0) dispatch({ type: "ADD_SOULS", count: parseInt(souls) || 0 });
    addToast(`🌆 Event "${title}" created!`);
    onCreated();
  }

  return (
    <div className="card">
      <div className="card-title">Create Outreach Event</div>
      <div className="form-group"><label>Event Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Downtown Prayer Walk" /></div>
      <div className="form-group"><label>City</label><input value={city} onChange={e => setCity(e.target.value)} placeholder="City, State" /></div>
      <div className="form-group">
        <label>Event Type</label>
        <div className="event-type-grid">
          {EVENT_TYPES.map(t => (
            <div key={t.value} className={`event-type-option${type === t.value ? " selected" : ""}`} onClick={() => setType(t.value)}>
              <span className="event-type-emoji">{t.emoji}</span>{t.label}
            </div>
          ))}
        </div>
      </div>
      <div className="grid-2">
        <div className="form-group"><label>Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
        <div className="form-group"><label>Expected Participants</label><input type="number" value={participants} onChange={e => setParticipants(e.target.value)} placeholder="0" /></div>
      </div>
      <div className="form-group">
        <label>Souls Reached / Gospel Conversations (report after event)</label>
        <div className="reach-input-row">
          <button className="num-btn" onClick={() => setSouls(Math.max(0, souls - 1))}>−</button>
          <input type="number" value={souls} onChange={e => setSouls(parseInt(e.target.value) || 0)} style={{ textAlign: "center" }} />
          <button className="num-btn" onClick={() => setSouls(souls + 1)}>+</button>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "var(--white-dim)", marginBottom: 14, lineHeight: 1.6 }}>
        ✝ Only God saves. Numbers here reflect Gospel conversations and salvation decisions reported, not saved souls.
      </p>
      <button className="btn btn-gold" onClick={submit}>Create & Publish Event 🌆</button>
    </div>
  );
}

// ─── PRAYER ──────────────────────────────────────────────────────────────────

function PrayerPage({ user, appState, dispatch, addToast }) {
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(false);

  function submitRequest() {
    if (!text.trim()) { addToast("Write your prayer request first."); return; }
    const req = { id: `pr_${Date.now()}`, text: text.trim(), anon, author: anon ? "Anonymous" : user.name, date: todayStr(), prayCount: 0, answered: false };
    dispatch({ type: "ADD_PRAYER", prayer: req });
    setText(""); setAnon(false);
    addToast("🙏 Prayer request submitted.");
  }

  function prayFor(id) {
    dispatch({ type: "PRAY_FOR", id });
    addToast("🙏 Praying with you. The Lord hears.");
  }

  function markAnswered(id) {
    dispatch({ type: "ANSWER_PRAYER", id });
    addToast("🎉 Praise God! Answered prayer recorded.");
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">🙏 Prayer</div>
        <div className="page-desc">Pray for one another. The effectual fervent prayer of a righteous man availeth much.</div>
      </div>

      <div className="card">
        <div className="card-title">Submit a Prayer Request</div>
        <div className="form-group">
          <textarea rows={3} value={text} onChange={e => setText(e.target.value)} placeholder="Share your prayer request with the community..." />
        </div>
        <div className="row" style={{ marginBottom: 14 }}>
          <input type="checkbox" id="anon" checked={anon} onChange={e => setAnon(e.target.checked)} style={{ width: "auto", margin: 0 }} />
          <label htmlFor="anon" style={{ margin: 0, fontSize: 13, textTransform: "none", letterSpacing: 0, fontWeight: 600 }}>Submit anonymously</label>
        </div>
        <button className="btn btn-gold" onClick={submitRequest}>Submit Request 🙏</button>
      </div>

      <div className="card-title" style={{ paddingLeft: 4, marginBottom: 12 }}>Prayer Wall</div>
      {appState.prayers.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "30px 0", color: "var(--white-dim)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🙏</div>
          <div>Be the first to submit a prayer request.</div>
        </div>
      )}
      {appState.prayers.map(p => (
        <div key={p.id} className={`card prayer-card${p.answered ? " card-glow" : ""}`}>
          {p.answered && <div className="chip chip-gold" style={{ marginBottom: 8 }}>✨ Answered — Praise God!</div>}
          <div className="prayer-meta">{p.anon ? "Anonymous" : p.author} · {p.date}</div>
          <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{p.text}</div>
          <div className="row">
            <button className="btn btn-ghost btn-sm" onClick={() => prayFor(p.id)}>🙏 Pray ({p.prayCount})</button>
            {!p.answered && p.author === user.name && (
              <button className="btn btn-sm" style={{ background: "rgba(61,186,122,0.15)", color: "var(--green)", border: "1px solid rgba(61,186,122,0.3)" }} onClick={() => markAnswered(p.id)}>✅ Mark Answered</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TESTIMONIES ─────────────────────────────────────────────────────────────

function TestimoniesPage({ user, appState, dispatch, addToast }) {
  const [text, setText] = useState("");
  const [type, setType] = useState("evangelism");

  function post() {
    if (!text.trim()) { addToast("Write your testimony first."); return; }
    const t = { id: `t_${Date.now()}`, text: text.trim(), type, author: user.name, date: todayStr(), reactions: 0 };
    dispatch({ type: "ADD_TESTIMONY", testimony: t });
    setText(""); setType("evangelism");
    addToast("🎉 Testimony posted! Glory to God.");
  }

  function react(id) {
    dispatch({ type: "REACT_TESTIMONY", id });
    addToast("🔥 Amen!");
  }

  const typeLabels = { evangelism: "Evangelism Win", salvation: "Salvation Decision", breakthrough: "Breakthrough", answered_prayer: "Answered Prayer", gratitude: "Gratitude" };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">🎉 Testimonies</div>
        <div className="page-desc">Share what God is doing. One leper returned to give thanks.</div>
      </div>

      <div className="card">
        <div className="card-title">Share a Testimony</div>
        <div className="form-group">
          <label>Testimony Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="evangelism">Evangelism Win</option>
            <option value="salvation">Salvation Decision Reported</option>
            <option value="breakthrough">Breakthrough</option>
            <option value="answered_prayer">Answered Prayer</option>
            <option value="gratitude">Gratitude — One Leper Style</option>
          </select>
        </div>
        <div className="form-group">
          <textarea rows={4} value={text} onChange={e => setText(e.target.value)} placeholder="What did God do? Share your testimony..." />
        </div>
        <p style={{ fontSize: 11, color: "var(--white-dim)", marginBottom: 12 }}>✝ Testimonies are reviewed for mission focus. Please share only Kingdom-relevant content.</p>
        <button className="btn btn-gold" onClick={post}>Post Testimony 🎉</button>
      </div>

      {appState.testimonies.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "30px 0", color: "var(--white-dim)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
          <div>Be the first to share what God is doing.</div>
        </div>
      )}
      {appState.testimonies.map(t => (
        <div key={t.id} className="card testimony-card">
          <div className="testimony-type">{typeLabels[t.type] || t.type}</div>
          <div className="testimony-text">{t.text}</div>
          <div className="row-between">
            <div style={{ fontSize: 12, color: "var(--white-dim)" }}>{t.author} · {t.date}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => react(t.id)}>🔥 Amen! ({t.reactions})</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── GROWTH ──────────────────────────────────────────────────────────────────

function GrowthPage() {
  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">🌱 Growth & Discipleship</div>
        <div className="page-desc">Grow in obedience to the Great Commission. Equip yourself to go.</div>
      </div>
      <div className="card">
        <div className="card-title">Discipleship Resources</div>
        {GROWTH_RESOURCES.map((r, i) => (
          <div key={i} className="growth-item">
            <span className="growth-icon">{r.emoji}</span>
            <div>
              <div className="growth-title">{r.title}</div>
              <div className="growth-desc">{r.desc}</div>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>Open →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SUBSCRIPTIONS ───────────────────────────────────────────────────────────

function SubscriptionsPage({ user, appState, dispatch, addToast }) {
  const current = user.tier;

  function upgrade(tier) {
    dispatch({ type: "SET_TIER", tier });
    const names = { sent: "Sent (Free)", laborer: "Laborer", field: "Field Leader" };
    addToast(`✅ Upgraded to ${names[tier]}!`);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title">⚡ Mission Tiers</div>
        <div className="page-desc">"Free to join the mission. Paid to lead and scale impact."</div>
      </div>

      <div className="card" style={{ background: "linear-gradient(135deg, #1a2600, #1f2f08)", border: "1px solid rgba(201,168,76,0.4)", textAlign: "center", padding: "20px 24px" }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🌍</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 15, color: "var(--gold)", fontWeight: 700, marginBottom: 6 }}>Mission-Funded App</div>
        <div style={{ fontSize: 13, color: "var(--white-dim)", lineHeight: 1.7 }}>
          <strong style={{ color: "var(--gold-light)" }}>90% of GoYe Connect net app profits</strong> support accountable Go Ye missions worldwide.<br />
          Every subscription is a mission offering.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginTop: 6 }}>
        {/* SENT */}
        <div className="tier-card tier-free">
          <div className="tier-name">📜 Sent</div>
          <div className="tier-price">Free<span>/forever</span></div>
          {current === "sent" && <span className="chip chip-green" style={{ marginBottom: 10 }}>✓ Current Plan</span>}
          {[
            "Daily mission & scripture",
            "Basic prayer & testimony",
            "Up to 2 Harvest Mates",
            "Join up to 3 groups",
            "2 event RSVPs/month",
            "Basic streak tracking",
          ].map((f, i) => <div key={i} className="tier-feature"><span className="check-icon">✓</span>{f}</div>)}
          {current !== "sent" && <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 14 }} onClick={() => upgrade("sent")}>Downgrade</button>}
        </div>

        {/* LABORER */}
        <div className="tier-card tier-laborer-card">
          <div className="tier-name">🌾 Laborer</div>
          <div className="tier-price">$4.99<span>/mo</span></div>
          {current === "laborer" && <span className="chip chip-green" style={{ marginBottom: 10 }}>✓ Current Plan</span>}
          {[
            "Unlimited Harvest Mates",
            "Unlimited groups",
            "Advanced tracking",
            "Follow-up reminders",
            "Unlimited events",
            "Prayer circles",
            "Premium Daily Charges",
            "Active Laborer badge",
          ].map((f, i) => <div key={i} className="tier-feature"><span className="check-icon">✓</span>{f}</div>)}
          {current !== "laborer" && <button className="btn btn-gold btn-sm btn-full" style={{ marginTop: 14 }} onClick={() => upgrade("laborer")}>
            {current === "sent" ? "Upgrade →" : "Downgrade"}
          </button>}
        </div>

        {/* FIELD LEADER */}
        <div className="tier-card tier-field-card">
          <div style={{ position: "absolute", top: 12, right: 12 }}><span className="chip chip-gold">⭐ Best</span></div>
          <div className="tier-name">🏆 Field Leader</div>
          <div className="tier-price">$14.99<span>/mo</span></div>
          {current === "field" && <span className="chip chip-green" style={{ marginBottom: 10 }}>✓ Current Plan</span>}
          {[
            "Everything in Laborer",
            "Create & manage groups",
            "Create outreach events",
            "Group admin tools",
            "Event management",
            "Group analytics",
            "Assign missions",
            "Moderate group posts",
            "Field Leader badge",
          ].map((f, i) => <div key={i} className="tier-feature"><span className="check-icon">✓</span>{f}</div>)}
          {current !== "field" && <button className="btn btn-gold btn-sm btn-full" style={{ marginTop: 14 }} onClick={() => upgrade("field")}>Upgrade →</button>}
        </div>
      </div>

      <p style={{ fontSize: 12, color: "var(--white-dim)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
        This is a demo. No real payment is processed. In production, billing is handled via Stripe.<br />
        <span style={{ color: "var(--gold)" }}>90% of net profits go directly to accountable Go Ye missions worldwide.</span>
      </p>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────────────────────────────────

function ProfilePage({ user, appState }) {
  const tierBadge = { sent: { label: "📜 Sent", cls: "tier-sent" }, laborer: { label: "🌾 Active Laborer", cls: "tier-laborer" }, field: { label: "🏆 Field Leader", cls: "tier-field" } };
  const tb = tierBadge[user.tier];
  const totalSouls = appState.globalSouls;

  const allCheckins = Object.values(appState.checkIns || {});
  const totalConvos = allCheckins.reduce((s, c) => s + (parseInt(c.souls) || 0), 0);

  return (
    <div className="page">
      <div className="card" style={{ textAlign: "center", background: "linear-gradient(135deg, var(--navy-card), #1a2540)", position: "relative" }}>
        <div className="cross-decoration">✝</div>
        <div className="avatar" style={{ width: 72, height: 72, fontSize: 28, margin: "0 auto 14px" }}>{getInitials(user.name)}</div>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{user.name}</div>
        <div style={{ fontSize: 14, color: "var(--white-dim)", marginBottom: 8 }}>📍 {user.city}{user.church ? ` · ${user.church}` : ""}</div>
        <span className={`tier-chip ${tb.cls}`}>{tb.label}</span>
      </div>

      <div className="grid-3">
        <div className="stat-pill"><div className="stat-num">🔥 {appState.streak}</div><div className="stat-label">Day Streak</div></div>
        <div className="stat-pill"><div className="stat-num">{appState.harvestMates.length}</div><div className="stat-label">Harvest Mates</div></div>
        <div className="stat-pill"><div className="stat-num">{appState.joinedGroups.length}</div><div className="stat-label">Groups</div></div>
      </div>
      <div className="separator" style={{ height: 12 }} />
      <div className="grid-3">
        <div className="stat-pill"><div className="stat-num">{totalConvos}</div><div className="stat-label">Gospel Convos</div></div>
        <div className="stat-pill"><div className="stat-num">{appState.rsvpd.length}</div><div className="stat-label">Events RSVP'd</div></div>
        <div className="stat-pill"><div className="stat-num">{appState.prayers.filter(p => !p.anon && p.author === user.name).length}</div><div className="stat-label">Prayers Logged</div></div>
      </div>

      <div className="separator" />
      <div className="card">
        <div className="card-title">Mission Identity</div>
        <blockquote style={{ fontSize: 15, lineHeight: 1.7, color: "var(--white)", fontStyle: "italic", borderLeft: "3px solid var(--gold)", paddingLeft: 16 }}>
          "I am a witness. I am sent. I am part of the Great Commission."
        </blockquote>
        <div style={{ marginTop: 12, fontSize: 13, color: "var(--white-dim)" }}>
          Level: <strong style={{ color: "var(--white)" }}>{user.level ? user.level.charAt(0).toUpperCase() + user.level.slice(1) : "Believer"}</strong>
        </div>
      </div>
    </div>
  );
}

// ─── REDUCER ─────────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {
    case "ADD_MATE": return { ...state, harvestMates: [...state.harvestMates, action.mate] };
    case "JOIN_GROUP": return { ...state, joinedGroups: [...state.joinedGroups, action.id] };
    case "ADD_EVENT": return { ...state, events: [action.event, ...state.events] };
    case "RSVP": return { ...state, rsvpd: [...state.rsvpd, action.eventId] };
    case "ADD_PRAYER": return { ...state, prayers: [action.prayer, ...state.prayers] };
    case "PRAY_FOR": return { ...state, prayers: state.prayers.map(p => p.id === action.id ? { ...p, prayCount: p.prayCount + 1 } : p) };
    case "ANSWER_PRAYER": return { ...state, prayers: state.prayers.map(p => p.id === action.id ? { ...p, answered: true } : p) };
    case "ADD_TESTIMONY": return { ...state, testimonies: [action.testimony, ...state.testimonies] };
    case "REACT_TESTIMONY": return { ...state, testimonies: state.testimonies.map(t => t.id === action.id ? { ...t, reactions: t.reactions + 1 } : t) };
    case "ADD_SOULS": return { ...state, globalSouls: state.globalSouls + action.count, weekSouls: state.weekSouls + action.count };
    case "SET_CHECKIN": return { ...state, checkIns: { ...state.checkIns, [action.date]: action.data } };
    case "UPDATE_STREAK": return { ...state, streak: state.streak + 1 };
    case "SET_TIER": return { ...state };
    default: return state;
  }
}

const DEFAULT_STATE = {
  harvestMates: [],
  joinedGroups: [],
  events: [
    { id: "ev_demo1", title: "Downtown Prayer Walk", type: "prayer_walk", date: "2025-06-14", city: "Atlanta, GA", participants: 25, soulsReported: 8 },
    { id: "ev_demo2", title: "Campus Evangelism Blitz", type: "campus", date: "2025-06-21", city: "Houston, TX", participants: 40, soulsReported: 0 },
    { id: "ev_demo3", title: "City Invasion — Chicago", type: "city_invasion", date: "2025-07-04", city: "Chicago, IL", participants: 150, soulsReported: 0 },
  ],
  rsvpd: [],
  prayers: [
    { id: "pr_demo1", text: "Pray for boldness as I reach my workplace. Lord, give me the right words.", anon: false, author: "Emmanuel Osei", date: "2025-06-10", prayCount: 14, answered: false },
  ],
  testimonies: [
    { id: "t_demo1", text: "Had a 30-minute Gospel conversation with my Uber driver today. He wept, said he needed to hear that. I prayed with him. Only God knows what seeds were planted.", type: "evangelism", author: "Grace Adeyemi", date: "2025-06-09", reactions: 23 },
  ],
  globalSouls: 12483,
  weekSouls: 347,
  streak: 5,
  checkIns: {},
};

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(() => load("goye_user", null));
  const [appState, rawDispatch] = useState(() => load("goye_state", DEFAULT_STATE));
  const [page, setPage] = useState("home");
  const [toasts, setToasts] = useState([]);
  const [upgradeModal, setUpgradeModal] = useState(null);

  // Sync state to localStorage
  useEffect(() => { save("goye_state", appState); }, [appState]);
  useEffect(() => { if (user) save("goye_user", user); }, [user]);

  function dispatch(action) {
    rawDispatch(prev => {
      const next = reducer(prev, action);
      save("goye_state", next);
      return next;
    });
  }

  // Also handle SET_TIER on user object
  function dispatchAll(action) {
    if (action.type === "SET_TIER") {
      setUser(u => { const nu = { ...u, tier: action.tier }; save("goye_user", nu); return nu; });
    } else {
      dispatch(action);
    }
  }

  function addToast(msg) {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }

  function showUpgrade(reason) { setUpgradeModal(reason); }
  function doUpgrade(tier) { dispatchAll({ type: "SET_TIER", tier }); setUpgradeModal(null); addToast(`✅ Upgraded to ${tier === "laborer" ? "Laborer" : "Field Leader"}!`); }

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <Onboarding onComplete={data => { save("goye_user", data); setUser(data); }} />
    </>
  );

  const tierBadge = { sent: { label: "📜 Sent", cls: "tier-sent" }, laborer: { label: "🌾 Laborer", cls: "tier-laborer" }, field: { label: "🏆 Field Leader", cls: "tier-field" } };
  const tb = tierBadge[user.tier] || tierBadge.sent;

  const navItems = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "network", icon: "🤝", label: "Network" },
    { id: "groups", icon: "👥", label: "Groups" },
    { id: "outreach", icon: "📢", label: "Outreach" },
    { id: "prayer", icon: "🙏", label: "Prayer" },
    { id: "testimonies", icon: "🎉", label: "Testimonies" },
    { id: "growth", icon: "🌱", label: "Growth" },
    { id: "subscriptions", icon: "⚡", label: "Mission Tiers" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  const props = { user, appState, dispatch: dispatchAll, showUpgrade, addToast };

  return (
    <>
      <style>{STYLES}</style>
      <ToastContainer toasts={toasts} />
      {upgradeModal && <UpgradeModal reason={upgradeModal} onClose={() => setUpgradeModal(null)} onUpgrade={doUpgrade} />}

      <div className="app-shell">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <span className="logo-cross">✝</span>
            <div>
              <div className="logo-text">GoYe Connect</div>
              <div className="logo-sub">Great Commission Network</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <div key={item.id} className={`nav-item${page === item.id ? " active" : ""}`} onClick={() => setPage(item.id)}>
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === "subscriptions" && user.tier === "sent" && <span className="nav-badge">↑</span>}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="avatar avatar-sm">{getInitials(user.name)}</div>
              <div className="col" style={{ flex: 1, gap: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "var(--white-dim)" }}>{user.city}</div>
              </div>
            </div>
            <span className={`tier-chip ${tb.cls}`}>{tb.label}</span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="main">
          {page === "home" && <HomePage {...props} />}
          {page === "network" && <NetworkPage {...props} />}
          {page === "groups" && <GroupsPage {...props} />}
          {page === "outreach" && <OutreachPage {...props} />}
          {page === "prayer" && <PrayerPage {...props} />}
          {page === "testimonies" && <TestimoniesPage {...props} />}
          {page === "growth" && <GrowthPage {...props} />}
          {page === "subscriptions" && <SubscriptionsPage {...props} />}
          {page === "profile" && <ProfilePage {...props} />}
        </div>
      </div>
    </>
  );
}
