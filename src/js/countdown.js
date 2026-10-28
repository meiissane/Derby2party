/**
 * Real-time Countdown Timer for Derby2party next match
 */

export class CountdownTimer {
  constructor(targetDateStr, containerSelector) {
    this.targetDate = new Date(targetDateStr).getTime();
    this.container = document.querySelector(containerSelector);
    this.interval = null;
  }

  start() {
    this.update();
    this.interval = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  update() {
    if (!this.container) return;

    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance <= 0) {
      this.container.innerHTML = `
        <div class="countdown-live-badge flex items-center gap-2 px-4 py-2 rounded-full bg-[#D6402B]/20 text-[#FAF6EE] border border-[#D6402B]">
          <span class="w-2.5 h-2.5 rounded-full bg-[#D6402B] animate-ping"></span>
          <span class="font-bold text-sm tracking-wide uppercase">Coup d'envoi imminent !</span>
        </div>
      `;
      this.stop();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    this.container.innerHTML = `
      <div class="grid grid-cols-4 gap-2 sm:gap-3 text-center">
        <div class="countdown-unit bg-[#0E0E0E]/80 backdrop-blur-md border border-[#F2B134]/30 rounded-2xl p-2.5 sm:p-3.5 shadow-lg">
          <span class="block text-2xl sm:text-3xl font-extrabold text-[#F2B134] font-heading tracking-tight">${pad(days)}</span>
          <span class="block text-[11px] sm:text-xs text-[#FAF6EE]/70 uppercase tracking-widest font-medium mt-0.5">Jours</span>
        </div>
        <div class="countdown-unit bg-[#0E0E0E]/80 backdrop-blur-md border border-[#F2B134]/30 rounded-2xl p-2.5 sm:p-3.5 shadow-lg">
          <span class="block text-2xl sm:text-3xl font-extrabold text-[#F2B134] font-heading tracking-tight">${pad(hours)}</span>
          <span class="block text-[11px] sm:text-xs text-[#FAF6EE]/70 uppercase tracking-widest font-medium mt-0.5">Heures</span>
        </div>
        <div class="countdown-unit bg-[#0E0E0E]/80 backdrop-blur-md border border-[#F2B134]/30 rounded-2xl p-2.5 sm:p-3.5 shadow-lg">
          <span class="block text-2xl sm:text-3xl font-extrabold text-[#F2B134] font-heading tracking-tight">${pad(minutes)}</span>
          <span class="block text-[11px] sm:text-xs text-[#FAF6EE]/70 uppercase tracking-widest font-medium mt-0.5">Min</span>
        </div>
        <div class="countdown-unit bg-[#0E0E0E]/80 backdrop-blur-md border border-[#D6402B]/40 rounded-2xl p-2.5 sm:p-3.5 shadow-lg">
          <span class="block text-2xl sm:text-3xl font-extrabold text-[#D6402B] font-heading tracking-tight">${pad(seconds)}</span>
          <span class="block text-[11px] sm:text-xs text-[#FAF6EE]/70 uppercase tracking-widest font-medium mt-0.5">Sec</span>
        </div>
      </div>
    `;
  }
}
