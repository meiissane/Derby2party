import React, { useState, useEffect, useMemo } from 'react';
import {
  BRAND_INFO,
  MEMBERSHIP_BENEFITS,
  INITIAL_MATCHES,
  DEFAULT_DEMO_PREDICTIONS,
  SAMPLE_LEADERBOARD_MEMBERS,
  REWARDS_CATALOG,
  calculatePredictionPoints,
} from './data/mockData.js';

const STORAGE_KEYS = {
  VIP_STATE: 'derby2party_vip_state_v1',
  PREDICTIONS: 'derby2party_predictions_v1',
  MATCH_RESULTS: 'derby2party_match_results_v1',
  CLAIMED_REWARDS: 'derby2party_claimed_rewards_v1',
};

export default function App() {
  // Active page: 'activation' | 'vip-pass' | 'prediction-club'
  const [activePage, setActivePage] = useState('activation');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // VIP Pass State (stored locally, ready for QR Code activation)
  const [vipState, setVipState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIP_STATE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      isActivated: false,
      memberName: 'Amadou Diallo',
      memberCity: 'Dakar / Paris',
      passSerial: BRAND_INFO.defaultSerial,
      cardFinish: 'gold', // 'gold' | 'black'
      activatedAt: null,
      qrSource: 'Digital VIP Portal',
    };
  });

  // Submitted Predictions (stored locally in localStorage)
  const [submittedPredictions, setSubmittedPredictions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_DEMO_PREDICTIONS;
  });

  // Draft score inputs on the Prediction Club dashboard
  const [draftScores, setDraftScores] = useState(() => {
    const initial = {};
    INITIAL_MATCHES.forEach((m) => {
      const existing = submittedPredictions[m.id];
      initial[m.id] = {
        home: existing ? existing.home : 1,
        away: existing ? existing.away : 0,
      };
    });
    return initial;
  });

  // Official / Simulated Match Results for testing exact (3pts), outcome (1pt), and miss (0pts)
  const [matchResults, setMatchResults] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATCH_RESULTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const defaults = {};
    INITIAL_MATCHES.forEach((m) => {
      defaults[m.id] = { ...m.officialResult };
    });
    return defaults;
  });

  // Claimed Rewards
  const [claimedRewards, setClaimedRewards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLAIMED_REWARDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['reward-1'];
  });

  // UI Modals & Notifications
  const [toastMessage, setToastMessage] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrInputCode, setQrInputCode] = useState(vipState.passSerial);
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [showFullArtworkFrame, setShowFullArtworkFrame] = useState(false);
  const [showScoreSimulator, setShowScoreSimulator] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIP_STATE, JSON.stringify(vipState));
    } catch (e) {}
  }, [vipState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(submittedPredictions));
    } catch (e) {}
  }, [submittedPredictions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MATCH_RESULTS, JSON.stringify(matchResults));
    } catch (e) {}
  }, [matchResults]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLAIMED_REWARDS, JSON.stringify(claimedRewards));
    } catch (e) {}
  }, [claimedRewards]);

  // Future QR Code URL Parameter Listener (?pass=D2P-001-XXXX&edition=gold&page=vip-pass)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qrPass = params.get('pass') || params.get('qr');
    const editionParam = params.get('edition');
    const pageParam = params.get('page');

    if (qrPass) {
      setVipState((prev) => ({
        ...prev,
        isActivated: true,
        passSerial: qrPass.toUpperCase(),
        cardFinish: editionParam === 'black' ? 'black' : 'gold',
        activatedAt: prev.activatedAt || new Date().toLocaleDateString(),
        qrSource: 'QR Jersey Tag Scan',
      }));
      setActivePage('vip-pass');
      triggerToast(`QR Code Verified (${qrPass.toUpperCase()}) — Culture Drop 001 Activated!`);
    } else if (pageParam && ['activation', 'vip-pass', 'prediction-club'].includes(pageParam)) {
      setActivePage(pageParam);
    }
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const navigateTo = (targetPage) => {
    if (targetPage === activePage) return;
    setIsTransitioning(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setActivePage(targetPage);
      setIsTransitioning(false);
    }, 180);
  };

  // Activate VIP Pass Handler (Page 1 -> Page 2)
  const handleActivatePass = () => {
    setVipState((prev) => ({
      ...prev,
      isActivated: true,
      activatedAt: prev.activatedAt || 'Verified • Culture Drop 001',
    }));
    triggerToast('WELCOME TO DERBY2PARTY VIP — Culture Drop 001 Pass Activated!');
    navigateTo('vip-pass');
  };

  // Update Draft Score for a match
  const handleScoreStep = (matchId, side, delta) => {
    setDraftScores((prev) => {
      const current = prev[matchId] || { home: 0, away: 0 };
      const nextVal = Math.max(0, Math.min(15, Number(current[side] || 0) + delta));
      return {
        ...prev,
        [matchId]: {
          ...current,
          [side]: nextVal,
        },
      };
    });
  };

  const handleDirectScoreInput = (matchId, side, rawValue) => {
    const parsed = rawValue === '' ? 0 : Math.max(0, Math.min(15, parseInt(rawValue, 10) || 0));
    setDraftScores((prev) => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { home: 0, away: 0 }),
        [side]: parsed,
      },
    }));
  };

  // Submit single match prediction
  const handleSubmitPrediction = (match) => {
    const score = draftScores[match.id] || { home: 0, away: 0 };
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSubmittedPredictions((prev) => ({
      ...prev,
      [match.id]: {
        home: Number(score.home),
        away: Number(score.away),
        submittedAt: `Locked in at ${nowStr}`,
      },
    }));
    const evaluation = calculatePredictionPoints(
      score.home,
      score.away,
      matchResults[match.id]?.home,
      matchResults[match.id]?.away
    );
    triggerToast(
      `Prediction Saved: ${match.homeTeam.name} ${score.home} - ${score.away} ${match.awayTeam.name} (${evaluation.label})`
    );
  };

  // Submit all predictions at once
  const handleSubmitAllPredictions = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = { ...submittedPredictions };
    INITIAL_MATCHES.forEach((m) => {
      const draft = draftScores[m.id] || { home: 1, away: 0 };
      updated[m.id] = {
        home: Number(draft.home),
        away: Number(draft.away),
        submittedAt: `Locked in at ${nowStr}`,
      };
    });
    setSubmittedPredictions(updated);
    triggerToast('All 6 Match Predictions Locked In! Leaderboard Updated.');
  };

  // Clear or Reset Demo Predictions
  const handleResetDemoPredictions = () => {
    setSubmittedPredictions(DEFAULT_DEMO_PREDICTIONS);
    const resetDrafts = {};
    INITIAL_MATCHES.forEach((m) => {
      const ex = DEFAULT_DEMO_PREDICTIONS[m.id];
      resetDrafts[m.id] = { home: ex ? ex.home : 1, away: ex ? ex.away : 0 };
    });
    setDraftScores(resetDrafts);
    triggerToast('Demo Predictions Reset to Default Starter Set.');
  };

  // Calculate User Prediction Stats & Points
  const userStats = useMemo(() => {
    let totalPoints = 0;
    let exactCount = 0;
    let outcomeCount = 0;
    let missCount = 0;
    const detailedList = [];

    INITIAL_MATCHES.forEach((match) => {
      const pred = submittedPredictions[match.id];
      if (!pred) return;
      const actual = matchResults[match.id] || match.officialResult;
      const evalResult = calculatePredictionPoints(pred.home, pred.away, actual.home, actual.away);
      totalPoints += evalResult.points;
      if (evalResult.type === 'exact') exactCount += 1;
      else if (evalResult.type === 'outcome') outcomeCount += 1;
      else if (evalResult.type === 'miss') missCount += 1;

      detailedList.push({
        match,
        prediction: pred,
        actual,
        evaluation: evalResult,
      });
    });

    return {
      totalPoints,
      exactCount,
      outcomeCount,
      missCount,
      predictionsCount: detailedList.length,
      detailedList,
    };
  }, [submittedPredictions, matchResults]);

  // Dynamic Leaderboard combining Sample Members + Current User
  const leaderboard = useMemo(() => {
    const userEntry = {
      id: 'current-user',
      name: `${vipState.memberName || 'You'} (You)`,
      city: vipState.memberCity || 'VIP Member 🌍',
      passId: vipState.passSerial,
      edition: BRAND_INFO.edition,
      points: userStats.totalPoints,
      exactScores: userStats.exactCount,
      correctOutcomes: userStats.outcomeCount,
      predictionsCount: userStats.predictionsCount,
      isCurrentUser: true,
      avatarBg: 'from-amber-400 via-yellow-500 to-emerald-600',
    };

    const all = [...SAMPLE_LEADERBOARD_MEMBERS, userEntry];
    all.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores;
      return b.correctOutcomes - a.correctOutcomes;
    });

    return all.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));
  }, [vipState, userStats]);

  const currentUserRank = useMemo(() => {
    const found = leaderboard.find((item) => item.isCurrentUser);
    return found ? found.rank : '-';
  }, [leaderboard]);

  // Interactive 3D Card Mouse Move
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    const rotateY = ((pctX - 50) / 50) * 10;
    const rotateX = ((50 - pctY) / 50) * 10;
    setCardTilt({ rotateX, rotateY, glareX: pctX, glareY: pctY });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const handleClaimReward = (reward) => {
    if (claimedRewards.includes(reward.id)) {
      triggerToast(`Reward "${reward.title}" is already active on your VIP Pass!`);
      return;
    }
    if (userStats.totalPoints < reward.pointsRequired) {
      triggerToast(
        `Predict more matches! You need ${reward.pointsRequired - userStats.totalPoints} more pt(s) to unlock this reward.`
      );
      return;
    }
    setClaimedRewards((prev) => [...prev, reward.id]);
    triggerToast(`Unlocked & Claimed: ${reward.title}! Added to Pass #${vipState.passSerial}`);
  };

  return (
    <div className="min-h-screen bg-[#050B08] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black relative overflow-x-hidden pb-24 md:pb-12">
      {/* Subtle African Geometric Pattern Top Trim */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0F3828] via-[#D4AF37] to-[#0F3828] relative z-50" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 left-4 md:left-auto md:max-w-md z-50 animate-bounce">
          <div className="bg-[#0B1F17]/95 backdrop-blur-xl border border-[#D4AF37] text-amber-100 px-4 py-3.5 rounded-2xl shadow-[0_10px_40px_rgba(212,175,55,0.35)] flex items-center gap-3">
            <img
              src="/assets/derby2party-logo.png"
              alt="Derby2Party"
              className="w-8 h-8 rounded-full border border-[#D4AF37]/60 shrink-0"
            />
            <div className="text-xs sm:text-sm font-medium leading-snug flex-1">{toastMessage}</div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-amber-300/70 hover:text-amber-200 text-xs font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#050B08]/90 backdrop-blur-xl border-b border-emerald-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo Lockup */}
          <button
            onClick={() => navigateTo('activation')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-emerald-500 opacity-50 blur-sm group-hover:opacity-90 transition" />
              <img
                src="/assets/derby2party-logo.png"
                alt="Derby2Party Official Logo"
                className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#D4AF37]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold tracking-wider text-sm sm:text-lg text-white">
                  DERBY<span className="text-[#F5C542]">2</span>PARTY
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5C542] border border-[#D4AF37]/40">
                  VIP EXPERIENCE
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-emerald-300/80 tracking-wider uppercase font-medium">
                Culture Drop 001 • African Football Culture
              </p>
            </div>
          </button>

          {/* Desktop / Tablet Page Navigation Pills */}
          <nav className="hidden md:flex items-center bg-[#0A1812] p-1.5 rounded-full border border-emerald-800/50">
            {[
              { id: 'activation', step: '01', label: 'VIP Activation' },
              { id: 'vip-pass', step: '02', label: 'My VIP Pass' },
              { id: 'prediction-club', step: '03', label: 'Prediction Club' },
            ].map((tab) => {
              const isActive = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => navigateTo(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5C542] to-[#C99E2C] text-black shadow-[0_0_20px_rgba(212,175,55,0.45)]'
                      : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                  }`}
                >
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black/20 text-black font-extrabold' : 'bg-emerald-900/60 text-emerald-300'
                    }`}
                  >
                    {tab.step}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Status / QR Pass Ready Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigateTo('prediction-club')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-700/60 hover:border-[#D4AF37] transition text-xs"
              title="Your Prediction Club Points"
            >
              <span className="text-[#F5C542] font-bold">★</span>
              <span className="font-bold text-white">{userStats.totalPoints}</span>
              <span className="text-emerald-300/90 hidden sm:inline">PTS</span>
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#12261D] border border-[#D4AF37]/50 hover:border-[#F5C542] text-amber-200 text-xs font-semibold tracking-wide transition shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">QR Pass:</span>
              <span className="font-mono text-[11px] text-[#F5C542]">{vipState.passSerial.slice(-4)}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA WITH SMOOTH PAGE TRANSITION */}
      <main
        className={`flex-1 transition-all duration-200 ${
          isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* =========================================================
            PAGE 1 – VIP ACTIVATION (Simplified, Pure & Impactful)
           ========================================================= */}
        {activePage === 'activation' && (
          <div className="relative">
            <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden px-4 py-16">
              {/* Stadium Hero Artwork */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/assets/stadium-hero.jpg"
                  alt="Derby2Party Stadium Experience"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050B08]/75 via-[#050B08]/60 to-[#050B08]/95" />
              </div>

              {/* Centered Hero Content */}
              <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
                {/* Derby2Party Logo */}
                <div className="relative mb-6">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-emerald-500 opacity-60 blur-md" />
                  <img
                    src="/assets/derby2party-logo.png"
                    alt="Derby2Party Logo"
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.4)]"
                  />
                </div>

                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#F5C542] mb-4">
                  DERBY2PARTY • CULTURE DROP 001
                </span>

                {/* Main Headline */}
                <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] uppercase text-white drop-shadow-[0_6px_25px_rgba(0,0,0,0.85)]">
                  WELCOME TO YOUR{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C542] via-[#FFE27A] to-[#D4AF37]">
                    VIP EXPERIENCE.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-5 text-lg sm:text-2xl md:text-3xl font-medium text-emerald-100/95 tracking-wide">
                  Your culture. Your game. Your access.
                </p>

                {/* Primary CTA Button */}
                <div className="mt-10">
                  <button
                    id="activate-vip-pass-btn"
                    onClick={handleActivatePass}
                    className="group relative inline-flex items-center justify-center gap-3 px-9 py-4 sm:px-12 sm:py-5 rounded-2xl font-display font-black text-base sm:text-lg tracking-wider uppercase text-black bg-gradient-to-r from-[#D4AF37] via-[#F5C542] to-[#C89B27] hover:from-[#F5C542] hover:to-[#FFE066] shadow-[0_0_35px_rgba(245,197,66,0.5)] hover:shadow-[0_0_55px_rgba(245,197,66,0.85)] transition-all duration-300"
                  >
                    <span>ACTIVATE MY VIP PASS</span>
                    <span className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =========================================================
            PAGE 2 – MY VIP PASS
           ========================================================= */}
        {activePage === 'vip-pass' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Top Status Banner */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0C2219] via-[#091912] to-[#0C2219] border border-[#D4AF37]/40 rounded-2xl p-4 sm:px-6">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-lg shrink-0">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                      VIP CREDENTIAL ACTIVE
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5C542]">
                      {vipState.passSerial}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    Holder: <strong className="text-white">{vipState.memberName}</strong> ({vipState.memberCity}) • Verified Digital Membership Pass
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#050B08] hover:bg-emerald-950 text-[#F5C542] border border-[#D4AF37]/50 text-xs font-bold uppercase tracking-wider transition"
                >
                  ⌗ Show Event QR Code
                </button>
                <button
                  onClick={() => navigateTo('prediction-club')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C542] text-black text-xs font-extrabold uppercase tracking-wider shadow-md hover:brightness-110 transition"
                >
                  Prediction Club →
                </button>
              </div>
            </div>

            {/* Main VIP Pass Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive 3D Digital Derby2Party VIP Pass */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full relative">
                  {/* Ambient Spotlight behind the pass */}
                  <div className="absolute -inset-4 bg-gradient-to-tr from-[#D4AF37]/25 via-emerald-500/15 to-[#F5C542]/25 rounded-3xl blur-2xl pointer-events-none" />

                  <div className="relative bg-[#091611] border border-[#D4AF37]/50 rounded-3xl p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
                    {/* Card Toolbar: Edition Toggle & Artwork View Mode */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F5C542]" />
                        <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-amber-100">
                          OFFICIAL DERBY2PARTY VIP PASS
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[#050B08] p-1 rounded-xl border border-emerald-900/80">
                        <button
                          onClick={() =>
                            setVipState((prev) => ({ ...prev, cardFinish: 'gold' }))
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            vipState.cardFinish === 'gold'
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C542] text-black'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          Gold Pass
                        </button>
                        <button
                          onClick={() =>
                            setVipState((prev) => ({ ...prev, cardFinish: 'black' }))
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                            vipState.cardFinish === 'black'
                              ? 'bg-slate-200 text-black'
                              : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          Obsidian Pass
                        </button>
                        <button
                          onClick={() => setShowFullArtworkFrame((prev) => !prev)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                            showFullArtworkFrame
                              ? 'bg-emerald-800 text-white'
                              : 'text-emerald-300/80 hover:text-white'
                          }`}
                          title="Toggle between isolated card view and full studio canvas"
                        >
                          {showFullArtworkFrame ? 'Card Crop' : 'Full Frame'}
                        </button>
                      </div>
                    </div>

                    {/* Interactive 3D Card Container (Preserving 100% of User's VIP Pass Artwork) */}
                    <div
                      onMouseMove={handleCardMouseMove}
                      onMouseLeave={handleCardMouseLeave}
                      style={{
                        transform: `perspective(1100px) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
                        transition:
                          cardTilt.rotateX === 0 ? 'transform 0.5s ease-out' : 'transform 0.08s linear',
                      }}
                      className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] select-none"
                    >
                      <img
                        src={
                          showFullArtworkFrame
                            ? vipState.cardFinish === 'gold'
                              ? '/assets/vip-pass-gold.jpg'
                              : '/assets/vip-pass-black.jpg'
                            : vipState.cardFinish === 'gold'
                            ? '/assets/vip-pass-gold-card.png'
                            : '/assets/vip-pass-black-card.png'
                        }
                        alt="Derby2Party Digital VIP Pass"
                        className="w-full h-auto block"
                      />
                      {/* Subtle Interactive Specular Glare Overlay */}
                      <div
                        style={{
                          background: `radial-gradient(circle at ${cardTilt.glareX}% ${cardTilt.glareY}%, rgba(255, 235, 160, 0.22), transparent 60%)`,
                        }}
                        className="absolute inset-0 pointer-events-none"
                      />
                    </div>

                    {/* Pass Footer Metadata Strip */}
                    <div className="mt-4 pt-3 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-semibold">● Interactive 3D View</span>
                        <span className="text-slate-500">|</span>
                        <span>Original Derby2Party Artwork</span>
                      </div>
                      <span className="font-mono text-[#F5C542]">
                        PASS ID: {vipState.passSerial}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Official Pass Specifications & Quick Actions */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
                <div className="bg-[#091611] border border-emerald-900/80 rounded-3xl p-6 shadow-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F5C542] text-xs font-bold uppercase tracking-widest mb-3">
                    <span>VERIFIED DIGITAL PASS</span>
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                    MY DERBY2PARTY VIP PASS
                  </h2>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                    Your official digital credential for the Derby2Party ecosystem. Built for real-world football culture, live matchday events, and community rewards.
                  </p>

                  {/* Required Metadata Specifications */}
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050B08] border border-emerald-900/60">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Edition
                      </span>
                      <span className="font-display font-bold text-sm sm:text-base text-[#F5C542]">
                        {BRAND_INFO.edition}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050B08] border border-emerald-900/60">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Utility
                      </span>
                      <span className="font-display font-bold text-sm sm:text-base text-emerald-300">
                        {BRAND_INFO.utility}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050B08] border border-emerald-900/60">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Pass Format
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-white">
                        Digital VIP Pass (QR Activation Ready)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#050B08] border border-emerald-900/60">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Prediction Club Status
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[#F5C542]">
                        Rank #{currentUserRank} • {userStats.totalPoints} Points
                      </span>
                    </div>
                  </div>

                  {/* Primary CTA to Page 3: Prediction Club */}
                  <div className="mt-6">
                    <button
                      id="access-prediction-club-btn"
                      onClick={() => navigateTo('prediction-club')}
                      className="w-full py-4 px-6 rounded-2xl font-display font-black text-base uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5C542] to-[#C89B27] hover:brightness-110 shadow-[0_0_30px_rgba(245,197,66,0.4)] transition flex items-center justify-center gap-3"
                    >
                      <span>ACCESS PREDICTION CLUB</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MEMBERSHIP BENEFITS SECTION (All 4 Required Benefits) */}
            <section className="mt-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5C542]">
                    CULTURE DROP 001 PRIVILEGES
                  </span>
                  <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-white mt-1">
                    VIP MEMBERSHIP BENEFITS
                  </h3>
                </div>
                <span className="text-xs text-emerald-300/90 font-medium">
                  All 4 pillars unlocked with your active VIP Pass
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {MEMBERSHIP_BENEFITS.map((benefit, index) => (
                  <div
                    key={benefit.id}
                    className="group bg-gradient-to-b from-[#0B1C14] to-[#07120D] border border-emerald-900/80 hover:border-[#D4AF37]/70 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5C542] font-display font-black text-sm">
                          0{index + 1}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {benefit.tag}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-lg text-white group-hover:text-[#F5C542] transition">
                        {benefit.title}
                      </h4>
                      <p className="mt-2 text-xs sm:text-sm text-slate-300/85 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-emerald-900/60 space-y-1.5">
                      {benefit.highlights.map((h) => (
                        <div
                          key={h}
                          className="flex items-center gap-2 text-xs text-emerald-200/90 font-medium"
                        >
                          <span className="text-[#F5C542]">✦</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* =========================================================
            PAGE 3 – PREDICTION CLUB
           ========================================================= */}
        {activePage === 'prediction-club' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {/* Prediction Club Hero Banner with Uploaded Prediction Club Artwork */}
            <div className="relative rounded-3xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl mb-8">
              <div className="absolute inset-0">
                <img
                  src="/assets/prediction-club-hero.jpg"
                  alt="Derby2Party Prediction Club"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050B08]/95 via-[#050B08]/80 to-[#050B08]/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050B08] via-transparent to-transparent" />
              </div>

              <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>DERBY2PARTY PREDICTION CLUB • SEASON 01</span>
                  </div>
                  <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white">
                    CALL THE DERBY.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5C542] to-[#D4AF37]">
                      CLAIM THE CROWN.
                    </span>
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-200/90 leading-relaxed">
                    Lock in your score predictions for Africa’s biggest national and club football showdowns. Every exact score and correct outcome elevates your standing on the VIP Leaderboard.
                  </p>

                  {/* Official Points System Rules Pills */}
                  <div className="mt-5 flex flex-wrap items-center gap-2.5">
                    <div className="px-3.5 py-2 rounded-xl bg-[#D4AF37]/20 border border-[#F5C542] text-amber-100 text-xs font-bold flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#F5C542] text-black font-black">
                        3 PTS
                      </span>
                      <span>Exact Score</span>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-400 text-black font-black">
                        1 PT
                      </span>
                      <span>Correct Outcome (Win/Draw)</span>
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-700 text-white font-bold">
                        0 PTS
                      </span>
                      <span>Incorrect Prediction</span>
                    </div>
                  </div>
                </div>

                {/* Live User Scoreboard Summary Card */}
                <div className="bg-[#07140E]/95 backdrop-blur-xl border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-5 min-w-[270px] shadow-xl">
                  <div className="flex items-center justify-between border-b border-emerald-900/70 pb-3 mb-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold">
                        YOUR VIP STANDING
                      </div>
                      <div className="font-display font-bold text-sm text-white truncate max-w-[170px]">
                        {vipState.memberName}
                      </div>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#D4AF37]/20 text-[#F5C542] font-bold">
                      Rank #{currentUserRank}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#050B08] p-2.5 rounded-xl border border-emerald-900/60">
                      <div className="font-display font-black text-2xl text-[#F5C542]">
                        {userStats.totalPoints}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Total Pts
                      </div>
                    </div>
                    <div className="bg-[#050B08] p-2.5 rounded-xl border border-emerald-900/60">
                      <div className="font-display font-black text-2xl text-emerald-400">
                        {userStats.exactCount}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Exact (3pt)
                      </div>
                    </div>
                    <div className="bg-[#050B08] p-2.5 rounded-xl border border-emerald-900/60">
                      <div className="font-display font-black text-2xl text-white">
                        {userStats.predictionsCount}/{INITIAL_MATCHES.length}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Predicted
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid: Left (Matches + Submitted Predictions) & Right (Leaderboard + Rewards) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT 7 COLUMNS: MATCH PREDICTIONS + SUBMITTED PREDICTIONS */}
              <div className="lg:col-span-7 space-y-8">
                {/* Match Fixtures Header & Bulk Action */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#F5C542]">
                        MATCHDAY FIXTURES
                      </span>
                      <h2 className="font-display font-black text-2xl uppercase text-white">
                        PREDICT MATCH SCORES
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowScoreSimulator((prev) => !prev)}
                        className="px-3 py-2 rounded-xl bg-[#0D2118] hover:bg-emerald-900/70 border border-emerald-700/60 text-emerald-200 text-xs font-bold transition"
                      >
                        {showScoreSimulator ? 'Hide Final Scores' : '⚙️ Edit Final Scores (Test Pts)'}
                      </button>
                      <button
                        id="submit-all-predictions-btn"
                        onClick={handleSubmitAllPredictions}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C542] text-black text-xs font-extrabold uppercase tracking-wider shadow hover:brightness-110 transition"
                      >
                        Save All Predictions
                      </button>
                    </div>
                  </div>

                  {/* Match Cards List */}
                  <div className="space-y-4">
                    {INITIAL_MATCHES.map((match) => {
                      const draft = draftScores[match.id] || { home: 0, away: 0 };
                      const submitted = submittedPredictions[match.id];
                      const actual = matchResults[match.id] || match.officialResult;
                      const evaluation = submitted
                        ? calculatePredictionPoints(
                            submitted.home,
                            submitted.away,
                            actual.home,
                            actual.away
                          )
                        : null;

                      return (
                        <div
                          key={match.id}
                          className={`rounded-3xl p-4 sm:p-5 border transition-all ${
                            submitted
                              ? 'bg-gradient-to-b from-[#0B1E16] to-[#07130E] border-[#D4AF37]/50 shadow-lg'
                              : 'bg-[#08140F] border-emerald-900/70 hover:border-emerald-700'
                          }`}
                        >
                          {/* Match Top Meta Bar */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-emerald-900/60 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold uppercase tracking-wider text-[#F5C542]">
                                {match.competition}
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-slate-400">{match.date}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#050B08] text-slate-300 border border-emerald-900">
                                Final Score: {actual.home} - {actual.away}
                              </span>
                              {evaluation && (
                                <span
                                  className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                                    evaluation.type === 'exact'
                                      ? 'bg-[#F5C542] text-black'
                                      : evaluation.type === 'outcome'
                                      ? 'bg-emerald-500 text-black'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {evaluation.label}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Teams & Score Steppers Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-11 gap-4 items-center">
                            {/* Home Team */}
                            <div className="sm:col-span-4 flex items-center justify-between sm:justify-start gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-[#050B08] border border-emerald-800/80 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                {match.homeTeam.flag}
                              </div>
                              <div>
                                <div className="font-display font-bold text-base sm:text-lg text-white leading-tight">
                                  {match.homeTeam.name}
                                </div>
                                <div className="text-xs text-emerald-300/80">
                                  {match.homeTeam.nickname}
                                </div>
                              </div>
                            </div>

                            {/* Score Prediction Controls */}
                            <div className="sm:col-span-3 flex items-center justify-center gap-2 bg-[#050B08] p-2 rounded-2xl border border-emerald-900/90">
                              {/* Home Score Control */}
                              <div className="flex flex-col items-center">
                                <button
                                  type="button"
                                  aria-label={`Increase ${match.homeTeam.name} score`}
                                  onClick={() => handleScoreStep(match.id, 'home', 1)}
                                  className="w-8 h-6 rounded-lg bg-emerald-950 hover:bg-[#D4AF37] hover:text-black text-emerald-200 font-bold text-xs transition"
                                >
                                  +
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max="15"
                                  aria-label={`${match.homeTeam.name} predicted score`}
                                  value={draft.home}
                                  onChange={(e) =>
                                    handleDirectScoreInput(match.id, 'home', e.target.value)
                                  }
                                  className="w-10 text-center bg-transparent font-display font-black text-xl text-[#F5C542] focus:outline-none my-0.5"
                                />
                                <button
                                  type="button"
                                  aria-label={`Decrease ${match.homeTeam.name} score`}
                                  onClick={() => handleScoreStep(match.id, 'home', -1)}
                                  className="w-8 h-6 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-200 font-bold text-xs transition"
                                >
                                  -
                                </button>
                              </div>

                              <span className="font-display font-bold text-slate-500 text-sm px-1">
                                VS
                              </span>

                              {/* Away Score Control */}
                              <div className="flex flex-col items-center">
                                <button
                                  type="button"
                                  aria-label={`Increase ${match.awayTeam.name} score`}
                                  onClick={() => handleScoreStep(match.id, 'away', 1)}
                                  className="w-8 h-6 rounded-lg bg-emerald-950 hover:bg-[#D4AF37] hover:text-black text-emerald-200 font-bold text-xs transition"
                                >
                                  +
                                </button>
                                <input
                                  type="number"
                                  min="0"
                                  max="15"
                                  aria-label={`${match.awayTeam.name} predicted score`}
                                  value={draft.away}
                                  onChange={(e) =>
                                    handleDirectScoreInput(match.id, 'away', e.target.value)
                                  }
                                  className="w-10 text-center bg-transparent font-display font-black text-xl text-[#F5C542] focus:outline-none my-0.5"
                                />
                                <button
                                  type="button"
                                  aria-label={`Decrease ${match.awayTeam.name} score`}
                                  onClick={() => handleScoreStep(match.id, 'away', -1)}
                                  className="w-8 h-6 rounded-lg bg-emerald-950 hover:bg-emerald-800 text-emerald-200 font-bold text-xs transition"
                                >
                                  -
                                </button>
                              </div>
                            </div>

                            {/* Away Team */}
                            <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-3 sm:text-right">
                              <div className="sm:order-2 w-11 h-11 rounded-2xl bg-[#050B08] border border-emerald-800/80 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                                {match.awayTeam.flag}
                              </div>
                              <div className="sm:order-1">
                                <div className="font-display font-bold text-base sm:text-lg text-white leading-tight">
                                  {match.awayTeam.name}
                                </div>
                                <div className="text-xs text-emerald-300/80">
                                  {match.awayTeam.nickname}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Optional Simulator Bar to test 3pt / 1pt / 0pt rules */}
                          {showScoreSimulator && (
                            <div className="mt-3 p-3 rounded-2xl bg-[#050B08] border border-amber-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="text-amber-200 font-semibold">
                                ⚙️ Test Official Match Result ({match.homeTeam.code} vs{' '}
                                {match.awayTeam.code}):
                              </span>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  max="15"
                                  value={actual.home}
                                  onChange={(e) =>
                                    setMatchResults((prev) => ({
                                      ...prev,
                                      [match.id]: {
                                        ...actual,
                                        home: Math.max(0, parseInt(e.target.value, 10) || 0),
                                      },
                                    }))
                                  }
                                  className="w-12 px-2 py-1 rounded bg-emerald-950 border border-amber-400/50 text-center font-bold text-white"
                                />
                                <span>-</span>
                                <input
                                  type="number"
                                  min="0"
                                  max="15"
                                  value={actual.away}
                                  onChange={(e) =>
                                    setMatchResults((prev) => ({
                                      ...prev,
                                      [match.id]: {
                                        ...actual,
                                        away: Math.max(0, parseInt(e.target.value, 10) || 0),
                                      },
                                    }))
                                  }
                                  className="w-12 px-2 py-1 rounded bg-emerald-950 border border-amber-400/50 text-center font-bold text-white"
                                />
                              </div>
                            </div>
                          )}

                          {/* Bottom Action Row per Match */}
                          <div className="mt-4 pt-3 border-t border-emerald-900/50 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-xs text-slate-400">
                              {submitted ? (
                                <span className="text-emerald-300 font-medium">
                                  ✓ Submitted Prediction:{' '}
                                  <strong className="text-white">
                                    {match.homeTeam.code} {submitted.home} - {submitted.away}{' '}
                                    {match.awayTeam.code}
                                  </strong>{' '}
                                  ({submitted.submittedAt})
                                </span>
                              ) : (
                                <span>Not yet submitted — lock in your score above</span>
                              )}
                            </div>

                            <button
                              onClick={() => handleSubmitPrediction(match)}
                              className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition ${
                                submitted &&
                                submitted.home === draft.home &&
                                submitted.away === draft.away
                                  ? 'bg-emerald-900/70 text-emerald-200 border border-emerald-600/50 hover:bg-[#D4AF37] hover:text-black'
                                  : 'bg-gradient-to-r from-[#D4AF37] to-[#F5C542] text-black shadow-md hover:brightness-110'
                              }`}
                            >
                              {submitted ? 'Update Prediction' : 'Lock In Prediction'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SUBMITTED PREDICTIONS SUMMARY LOG */}
                <div className="bg-[#08150F] border border-emerald-900/80 rounded-3xl p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                        LOCAL PREDICTION VAULT
                      </span>
                      <h3 className="font-display font-black text-xl uppercase text-white">
                        MY SUBMITTED PREDICTIONS ({userStats.predictionsCount})
                      </h3>
                    </div>
                    <button
                      onClick={handleResetDemoPredictions}
                      className="text-xs text-slate-400 hover:text-amber-300 underline"
                    >
                      Reset Demo Predictions
                    </button>
                  </div>

                  {userStats.detailedList.length === 0 ? (
                    <p className="text-sm text-slate-400 py-6 text-center">
                      No predictions locked in yet. Use the match cards above to submit your scores!
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {userStats.detailedList.map(({ match, prediction, actual, evaluation }) => (
                        <div
                          key={match.id}
                          className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#050B08] border border-emerald-900/60"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{match.homeTeam.flag}</span>
                            <span className="font-bold text-sm text-white">
                              {match.homeTeam.name} vs {match.awayTeam.name}
                            </span>
                            <span className="text-lg">{match.awayTeam.flag}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-xs text-slate-300">
                              Your Pick:{' '}
                              <span className="font-mono font-bold text-[#F5C542] px-2 py-0.5 rounded bg-[#D4AF37]/15">
                                {prediction.home} - {prediction.away}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400">
                              Actual:{' '}
                              <span className="font-mono font-semibold text-white">
                                {actual.home} - {actual.away}
                              </span>
                            </div>
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg ${
                                evaluation.type === 'exact'
                                  ? 'bg-[#F5C542] text-black'
                                  : evaluation.type === 'outcome'
                                  ? 'bg-emerald-500 text-black'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              +{evaluation.points} PTS
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT 5 COLUMNS: VIP LEADERBOARD & REWARDS SECTION */}
              <div className="lg:col-span-5 space-y-8">
                {/* LEADERBOARD WITH SAMPLE MEMBERS */}
                <div className="bg-[#091611] border border-[#D4AF37]/50 rounded-3xl p-5 sm:p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#F5C542]">
                        OFFICIAL STANDINGS
                      </span>
                      <h3 className="font-display font-black text-2xl uppercase text-white">
                        VIP LEADERBOARD
                      </h3>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      Culture Drop 001
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {leaderboard.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between gap-3 p-3 rounded-2xl border transition ${
                          member.isCurrentUser
                            ? 'bg-gradient-to-r from-[#D4AF37]/25 via-[#0E261C] to-[#D4AF37]/15 border-[#F5C542] shadow-[0_0_20px_rgba(245,197,66,0.2)]'
                            : 'bg-[#050B08] border-emerald-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Rank Badge */}
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-display font-black text-xs shrink-0 ${
                              member.rank === 1
                                ? 'bg-gradient-to-br from-[#F5C542] to-[#B68618] text-black shadow'
                                : member.rank === 2
                                ? 'bg-slate-300 text-black'
                                : member.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}
                          >
                            #{member.rank}
                          </div>

                          {/* Avatar Initials */}
                          <div
                            className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.avatarBg} flex items-center justify-center font-bold text-xs text-white shrink-0`}
                          >
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>

                          <div className="min-w-0">
                            <div className="font-bold text-sm text-white truncate flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {member.isCurrentUser && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5C542] text-black font-extrabold">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {member.city} • {member.exactScores} Exact ({member.correctOutcomes}{' '}
                              Out.)
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-display font-black text-lg text-[#F5C542]">
                            {member.points} <span className="text-[10px] font-sans">PTS</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REWARDS SECTION */}
                <div className="bg-[#091611] border border-emerald-900/80 rounded-3xl p-5 sm:p-6 shadow-xl">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                      UNLOCKABLE VIP PERKS
                    </span>
                    <h3 className="font-display font-black text-2xl uppercase text-white">
                      PREDICTION CLUB REWARDS
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Earn points from exact scores (3 pts) and outcomes (1 pt) to unlock exclusive Derby2Party drops and hospitality.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {REWARDS_CATALOG.map((reward) => {
                      const isUnlocked = userStats.totalPoints >= reward.pointsRequired;
                      const isClaimed = claimedRewards.includes(reward.id);
                      const progressPct = Math.min(
                        100,
                        Math.round((userStats.totalPoints / reward.pointsRequired) * 100)
                      );

                      return (
                        <div
                          key={reward.id}
                          className={`p-4 rounded-2xl border transition ${
                            isUnlocked
                              ? 'bg-gradient-to-b from-[#0E241B] to-[#07130E] border-[#D4AF37]/60'
                              : 'bg-[#050B08] border-emerald-950 opacity-90'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F5C542]">
                              {reward.tier}
                            </span>
                            <span className="font-mono text-xs font-bold text-emerald-300">
                              {userStats.totalPoints} / {reward.pointsRequired} PTS
                            </span>
                          </div>

                          <h4 className="font-display font-bold text-base text-white">
                            {reward.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-300/85 leading-relaxed">
                            {reward.description}
                          </p>

                          {/* Progress bar */}
                          <div className="mt-3 w-full h-2 rounded-full bg-emerald-950 overflow-hidden">
                            <div
                              style={{ width: `${progressPct}%` }}
                              className="h-full bg-gradient-to-r from-emerald-400 to-[#F5C542] transition-all duration-500"
                            />
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div className="flex flex-wrap gap-1.5">
                              {reward.perks.map((perk) => (
                                <span
                                  key={perk}
                                  className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-200 border border-emerald-800/60"
                                >
                                  {perk}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => handleClaimReward(reward)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shrink-0 transition ${
                                isClaimed
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                                  : isUnlocked
                                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C542] text-black shadow hover:brightness-110'
                                  : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {isClaimed
                                ? '✓ Claimed'
                                : isUnlocked
                                ? 'Claim Reward'
                                : `Need ${reward.pointsRequired - userStats.totalPoints} pts`}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR CODE ACTIVATION & CHECK-IN MODAL (Prepared for Future Physical Jersey / Pass QR Scanning) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#091712] border border-[#D4AF37] rounded-3xl max-w-md w-full p-6 shadow-[0_0_60px_rgba(212,175,55,0.3)] relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-950 text-slate-300 hover:text-white flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/derby2party-logo.png"
                alt="Derby2Party"
                className="w-10 h-10 rounded-full border border-[#D4AF37]"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5C542]">
                  QR CODE CHECK-IN & ACTIVATION
                </span>
                <h3 className="font-display font-black text-xl text-white uppercase">
                  VIP PASS QR CREDENTIAL
                </h3>
              </div>
            </div>

            {/* Scannable Styled QR Matrix Representation */}
            <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex flex-col items-center justify-center shadow-inner relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#050B08]">
                <rect x="5" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="12" y="12" width="12" height="12" fill="currentColor" />
                <rect x="69" y="5" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="76" y="12" width="12" height="12" fill="currentColor" />
                <rect x="5" y="69" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="6" />
                <rect x="12" y="76" width="12" height="12" fill="currentColor" />
                {/* Data modules */}
                <rect x="38" y="8" width="6" height="6" fill="currentColor" />
                <rect x="50" y="8" width="10" height="6" fill="currentColor" />
                <rect x="38" y="20" width="12" height="6" fill="currentColor" />
                <rect x="56" y="20" width="6" height="12" fill="currentColor" />
                <rect x="8" y="38" width="12" height="6" fill="currentColor" />
                <rect x="26" y="38" width="6" height="12" fill="currentColor" />
                <rect x="38" y="38" width="24" height="24" rx="4" fill="#0F3828" />
                <circle cx="50" cy="50" r="7" fill="#D4AF37" />
                <rect x="68" y="38" width="8" height="8" fill="currentColor" />
                <rect x="82" y="42" width="10" height="6" fill="currentColor" />
                <rect x="8" y="52" width="8" height="10" fill="currentColor" />
                <rect x="70" y="56" width="12" height="8" fill="currentColor" />
                <rect x="86" y="56" width="6" height="16" fill="currentColor" />
                <rect x="38" y="70" width="10" height="8" fill="currentColor" />
                <rect x="54" y="68" width="8" height="14" fill="currentColor" />
                <rect x="68" y="74" width="14" height="8" fill="currentColor" />
                <rect x="42" y="84" width="16" height="8" fill="currentColor" />
                <rect x="74" y="86" width="18" height="6" fill="currentColor" />
              </svg>
            </div>

            <div className="mt-4 text-center">
              <div className="font-mono font-bold text-sm text-[#F5C542]">
                {vipState.passSerial}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Edition: Culture Drop 001 • Utility: Exclusive VIP access
              </p>
            </div>

            {/* Enter / Simulate a Jersey QR Serial Code */}
            <div className="mt-5 pt-4 border-t border-emerald-900/70">
              <label className="block text-[11px] uppercase tracking-wider text-emerald-300 font-bold mb-1.5">
                Activate or Switch Jersey / VIP QR Code Serial:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrInputCode}
                  onChange={(e) => setQrInputCode(e.target.value.toUpperCase())}
                  placeholder="e.g. D2P-CD001-0842"
                  className="flex-1 px-3 py-2 rounded-xl bg-[#050B08] border border-emerald-800 text-sm font-mono text-white focus:border-[#F5C542] focus:outline-none"
                />
                <button
                  onClick={() => {
                    const cleanCode = (qrInputCode || 'D2P-CD001-0842').trim();
                    setVipState((prev) => ({
                      ...prev,
                      isActivated: true,
                      passSerial: cleanCode,
                      qrSource: 'QR Serial Verified',
                    }));
                    setShowQrModal(false);
                    navigateTo('vip-pass');
                    triggerToast(`QR Pass Serial ${cleanCode} Verified & Linked!`);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#F5C542] text-black font-bold text-xs uppercase tracking-wider"
                >
                  Verify QR
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Tip: Physical QR tags can also deep-link directly via{' '}
                <code className="text-amber-200">?pass=D2P-CD001-XXXX</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION DOCK (Mobile-First Ergonomics) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#050B08]/95 backdrop-blur-xl border-t border-[#D4AF37]/40 px-3 py-2">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {[
            { id: 'activation', icon: '⚡', label: 'Activation' },
            { id: 'vip-pass', icon: '💳', label: 'My VIP Pass' },
            { id: 'prediction-club', icon: '🏆', label: 'Predictions' },
          ].map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-2xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C542] text-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-base leading-none mb-1">{item.icon}</span>
                <span className="text-[11px] tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* FOOTER */}
      <footer className="border-t border-emerald-950 bg-[#040806] py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src="/assets/derby2party-logo.png"
              alt="Derby2Party"
              className="w-7 h-7 rounded-full border border-[#D4AF37]/60"
            />
            <span>
              <strong className="text-white">DERBY2PARTY VIP EXPERIENCE</strong> • Culture Drop 001 • Digital Membership & Prediction Club
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('activation')} className="hover:text-[#F5C542]">
              VIP Activation
            </button>
            <button onClick={() => navigateTo('vip-pass')} className="hover:text-[#F5C542]">
              My VIP Pass
            </button>
            <button onClick={() => navigateTo('prediction-club')} className="hover:text-[#F5C542]">
              Prediction Club
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
