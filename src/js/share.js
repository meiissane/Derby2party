/**
 * Sharing and Referral Module
 * 'Invite ta bande, la table est plus belle à plusieurs'
 */

export function setupSharing() {
  const copyBtn = document.getElementById('btn-copy-ref');
  const refInput = document.getElementById('ref-link-input');
  const toast = document.getElementById('share-toast');
  const whatsappBtn = document.getElementById('btn-whatsapp-share');

  const shareText = "Rejoins-moi pour la prochaine watch party Derby2party ! Écran géant, DJ set Amapiano et street food, notre table est prête : https://derby2party.com/?ref=BANDE2026";

  if (whatsappBtn) {
    whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  }

  if (copyBtn && refInput) {
    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(refInput.value);
        } else {
          refInput.select();
          document.execCommand('copy');
        }

        // Show toast
        if (toast) {
          toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
          toast.classList.add('opacity-100', 'translate-y-0');

          setTimeout(() => {
            toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
            toast.classList.remove('opacity-100', 'translate-y-0');
          }, 3000);
        }

        // Little celebratory spark
        if (window.confetti) {
          window.confetti.burst({
            count: 35,
            spread: 60,
            velocity: 20
          });
        }
      } catch (err) {
        console.error('Erreur de copie:', err);
      }
    });
  }

  // Native mobile share button if available
  const nativeShareBtn = document.getElementById('btn-native-share');
  if (nativeShareBtn) {
    if (navigator.share) {
      nativeShareBtn.style.display = 'inline-flex';
      nativeShareBtn.addEventListener('click', async () => {
        try {
          await navigator.share({
            title: 'Derby2party - Watch Parties Football Africain',
            text: shareText,
            url: refInput ? refInput.value : 'https://derby2party.com/?ref=BANDE2026'
          });
        } catch (err) {
          // User dismissed share dialog
        }
      });
    } else {
      nativeShareBtn.style.display = 'none';
    }
  }
}
