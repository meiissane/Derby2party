/**
 * Derby2party - Main Application Engine
 */

import confetti from './confetti.js';
import { CountdownTimer } from './countdown.js';
import { TicketingStepper } from './stepper.js';
import { setupSharing } from './share.js';

class App {
  constructor() {
    this.matchs = [];
    this.activeFilter = 'Tous';
    this.stepper = null;
    this.countdown = null;
  }

  async init() {
    await this.loadData();
    this.initNavbar();
    this.initHero();
    this.renderMatchs();
    this.initMatchFilters();
    this.initTicketing();
    this.initExperienceSection();
    setupSharing();
    this.initScrollAnimations();

    // Welcome celebration confetti burst
    setTimeout(() => {
      confetti.burst({
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.25,
        count: 65,
        spread: 90
      });
    }, 600);
  }

  async loadData() {
    try {
      const res = await fetch('./src/data/matchs.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      this.matchs = await res.json();
    } catch (e) {
      console.warn('Fallback to embedded match data:', e);
      // Fallback in case of local file protocol or offline
      this.matchs = [
        {
          id: "civ-sen-2026",
          competition: "CAN",
          competitionLabel: "Coupe d'Afrique des Nations",
          title: "Côte d'Ivoire vs Sénégal",
          subtitle: "Le Choc des Éléphants & des Lions de la Teranga",
          date: "2026-11-14",
          formattedDate: "Samedi 14 Novembre 2026",
          time: "20:45",
          doorsOpen: "19:00",
          location: "Le Ground Control, Paris 12e",
          address: "81 Rue du Charolais, 75012 Paris",
          metro: "Gare de Lyon / Montgallet",
          price: 18,
          remainingSeats: 38,
          totalSeats: 280,
          status: "Dernières places",
          isFeatured: true,
          teams: {
            home: { name: "Côte d'Ivoire", code: "CIV", nickname: "Les Éléphants", colors: ["#F77F00", "#FFFFFF", "#009E60"], accent: "#F77F00" },
            away: { name: "Sénégal", code: "SEN", nickname: "Les Lions de la Teranga", colors: ["#00853F", "#FDEF42", "#E31B23"], accent: "#00853F" }
          },
          perks: ["Écran géant LED 14m² 4K", "DJ Set Amapiano & Coupé Décalé dès 19h", "Alloco, Pastels & Bissap artisanal", "1 boisson offerte par entrée"]
        },
        {
          id: "mar-alg-2026",
          competition: "Derby",
          competitionLabel: "Grand Derby d'Afrique du Nord",
          title: "Maroc vs Algérie",
          subtitle: "La Fièvre du Maghreb en direct",
          date: "2026-11-20",
          formattedDate: "Vendredi 20 Novembre 2026",
          time: "21:00",
          doorsOpen: "19:15",
          location: "La Bellevilloise, Paris 20e",
          address: "19-21 Rue Boyer, 75020 Paris",
          metro: "Ménilmontant / Gambetta",
          price: 20,
          remainingSeats: 19,
          totalSeats: 300,
          status: "Très forte demande",
          isFeatured: false,
          teams: {
            home: { name: "Maroc", code: "MAR", nickname: "Les Lions de l'Atlas", colors: ["#C1272D", "#006233"], accent: "#C1272D" },
            away: { name: "Algérie", code: "ALG", nickname: "Les Fennecs", colors: ["#006633", "#FFFFFF", "#D21034"], accent: "#006633" }
          },
          perks: ["Système son immersif stade 360°", "DJ Set Raï & Bass Music", "Thé à la menthe & Msemens chauds", "Écharpe collector pour les 50 premiers"]
        },
        {
          id: "nga-cmr-2026",
          competition: "CAN",
          competitionLabel: "Coupe d'Afrique des Nations",
          title: "Nigeria vs Cameroun",
          subtitle: "Le Duel Historique des Super Eagles & Lions Indomptables",
          date: "2026-11-28",
          formattedDate: "Samedi 28 Novembre 2026",
          time: "18:00",
          doorsOpen: "16:30",
          location: "Le Hasard Ludique, Paris 18e",
          address: "128 Avenue de Saint-Ouen, 75018 Paris",
          metro: "Porte de Saint-Ouen",
          price: 18,
          remainingSeats: 62,
          totalSeats: 220,
          status: "Disponible",
          isFeatured: false,
          teams: {
            home: { name: "Nigeria", code: "NGA", nickname: "Super Eagles", colors: ["#008751", "#FFFFFF"], accent: "#008751" },
            away: { name: "Cameroun", code: "CMR", nickname: "Lions Indomptables", colors: ["#007A5E", "#CE1126", "#FCD116"], accent: "#CE1126" }
          },
          perks: ["Terrasse couverte & grande salle", "DJ Set Afrobeat & Makossa", "Jollof Rice & Beignets Haricots", "Ambiance tambours en live"]
        },
        {
          id: "cgo-mli-2026",
          competition: "Qualifs",
          competitionLabel: "Qualifications Coupe du Monde",
          title: "RD Congo vs Mali",
          subtitle: "Choc décisif pour la qualification mondiale",
          date: "2026-12-06",
          formattedDate: "Dimanche 6 Décembre 2026",
          time: "20:00",
          doorsOpen: "18:30",
          location: "Le Pavillon Sauvage, Montreuil",
          address: "45 Rue de Paris, 93100 Montreuil",
          metro: "Mairie de Montreuil",
          price: 16,
          remainingSeats: 84,
          totalSeats: 250,
          status: "Disponible",
          isFeatured: false,
          teams: {
            home: { name: "RD Congo", code: "RDC", nickname: "Les Léopards", colors: ["#007FFF", "#FCD116", "#CE1126"], accent: "#007FFF" },
            away: { name: "Mali", code: "MLI", nickname: "Les Aigles", colors: ["#14B53A", "#FCD116", "#CE1126"], accent: "#14B53A" }
          },
          perks: ["Double projection intérieure", "Rumba Congolaise & Afro-House", "Brochettes Suya & Alloco", "Pack groupe avantageux"]
        },
        {
          id: "egy-gha-2026",
          competition: "Derby",
          competitionLabel: "Le Classique d'Afrique",
          title: "Égypte vs Ghana",
          subtitle: "Les Pharaons face aux Black Stars",
          date: "2026-12-19",
          formattedDate: "Samedi 19 Décembre 2026",
          time: "21:00",
          doorsOpen: "19:00",
          location: "Les Docks de Paris, Aubervilliers",
          address: "50 Avenue du Président Wilson, 93210 La Plaine Saint-Denis",
          metro: "Front Populaire",
          price: 22,
          remainingSeats: 115,
          totalSeats: 350,
          status: "Disponible",
          isFeatured: false,
          teams: {
            home: { name: "Égypte", code: "EGY", nickname: "Les Pharaons", colors: ["#C8102E", "#FFFFFF", "#000000"], accent: "#C8102E" },
            away: { name: "Ghana", code: "GHA", nickname: "Black Stars", colors: ["#EF3340", "#FFD100", "#009739"], accent: "#FFD100" }
          },
          perks: ["Écran XXL 20m²", "DJ Battle Afro-Pop vs Electro Chaâbi", "Street Food panafricaine", "Tirage au sort maillots officiels"]
        }
      ];
    }
  }

  initNavbar() {
    const navbar = document.getElementById('main-navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    });

    // Smooth scroll for all billetterie anchor links
    document.querySelectorAll('a[href="#billetterie"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = document.getElementById('billetterie');
        if (section) {
          const topOffset = section.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }
      });
    });

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        if (isOpen) {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        } else {
          mobileMenu.classList.remove('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
      });

      // Close mobile menu on item click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  initHero() {
    // Hero CTA button triggers confetti and smooth scrolls
    const heroCta = document.getElementById('hero-cta-btn');
    if (heroCta) {
      heroCta.addEventListener('click', (e) => {
        const rect = heroCta.getBoundingClientRect();
        confetti.burst({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          count: 50,
          spread: 80
        });
      });
    }

    // Launch Countdown with earliest match
    if (this.matchs.length > 0) {
      const nextMatch = this.matchs[0];
      const matchDate = `${nextMatch.date}T${nextMatch.time}:00`;
      this.countdown = new CountdownTimer(matchDate, '#hero-countdown');
      this.countdown.start();

      const heroMatchLabel = document.getElementById('hero-next-match-label');
      if (heroMatchLabel) {
        heroMatchLabel.textContent = `Prochain choc : ${nextMatch.title} • ${nextMatch.formattedDate}`;
      }
    }
  }

  initMatchFilters() {
    const filterButtons = document.querySelectorAll('.match-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('bg-[#F2B134]', 'text-[#0E0E0E]', 'active-filter');
          b.classList.add('bg-white/5', 'text-[#FAF6EE]/80');
        });

        btn.classList.add('bg-[#F2B134]', 'text-[#0E0E0E]', 'active-filter');
        btn.classList.remove('bg-white/5', 'text-[#FAF6EE]/80');

        this.activeFilter = btn.getAttribute('data-filter');
        this.renderMatchs();
      });
    });
  }

  renderMatchs() {
    const container = document.getElementById('matchs-grid');
    if (!container) return;

    const filtered = this.activeFilter === 'Tous'
      ? this.matchs
      : this.matchs.filter(m => m.competition.toLowerCase().includes(this.activeFilter.toLowerCase()) || m.competition === this.activeFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center text-[#FAF6EE]/60">
          Aucun match dans cette catégorie pour le moment.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(m => {
      const percentRemaining = Math.round((m.remainingSeats / m.totalSeats) * 100);
      const isLow = m.remainingSeats <= 40;

      return `
        <article class="match-card bg-[#0E0E0E]/80 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col justify-between transition-all duration-300 hover:border-[#F2B134]/50 hover:shadow-xl hover:shadow-[#F2B134]/10 group">
          <!-- Card Header: Competition + Remaining alert -->
          <div class="flex items-center justify-between gap-2 mb-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              m.competition === 'CAN' ? 'bg-[#0B3D2E] text-[#F2B134] border border-[#F2B134]/30' :
              m.competition === 'Derby' ? 'bg-[#D6402B]/20 text-[#D6402B] border border-[#D6402B]/40' :
              'bg-white/10 text-[#FAF6EE]'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${m.competition === 'Derby' ? 'bg-[#D6402B]' : 'bg-[#F2B134]'}"></span>
              ${m.competitionLabel}
            </span>
            <span class="text-xs font-bold text-[#F2B134]">${m.price}€ / pers.</span>
          </div>

          <!-- Teams Clash Header -->
          <div class="my-3">
            <div class="flex items-center justify-between gap-2 sm:gap-3 mb-2">
              <div class="flex-1 text-left min-w-0">
                <span class="text-[11px] text-[#FAF6EE]/60 block font-semibold uppercase tracking-wider">${m.teams.home.code}</span>
                <h4 class="text-base sm:text-xl font-black text-[#FAF6EE] font-heading tracking-tight leading-snug break-words">${m.teams.home.name}</h4>
              </div>

              <!-- Animated Pulse Soccer Ball Metaphor -->
              <div class="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0B3D2E] border border-[#F2B134]/40 flex items-center justify-center p-1.5 shadow-md shadow-[#F2B134]/20 group-hover:scale-110 transition-transform">
                <img src="./assets/icons/ball-pulse.svg" alt="Ballon cœur battant" class="w-full h-full object-contain">
              </div>

              <div class="flex-1 text-right min-w-0">
                <span class="text-[11px] text-[#FAF6EE]/60 block font-semibold uppercase tracking-wider">${m.teams.away.code}</span>
                <h4 class="text-base sm:text-xl font-black text-[#FAF6EE] font-heading tracking-tight leading-snug break-words">${m.teams.away.name}</h4>
              </div>
            </div>
            
            <p class="text-xs text-[#FAF6EE]/70 italic text-center mb-4">"${m.subtitle}"</p>
          </div>

          <!-- Date & Venue info -->
          <div class="space-y-2 py-3 border-y border-white/10 text-xs text-[#FAF6EE]/80">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#F2B134] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="font-semibold text-[#FAF6EE]">${m.formattedDate}</span>
              <span class="text-[#FAF6EE]/50">• Coup d'envoi à ${m.time}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[#F2B134] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>${m.location}</span>
            </div>
          </div>

          <!-- Remaining places visual gauge -->
          <div class="my-4">
            <div class="flex justify-between text-xs mb-1.5 font-medium">
              <span class="${isLow ? 'text-[#D6402B] font-bold' : 'text-[#FAF6EE]/70'}">
                ${m.status} (${m.remainingSeats} places restantes)
              </span>
              <span class="text-[#FAF6EE]/50">${m.totalSeats - m.remainingSeats}/${m.totalSeats} réservées</span>
            </div>
            <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-500 ${isLow ? 'bg-[#D6402B]' : 'bg-[#F2B134]'}"
                style="width: ${100 - percentRemaining}%"
              ></div>
            </div>
          </div>

          <!-- Perks bullet list -->
          <ul class="text-[11px] text-[#FAF6EE]/70 space-y-1 mb-6">
            <li class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-[#F2B134]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              Écran géant HD & ambiance DJ live
            </li>
            <li class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-[#F2B134]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              1 consommation offerte à l'arrivée
            </li>
          </ul>

          <!-- CTA Button -->
          <button 
            class="btn-book-match w-full py-3 px-5 rounded-full bg-[#FAF6EE] text-[#0E0E0E] font-extrabold text-xs uppercase tracking-wider hover:bg-[#F2B134] transition-all transform group-hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
            data-match-id="${m.id}"
          >
            <span>Prendre un billet</span>
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </article>
      `;
    }).join('');

    // Attach click events to "Prendre un billet" buttons
    container.querySelectorAll('.btn-book-match').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const matchId = btn.getAttribute('data-match-id');
        if (this.stepper) {
          confetti.burst({ count: 25, spread: 60, velocity: 16 });
          this.stepper.selectMatch(matchId, true);
        }
      });
    });
  }

  initTicketing() {
    this.stepper = new TicketingStepper(this.matchs, (ticket) => {
      // Confetti rain on success
      confetti.rain(3200);
    });
  }

  initExperienceSection() {
    const video = document.getElementById('dj-ambiance-video') || document.getElementById('ambiance-video');
    const toggleBtn = document.getElementById('btn-dj-sound') || document.getElementById('btn-toggle-sound');
    const soundIcon = document.getElementById('dj-sound-icon') || document.getElementById('sound-icon');
    const soundLabel = document.getElementById('dj-sound-label') || document.getElementById('sound-label');

    // HD Modal Elements
    const expandBtn = document.getElementById('btn-expand-video');
    const modal = document.getElementById('video-hd-modal');
    const modalVideo = document.getElementById('modal-video');
    const closeModalBtn = document.getElementById('btn-close-modal');

    if (toggleBtn && video) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (video.muted) {
          video.muted = false;
          video.play();
          if (soundIcon) soundIcon.textContent = '🔇';
          if (soundLabel) soundLabel.textContent = 'Couper le son';
          toggleBtn.classList.remove('bg-black/85', 'text-[#F2B134]');
          toggleBtn.classList.add('bg-[#D6402B]', 'text-[#FAF6EE]');
          
          confetti.burst({
            count: 25,
            spread: 50,
            velocity: 15
          });
        } else {
          video.muted = true;
          if (soundIcon) soundIcon.textContent = '🔊';
          if (soundLabel) soundLabel.textContent = 'Activer le son';
          toggleBtn.classList.add('bg-black/85', 'text-[#F2B134]');
          toggleBtn.classList.remove('bg-[#D6402B]', 'text-[#FAF6EE]');
        }
      });
    }

    // Open HD Fullscreen Modal
    const openModal = () => {
      if (!modal || !modalVideo) return;
      modal.classList.remove('opacity-0', 'pointer-events-none');
      if (video) {
        modalVideo.currentTime = video.currentTime;
        video.pause();
      }
      modalVideo.muted = false;
      modalVideo.play().catch(() => {});
    };

    const closeModal = () => {
      if (!modal || !modalVideo) return;
      modal.classList.add('opacity-0', 'pointer-events-none');
      modalVideo.pause();
      if (video) {
        video.play().catch(() => {});
      }
    };

    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal();
      });
    }

    if (video) {
      video.addEventListener('click', () => {
        openModal();
      });
    }

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.classList.contains('pointer-events-none')) {
        closeModal();
      }
    });
  }

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
