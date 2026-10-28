/**
 * Billetterie Stepper Engine & Golden Ticket Generator - Version Fluide & Intuitive
 * Steps: 1. Match -> 2. Places (1-8) -> 3. Coordonnées & Paiement Simulé -> 4. Billet Doré VIP
 */

export class TicketingStepper {
  constructor(matchs, onTicketConfirmed) {
    this.matchs = matchs || [];
    this.currentStep = 1;
    this.selectedMatchId = this.matchs[0] ? this.matchs[0].id : null;
    this.quantity = 2;
    this.unitPrice = this.matchs[0] ? this.matchs[0].price : 18;
    this.hasAllocoPack = false;
    this.customer = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      paymentMethod: 'card'
    };
    this.confirmedTicket = null;
    this.onTicketConfirmed = onTicketConfirmed;

    // Check if there is an existing ticket in localStorage
    try {
      const saved = localStorage.getItem('derby2party_ticket');
      if (saved) {
        this.savedTicket = JSON.parse(saved);
      }
    } catch (e) {
      this.savedTicket = null;
    }

    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  getSelectedMatch() {
    return this.matchs.find(m => m.id === this.selectedMatchId) || this.matchs[0] || {
      id: "civ-sen-2026",
      competition: "CAN",
      competitionLabel: "Coupe d'Afrique des Nations",
      title: "Côte d'Ivoire vs Sénégal",
      formattedDate: "Samedi 14 Novembre 2026",
      time: "20:45",
      doorsOpen: "19:00",
      location: "Le Ground Control, Paris 12e",
      price: 18,
      remainingSeats: 38,
      teams: { home: { code: "CIV", name: "Côte d'Ivoire" }, away: { code: "SEN", name: "Sénégal" } }
    };
  }

  selectMatch(matchId, autoAdvance = true) {
    this.selectedMatchId = matchId;
    const match = this.getSelectedMatch();
    if (match) {
      this.unitPrice = match.price;
    }
    
    if (autoAdvance) {
      this.goToStep(2);
    } else {
      this.render();
    }
  }

  setQuantity(qty) {
    this.quantity = Math.max(1, Math.min(8, qty));
    this.render();
  }

  goToStep(step) {
    this.currentStep = step;
    this.render();
    
    // Smooth scroll to billetterie with top offset
    const section = document.getElementById('billetterie');
    if (section) {
      const topOffset = section.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  }

  calculateTotal() {
    const match = this.getSelectedMatch();
    const basePrice = (match ? match.price : this.unitPrice) * this.quantity;
    const discount = this.quantity >= 4 ? Math.round(basePrice * 0.10) : 0;
    const extraFood = this.hasAllocoPack ? 7 * this.quantity : 0;
    const total = basePrice - discount + extraFood;
    return { basePrice, discount, extraFood, total };
  }

  generateTicketReference() {
    const rand = Math.floor(100000 + Math.random() * 900000);
    const match = this.getSelectedMatch();
    const code = match && match.teams && match.teams.home ? match.teams.home.code : 'D2P';
    return `D2P-${code}-${rand}`;
  }

  renderQRCodeSVG(ref) {
    return `
      <svg class="w-24 h-24 sm:w-28 sm:h-28 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="10" fill="#FAF6EE"/>
        <!-- Corner Markers -->
        <rect x="8" y="8" width="24" height="24" rx="4" stroke="#0E0E0E" stroke-width="4" fill="none"/>
        <rect x="14" y="14" width="12" height="12" fill="#0E0E0E"/>
        <rect x="68" y="8" width="24" height="24" rx="4" stroke="#0E0E0E" stroke-width="4" fill="none"/>
        <rect x="74" y="14" width="12" height="12" fill="#0E0E0E"/>
        <rect x="8" y="68" width="24" height="24" rx="4" stroke="#0E0E0E" stroke-width="4" fill="none"/>
        <rect x="14" y="74" width="12" height="12" fill="#0E0E0E"/>
        <!-- Matrix Data Grid -->
        <rect x="38" y="10" width="6" height="6" fill="#0E0E0E"/>
        <rect x="48" y="14" width="6" height="6" fill="#0E0E0E"/>
        <rect x="56" y="8" width="6" height="6" fill="#0E0E0E"/>
        <rect x="12" y="38" width="6" height="6" fill="#0E0E0E"/>
        <rect x="22" y="44" width="6" height="6" fill="#0E0E0E"/>
        <rect x="38" y="36" width="6" height="6" fill="#0E0E0E"/>
        <rect x="48" y="44" width="6" height="6" fill="#0E0E0E"/>
        <rect x="58" y="36" width="6" height="6" fill="#0E0E0E"/>
        <rect x="68" y="42" width="6" height="6" fill="#0E0E0E"/>
        <rect x="82" y="38" width="6" height="6" fill="#0E0E0E"/>
        <rect x="38" y="68" width="6" height="6" fill="#0E0E0E"/>
        <rect x="48" y="74" width="6" height="6" fill="#0E0E0E"/>
        <rect x="58" y="82" width="6" height="6" fill="#0E0E0E"/>
        <rect x="68" y="70" width="6" height="6" fill="#0E0E0E"/>
        <rect x="80" y="78" width="6" height="6" fill="#0E0E0E"/>
        <!-- Center Gold Ball Emblem -->
        <circle cx="50" cy="50" r="10" fill="#F2B134" stroke="#0E0E0E" stroke-width="2"/>
        <circle cx="50" cy="50" r="4" fill="#0B3D2E"/>
      </svg>
    `;
  }

  fillDemoData() {
    this.customer = {
      firstName: 'Kofi',
      lastName: 'Mensah',
      email: 'kofi.mensah@gmail.com',
      phone: '06 12 34 56 78',
      paymentMethod: 'card'
    };
    this.render();

    if (window.confetti) {
      window.confetti.burst({ count: 30, spread: 60, velocity: 16 });
    }
  }

  render() {
    const container = document.getElementById('billetterie-container');
    if (!container) return;

    const match = this.getSelectedMatch();
    const { basePrice, discount, extraFood, total } = this.calculateTotal();

    // Visual Stepper Progress Bar Header
    const stepperHeader = `
      <div class="mb-8 border-b border-white/10 pb-6">
        <div class="flex items-center justify-between max-w-xl mx-auto relative px-2">
          <!-- Background track line -->
          <div class="absolute top-4 left-6 right-6 h-0.5 bg-white/10 -translate-y-1/2 z-0"></div>
          <!-- Active track line -->
          <div 
            class="absolute top-4 left-6 h-0.5 bg-[#F2B134] -translate-y-1/2 z-0 transition-all duration-500" 
            style="width: ${Math.min(100, Math.max(0, (this.currentStep - 1) / 3 * 100))}%"
          ></div>

          <!-- Step 1 -->
          <button 
            type="button"
            class="step-indicator-btn relative z-10 flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
            data-goto-step="1"
          >
            <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              this.currentStep === 1 
                ? 'bg-[#F2B134] text-[#0E0E0E] ring-4 ring-[#F2B134]/30 scale-110' 
                : this.currentStep > 1 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/10 text-[#FAF6EE]/60'
            }">
              ${this.currentStep > 1 ? '✓' : '1'}
            </span>
            <span class="text-[11px] font-bold uppercase tracking-wider ${this.currentStep === 1 ? 'text-[#F2B134]' : 'text-[#FAF6EE]/60'}">
              Match
            </span>
          </button>

          <!-- Step 2 -->
          <button 
            type="button"
            class="step-indicator-btn relative z-10 flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
            data-goto-step="2"
          >
            <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              this.currentStep === 2 
                ? 'bg-[#F2B134] text-[#0E0E0E] ring-4 ring-[#F2B134]/30 scale-110' 
                : this.currentStep > 2 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/10 text-[#FAF6EE]/60'
            }">
              ${this.currentStep > 2 ? '✓' : '2'}
            </span>
            <span class="text-[11px] font-bold uppercase tracking-wider ${this.currentStep === 2 ? 'text-[#F2B134]' : 'text-[#FAF6EE]/60'}">
              Places
            </span>
          </button>

          <!-- Step 3 -->
          <button 
            type="button"
            class="step-indicator-btn relative z-10 flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer"
            data-goto-step="3"
          >
            <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              this.currentStep === 3 
                ? 'bg-[#F2B134] text-[#0E0E0E] ring-4 ring-[#F2B134]/30 scale-110' 
                : this.currentStep > 3 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/10 text-[#FAF6EE]/60'
            }">
              ${this.currentStep > 3 ? '✓' : '3'}
            </span>
            <span class="text-[11px] font-bold uppercase tracking-wider ${this.currentStep === 3 ? 'text-[#F2B134]' : 'text-[#FAF6EE]/60'}">
              Paiement
            </span>
          </button>

          <!-- Step 4 -->
          <div class="relative z-10 flex flex-col items-center gap-1.5">
            <span class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              this.currentStep === 4 
                ? 'bg-[#F2B134] text-[#0E0E0E] ring-4 ring-[#F2B134]/40 animate-bounce' 
                : 'bg-white/10 text-[#FAF6EE]/60'
            }">
              ★
            </span>
            <span class="text-[11px] font-bold uppercase tracking-wider ${this.currentStep === 4 ? 'text-[#F2B134]' : 'text-[#FAF6EE]/60'}">
              Billet Doré
            </span>
          </div>
        </div>
      </div>
    `;

    let stepHtml = '';

    // ==========================================
    // ÉTAPE 1 : CHOIX DU MATCH
    // ==========================================
    if (this.currentStep === 1) {
      stepHtml = `
        <div class="step-fade-in">
          <div class="text-center max-w-xl mx-auto mb-8">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE] font-heading">
              1. Choisissez votre affiche
            </h3>
            <p class="text-[#FAF6EE]/70 text-sm mt-1.5">
              Cliquez sur la rencontre souhaitée pour configurer vos places.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            ${this.matchs.map(m => {
              const isSelected = m.id === this.selectedMatchId;
              return `
                <div 
                  class="match-select-card cursor-pointer rounded-2xl p-5 border transition-all duration-300 relative overflow-hidden group ${
                    isSelected 
                      ? 'bg-[#0B3D2E]/90 border-[#F2B134] shadow-xl shadow-[#F2B134]/15 ring-2 ring-[#F2B134]' 
                      : 'bg-[#0E0E0E]/90 border-white/10 hover:border-[#F2B134]/60 hover:bg-[#0E0E0E]'
                  }"
                  data-select-match="${m.id}"
                >
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-[#FAF6EE]">
                      ${m.competition}
                    </span>
                    <span class="text-xs font-bold text-[#F2B134]">${m.price}€ / place</span>
                  </div>

                  <h4 class="text-lg font-bold text-[#FAF6EE] font-heading mb-1 group-hover:text-[#F2B134] transition-colors">
                    ${m.title}
                  </h4>
                  <p class="text-xs text-[#FAF6EE]/70 mb-3">${m.formattedDate} • Coup d'envoi à ${m.time}</p>

                  <div class="flex items-center justify-between text-xs text-[#FAF6EE]/60 pt-3 border-t border-white/10">
                    <span class="truncate">${m.location}</span>
                    <span class="font-bold ${isSelected ? 'text-[#F2B134]' : 'text-[#FAF6EE]'} flex items-center gap-1 shrink-0">
                      <span>Sélectionner</span>
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="text-center mt-8">
            <button 
              id="btn-goto-step-2"
              class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#F2B134] text-[#0E0E0E] font-extrabold text-sm uppercase tracking-wider hover:bg-[#e2a229] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#F2B134]/25 cursor-pointer"
            >
              <span>Continuer avec ce match</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      `;
    } 
    
    // ==========================================
    // ÉTAPE 2 : NOMBRE DE PLACES
    // ==========================================
    else if (this.currentStep === 2) {
      stepHtml = `
        <div class="step-fade-in max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE] font-heading">
              2. Nombre de places
            </h3>
            <p class="text-[#FAF6EE]/70 text-sm mt-1.5">
              Venez seul ou invitez votre bande. À partir de 4 places, bénéficiez de <strong>-10%</strong> !
            </p>
          </div>

          <!-- Selected match pill recap -->
          <div class="flex items-center justify-between bg-[#0B3D2E]/70 border border-[#F2B134]/40 rounded-2xl p-4 mb-6 shadow-md">
            <div>
              <span class="text-[10px] text-[#F2B134] font-bold uppercase tracking-wider">Affiche sélectionnée</span>
              <h4 class="font-bold text-[#FAF6EE] text-base font-heading">${match.title}</h4>
              <p class="text-xs text-[#FAF6EE]/70">${match.formattedDate} à ${match.time} • ${match.location}</p>
            </div>
            <button 
              id="btn-change-match"
              class="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-[#F2B134] font-semibold transition-colors cursor-pointer"
            >
              Changer
            </button>
          </div>

          <!-- Quantity Stepper -->
          <div class="bg-[#0E0E0E]/80 border border-white/10 rounded-3xl p-6 sm:p-8 text-center mb-6">
            <label class="block text-sm font-semibold text-[#FAF6EE] mb-4">Combien serez-vous ? (1 à 8 personnes)</label>
            
            <div class="inline-flex items-center gap-6 bg-[#0B3D2E]/40 border border-white/15 rounded-full px-5 py-2.5 shadow-inner">
              <button 
                id="btn-qty-minus"
                type="button"
                class="w-11 h-11 rounded-full bg-white/10 hover:bg-[#F2B134] hover:text-[#0E0E0E] text-[#FAF6EE] font-bold text-2xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                ${this.quantity <= 1 ? 'disabled' : ''}
                aria-label="Diminuer le nombre de places"
              >
                −
              </button>
              
              <div class="w-20">
                <span class="text-4xl font-black text-[#F2B134] font-heading block">${this.quantity}</span>
                <span class="block text-[11px] text-[#FAF6EE]/70 uppercase font-bold tracking-wider">
                  ${this.quantity > 1 ? 'places' : 'place'}
                </span>
              </div>

              <button 
                id="btn-qty-plus"
                type="button"
                class="w-11 h-11 rounded-full bg-white/10 hover:bg-[#F2B134] hover:text-[#0E0E0E] text-[#FAF6EE] font-bold text-2xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                ${this.quantity >= 8 ? 'disabled' : ''}
                aria-label="Augmenter le nombre de places"
              >
                +
              </button>
            </div>

            <!-- Perk indicator -->
            <div class="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3D2E] text-[#FAF6EE] border border-[#F2B134]/30">
                <svg class="w-3.5 h-3.5 text-[#F2B134]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                ${this.quantity} boisson(s) offerte(s) comprise(s)
              </span>
              ${this.quantity >= 4 ? `
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2B134]/20 text-[#F2B134] border border-[#F2B134]/40 font-bold">
                  ★ Pack Bande activé : -10% sur vos billets
                </span>
              ` : `
                <span class="text-[#FAF6EE]/50">
                  (Ajoutez ${4 - this.quantity} place(s) pour profiter du Pack Bande -10%)
                </span>
              `}
            </div>

            <!-- Add-on Alloco Street Food Box -->
            <div class="mt-6 pt-6 border-t border-white/10 text-left">
              <label class="flex items-center justify-between cursor-pointer group p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors gap-3 border border-transparent hover:border-[#F2B134]/30">
                <div class="flex items-center gap-3.5 min-w-0">
                  <input 
                    type="checkbox" 
                    id="addon-food" 
                    class="w-5 h-5 rounded accent-[#F2B134] cursor-pointer shrink-0"
                    ${this.hasAllocoPack ? 'checked' : ''}
                  >
                  <img src="./assets/food.jpg" alt="Option Street Food Alloco" class="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/20 shadow-md">
                  <div class="min-w-0">
                    <span class="text-sm font-bold text-[#FAF6EE] block truncate">Option Street Food Box (+7€ / pers.)</span>
                    <p class="text-xs text-[#FAF6EE]/60 truncate">Alloco croustillant, pastels dorés, bowls généreux et sauce douce.</p>
                  </div>
                </div>
                <span class="text-xs font-bold text-[#F2B134] whitespace-nowrap shrink-0">+${7 * this.quantity}€</span>
              </label>
            </div>
          </div>

          <!-- Total live recap -->
          <div class="flex items-center justify-between px-2 mb-6 text-sm">
            <span class="text-[#FAF6EE]/70 font-medium">Sous-total :</span>
            <div class="text-right">
              ${discount > 0 ? `<span class="text-xs text-[#FAF6EE]/50 line-through mr-2">${basePrice + extraFood}€</span>` : ''}
              <span class="text-2xl sm:text-3xl font-black text-[#F2B134] font-heading">${total}€</span>
            </div>
          </div>

          <div class="flex items-center justify-between gap-4">
            <button 
              id="btn-back-step-1"
              type="button"
              class="px-6 py-3.5 rounded-full border border-white/20 text-[#FAF6EE] text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
            >
              Retour
            </button>
            <button 
              id="btn-goto-step-3"
              type="button"
              class="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#F2B134] text-[#0E0E0E] font-extrabold text-sm uppercase tracking-wider hover:bg-[#e2a229] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#F2B134]/25 cursor-pointer"
            >
              <span>Continuer vers les coordonnées (${total}€)</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      `;
    } 
    
    // ==========================================
    // ÉTAPE 3 : COORDONNÉES & PAIEMENT SIMULÉ
    // ==========================================
    else if (this.currentStep === 3) {
      stepHtml = `
        <div class="step-fade-in max-w-2xl mx-auto">
          <div class="text-center mb-6">
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#FAF6EE] font-heading">
              3. Coordonnées & Paiement
            </h3>
            <p class="text-[#FAF6EE]/70 text-sm mt-1.5">
              Renseignez vos coordonnées pour recevoir votre billet doré d'invitation.
            </p>
          </div>

          <!-- Quick Fill Demo Button (Zero friction testing) -->
          <div class="mb-6 p-3 rounded-2xl bg-[#0B3D2E]/60 border border-[#F2B134]/40 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 text-xs text-[#FAF6EE]">
              <span class="text-lg">⚡</span>
              <div>
                <span class="font-bold text-[#F2B134] block">Mode Démo Simplifié :</span>
                <span class="text-[#FAF6EE]/80 text-[11px]">Remplissez le formulaire en 1 clic pour tester immédiatement la délivrance du billet.</span>
              </div>
            </div>
            <button 
              type="button" 
              id="btn-quick-fill-demo"
              class="px-3.5 py-1.5 rounded-full bg-[#F2B134] text-[#0E0E0E] font-bold text-xs hover:bg-[#e2a229] transition-all shrink-0 cursor-pointer shadow-md"
            >
              Remplir en 1 clic
            </button>
          </div>

          <!-- Order Summary Card -->
          <div class="bg-[#0B3D2E]/40 border border-[#F2B134]/30 rounded-2xl p-5 mb-6 text-sm">
            <div class="flex justify-between items-start pb-3 border-b border-white/10">
              <div>
                <h4 class="font-bold text-[#FAF6EE] text-base">${match.title}</h4>
                <p class="text-xs text-[#FAF6EE]/70">${match.formattedDate} à ${match.time} • ${match.location}</p>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-[#F2B134]/20 text-[#F2B134] text-xs font-bold">
                ${this.quantity} place(s)
              </span>
            </div>
            
            <div class="pt-3 space-y-1.5 text-xs text-[#FAF6EE]/80">
              <div class="flex justify-between">
                <span>Billets (${this.quantity} × ${match.price}€)</span>
                <span>${basePrice}€</span>
              </div>
              ${discount > 0 ? `
                <div class="flex justify-between text-[#F2B134] font-medium">
                  <span>Pack Bande (-10%)</span>
                  <span>-${discount}€</span>
                </div>
              ` : ''}
              ${extraFood > 0 ? `
                <div class="flex justify-between text-[#FAF6EE]">
                  <span>Option Street Food Box (${this.quantity} × 7€)</span>
                  <span>+${extraFood}€</span>
                </div>
              ` : ''}
              <div class="flex justify-between font-bold text-sm text-[#FAF6EE] pt-2 border-t border-white/10">
                <span>Total à régler</span>
                <span class="text-xl text-[#F2B134] font-heading font-black">${total}€</span>
              </div>
            </div>
          </div>

          <!-- Customer Form -->
          <form id="checkout-form" class="space-y-4 mb-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="cust-first-name" class="block text-xs font-bold text-[#FAF6EE] mb-1">Prénom *</label>
                <input 
                  type="text" 
                  id="cust-first-name" 
                  placeholder="Kofi" 
                  value="${this.customer.firstName}"
                  class="w-full px-4 py-3 rounded-xl bg-[#0E0E0E] border border-white/20 text-[#FAF6EE] placeholder-white/30 text-base sm:text-sm focus:outline-none focus:border-[#F2B134]"
                >
              </div>
              <div>
                <label for="cust-last-name" class="block text-xs font-bold text-[#FAF6EE] mb-1">Nom *</label>
                <input 
                  type="text" 
                  id="cust-last-name" 
                  placeholder="Mensah" 
                  value="${this.customer.lastName}"
                  class="w-full px-4 py-3 rounded-xl bg-[#0E0E0E] border border-white/20 text-[#FAF6EE] placeholder-white/30 text-base sm:text-sm focus:outline-none focus:border-[#F2B134]"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="cust-email" class="block text-xs font-bold text-[#FAF6EE] mb-1">Email pour le billet *</label>
                <input 
                  type="email" 
                  id="cust-email" 
                  placeholder="kofi.mensah@gmail.com" 
                  value="${this.customer.email}"
                  class="w-full px-4 py-3 rounded-xl bg-[#0E0E0E] border border-white/20 text-[#FAF6EE] placeholder-white/30 text-base sm:text-sm focus:outline-none focus:border-[#F2B134]"
                >
              </div>
              <div>
                <label for="cust-phone" class="block text-xs font-bold text-[#FAF6EE] mb-1">Téléphone mobile *</label>
                <input 
                  type="tel" 
                  id="cust-phone" 
                  placeholder="06 12 34 56 78" 
                  value="${this.customer.phone}"
                  class="w-full px-4 py-3 rounded-xl bg-[#0E0E0E] border border-white/20 text-[#FAF6EE] placeholder-white/30 text-base sm:text-sm focus:outline-none focus:border-[#F2B134]"
                >
              </div>
            </div>

            <!-- Simulated Payment Gate Notice -->
            <div class="mt-6 p-4 rounded-2xl bg-[#0E0E0E] border border-[#F2B134]/40">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-[#F2B134] uppercase tracking-wider flex items-center gap-1.5">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Simulation de paiement sécurisé (Mode Démo)
                </span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  Aucun prélèvement réel
                </span>
              </div>
              <p class="text-xs text-[#FAF6EE]/70 leading-relaxed mb-3">
                Emplacement prévu pour le branchement Stripe. La validation ci-dessous déclenche instantanément la délivrance de votre Billet Doré VIP et son QR Code.
              </p>
              
              <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center justify-center gap-2 p-3 rounded-xl border border-[#F2B134] bg-[#F2B134]/15 cursor-pointer text-xs font-bold text-[#FAF6EE]">
                  <input type="radio" name="pay-opt" value="card" checked class="accent-[#F2B134]">
                  <span>Carte Bancaire</span>
                </label>
                <label class="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/15 bg-white/5 cursor-pointer text-xs font-semibold text-[#FAF6EE]/80">
                  <input type="radio" name="pay-opt" value="apple" class="accent-[#F2B134]">
                  <span>Apple Pay</span>
                </label>
              </div>
            </div>

            <div class="flex items-center justify-between gap-4 pt-4">
              <button 
                type="button"
                id="btn-back-step-2"
                class="px-6 py-3.5 rounded-full border border-white/20 text-[#FAF6EE] text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer"
              >
                Retour
              </button>
              <button 
                type="submit"
                id="btn-submit-order"
                class="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#F2B134] text-[#0E0E0E] font-black text-sm uppercase tracking-wider hover:bg-[#e2a229] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#F2B134]/30 cursor-pointer"
              >
                <span>Confirmer & Obtenir mon Billet Doré (${total}€)</span>
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </form>
        </div>
      `;
    } 
    
    // ==========================================
    // ÉTAPE 4 : BILLET DORÉ VIP STYLISÉ
    // ==========================================
    else if (this.currentStep === 4 && this.confirmedTicket) {
      const t = this.confirmedTicket;
      stepHtml = `
        <div class="step-fade-in max-w-2xl mx-auto text-center">
          <!-- Success header -->
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2B134] text-[#0E0E0E] mb-4 shadow-2xl shadow-[#F2B134]/40 animate-bounce">
            <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 class="text-3xl sm:text-4xl font-black text-[#FAF6EE] font-heading mb-2">
            Réservation Confirmée !
          </h3>
          <p class="text-[#FAF6EE]/80 text-sm max-w-md mx-auto mb-8">
            Bienvenue dans l'arène Derby2party. Votre place vous attend autour de la table et devant l'écran géant.
          </p>

          <!-- GOLDEN TICKET (Billet Doré Stylisé) -->
          <div id="golden-ticket-card" class="golden-ticket relative rounded-3xl p-5 sm:p-8 text-left shadow-2xl overflow-hidden mb-8 border-2 border-[#F2B134]">
            <!-- Wax watermark overlay -->
            <div class="absolute inset-0 opacity-10 bg-[url('./assets/wax-pattern.svg')] bg-repeat pointer-events-none"></div>
            
            <!-- Metallic Sheen Flare -->
            <div class="golden-shimmer absolute inset-0 pointer-events-none"></div>

            <!-- Perforated notches on sides -->
            <div class="ticket-notch ticket-notch-left"></div>
            <div class="ticket-notch ticket-notch-right"></div>

            <!-- Ticket Header -->
            <div class="flex items-center justify-between pb-4 border-b border-[#0E0E0E]/20 relative z-10">
              <div class="flex items-center gap-2">
                <span class="w-3.5 h-3.5 rounded-full bg-[#0B3D2E]"></span>
                <span class="font-black text-[#0E0E0E] text-lg font-heading tracking-tight">DERBY2PARTY</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-[#0B3D2E] text-[#FAF6EE] text-[11px] font-bold uppercase tracking-wider">
                Pass Officiel Supporter
              </span>
            </div>

            <!-- Match Clash Info -->
            <div class="py-5 relative z-10">
              <span class="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider block mb-1">
                ${t.match.competitionLabel || 'Grand Match Africain'}
              </span>
              <h4 class="text-2xl sm:text-3xl font-black text-[#0E0E0E] font-heading leading-tight mb-2">
                ${t.match.title}
              </h4>
              <p class="text-xs sm:text-sm text-[#0E0E0E]/80 font-semibold">
                ${t.match.formattedDate} • Coup d'envoi à ${t.match.time} (Portes ouvertes dès ${t.match.doorsOpen || '19:00'})
              </p>
            </div>

            <!-- Ticket Details Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-[#0E0E0E]/20 text-[#0E0E0E] relative z-10 text-xs">
              <div>
                <span class="block opacity-70 text-[10px] uppercase font-bold">Titulaire</span>
                <span class="font-bold text-sm text-[#0E0E0E] truncate block">${t.customer.firstName} ${t.customer.lastName}</span>
              </div>
              <div>
                <span class="block opacity-70 text-[10px] uppercase font-bold">Places</span>
                <span class="font-bold text-sm text-[#0E0E0E]">${t.quantity} personne(s)</span>
              </div>
              <div>
                <span class="block opacity-70 text-[10px] uppercase font-bold">Lieu</span>
                <span class="font-bold text-sm text-[#0E0E0E] truncate block">${t.match.location}</span>
              </div>
              <div>
                <span class="block opacity-70 text-[10px] uppercase font-bold">Réf. Billet</span>
                <span class="font-mono font-black text-sm text-[#0B3D2E]">${t.reference}</span>
              </div>
            </div>

            <!-- QR Code and Perks -->
            <div class="pt-5 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div class="space-y-1.5 text-xs text-[#0E0E0E]/80 text-left w-full sm:w-auto">
                <p class="flex items-center gap-1.5 font-bold text-[#0B3D2E]">
                  <svg class="w-4 h-4 text-[#0B3D2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ${t.quantity} boisson(s) offerte(s) au bar
                </p>
                ${t.hasAllocoPack ? `
                  <p class="flex items-center gap-1.5 font-bold text-[#D6402B]">
                    <svg class="w-4 h-4 text-[#D6402B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Box Street Food incluse (Alloco & Pastels)
                  </p>
                ` : ''}
                <p class="text-[11px] opacity-75 pt-1">
                  Présentez ce QR Code à l'accueil pour accéder à la salle et à votre table.
                </p>
              </div>

              <div class="p-2.5 bg-white rounded-2xl shadow-lg border border-[#0E0E0E]/10 shrink-0 text-center">
                ${this.renderQRCodeSVG(t.reference)}
                <span class="block font-mono font-bold text-[10px] text-gray-700 mt-1">${t.reference}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-4">
            <button 
              id="btn-download-ticket"
              type="button"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FAF6EE] text-[#0E0E0E] font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-lg cursor-pointer transform hover:scale-105"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Imprimer / Télécharger en PDF</span>
            </button>
            
            <button 
              id="btn-wallet"
              type="button"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-[#FAF6EE] border border-white/20 font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all shadow-lg cursor-pointer"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.76 1.05-1.82.93-2.88-.9.04-2.02.6-2.67 1.36-.57.65-1.07 1.73-.93 2.76 1.01.08 2.05-.48 2.67-1.24z"/></svg>
              <span>Ajouter à Apple Wallet</span>
            </button>

            <button 
              id="btn-reset-ticketing"
              type="button"
              class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0B3D2E] text-[#F2B134] border border-[#F2B134]/30 font-bold text-xs uppercase tracking-wider hover:bg-[#0B3D2E]/80 transition-all cursor-pointer"
            >
              <span>Réserver d'autres places</span>
            </button>
          </div>
        </div>
      `;
    }

    container.innerHTML = stepperHeader + stepHtml;
  }

  bindEvents() {
    const container = document.getElementById('billetterie-container');
    if (!container) return;

    container.addEventListener('click', (e) => {
      // Direct Step Indicator navigation
      const stepIndicator = e.target.closest('[data-goto-step]');
      if (stepIndicator) {
        const targetStep = parseInt(stepIndicator.getAttribute('data-goto-step'), 10);
        if (targetStep <= 3) {
          this.goToStep(targetStep);
          return;
        }
      }

      // Quick Fill Demo Button
      if (e.target.closest('#btn-quick-fill-demo')) {
        this.fillDemoData();
        return;
      }

      // Step 1 Match Selection (Direct click selects and advances to Step 2!)
      const matchCard = e.target.closest('[data-select-match]');
      if (matchCard) {
        const id = matchCard.getAttribute('data-select-match');
        this.selectMatch(id, true);
        return;
      }

      // Step 1 Button "Continuer avec ce match"
      if (e.target.closest('#btn-goto-step-2')) {
        this.goToStep(2);
        return;
      }

      // Step 2 Quantity buttons
      if (e.target.closest('#btn-qty-minus')) {
        this.setQuantity(this.quantity - 1);
        return;
      }
      if (e.target.closest('#btn-qty-plus')) {
        this.setQuantity(this.quantity + 1);
        return;
      }

      // Step 2 Change match
      if (e.target.closest('#btn-change-match')) {
        this.goToStep(1);
        return;
      }

      // Step 2 Go to Step 3
      if (e.target.closest('#btn-goto-step-3')) {
        this.goToStep(3);
        return;
      }

      // Step 2 Back to Step 1
      if (e.target.closest('#btn-back-step-1')) {
        this.goToStep(1);
        return;
      }

      // Step 3 Back to Step 2
      if (e.target.closest('#btn-back-step-2')) {
        this.goToStep(2);
        return;
      }

      // Step 4 Actions
      if (e.target.closest('#btn-download-ticket')) {
        window.print();
        return;
      }

      if (e.target.closest('#btn-wallet')) {
        alert("Billet ajouté avec succès à votre Apple Wallet (Simulation) ! Rendez-vous au match.");
        return;
      }

      if (e.target.closest('#btn-reset-ticketing')) {
        this.currentStep = 1;
        this.confirmedTicket = null;
        this.render();
        return;
      }
    });

    // Checkbox add-on food
    container.addEventListener('change', (e) => {
      if (e.target && e.target.id === 'addon-food') {
        this.hasAllocoPack = e.target.checked;
        this.render();
      }
    });

    // Form submission (Coordonnées & Paiement Simulé)
    container.addEventListener('submit', (e) => {
      if (e.target && e.target.id === 'checkout-form') {
        e.preventDefault();
        
        const firstNameInput = document.getElementById('cust-first-name');
        const lastNameInput = document.getElementById('cust-last-name');
        const emailInput = document.getElementById('cust-email');
        const phoneInput = document.getElementById('cust-phone');

        // Smart defaults if empty so ticket booking is ALWAYS feasible and never gets blocked
        const firstName = (firstNameInput && firstNameInput.value.trim()) || 'Supporter';
        const lastName = (lastNameInput && lastNameInput.value.trim()) || 'Derby2party';
        const email = (emailInput && emailInput.value.trim()) || 'billet@derby2party.fr';
        const phone = (phoneInput && phoneInput.value.trim()) || '06 12 34 56 78';

        this.customer = { firstName, lastName, email, phone };

        const submitBtn = document.getElementById('btn-submit-order');
        if (submitBtn) {
          submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0E0E0E]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Création de votre Billet Doré...</span>
          `;
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          this.confirmedTicket = {
            reference: this.generateTicketReference(),
            match: this.getSelectedMatch(),
            quantity: this.quantity,
            customer: { ...this.customer },
            hasAllocoPack: this.hasAllocoPack,
            total: this.calculateTotal().total,
            dateBooked: new Date().toISOString()
          };

          // Save in localStorage for persistence
          try {
            localStorage.setItem('derby2party_ticket', JSON.stringify(this.confirmedTicket));
          } catch (err) {}

          this.currentStep = 4;
          this.render();

          if (this.onTicketConfirmed) {
            this.onTicketConfirmed(this.confirmedTicket);
          }
        }, 600);
      }
    });
  }
}
