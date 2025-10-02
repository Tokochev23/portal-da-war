/**
 * Tab System Utility
 * Manages tab navigation and panel switching
 */

export function initTabSystem() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (!tabButtons.length || !tabPanels.length) {
    return; // No tabs on this page
  }

  function switchTab(targetTab) {
    // Remove active states
    tabButtons.forEach(btn => {
      btn.classList.remove('border-brand-500', 'text-brand-300');
      btn.classList.add('border-transparent', 'text-slate-400');
      btn.setAttribute('aria-selected', 'false');
    });

    // Hide all panels
    tabPanels.forEach(panel => {
      panel.classList.add('hidden');
    });

    // Activate target tab
    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    const targetPanel = document.getElementById(`panel-${targetTab}`);

    if (targetButton && targetPanel) {
      targetButton.classList.remove('border-transparent', 'text-slate-400');
      targetButton.classList.add('border-brand-500', 'text-brand-300');
      targetButton.setAttribute('aria-selected', 'true');

      targetPanel.classList.remove('hidden');
    }

    // Trigger updates when switching to specific tabs
    if (targetTab === 'players') {
      // Refresh players data when switching to players tab
      setTimeout(() => {
        if (window.playerManager) {
          window.playerManager.loadPlayers();
          window.playerManager.loadCountries();
        }
      }, 100);
    } else if (targetTab === 'gameplay') {
      // Update stats when switching to gameplay
      setTimeout(() => {
        if (window.updateQuickStats) {
          window.updateQuickStats();
        }
      }, 100);
    }
  }

  // Add click event listeners
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tab = button.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Initialize with gameplay tab active (or first tab)
  const firstTab = tabButtons[0]?.getAttribute('data-tab');
  if (firstTab) {
    switchTab(firstTab);
  }

  // Global function to update tab badges from external scripts
  window.updateTabBadges = function(badgeData) {
    const gameplayBadge = document.getElementById('gameplay-badge');
    const playersBadge = document.getElementById('players-badge');

    if (gameplayBadge && badgeData?.vehiclesPending > 0) {
      gameplayBadge.textContent = badgeData.vehiclesPending;
      gameplayBadge.classList.remove('hidden');
    } else if (gameplayBadge) {
      gameplayBadge.classList.add('hidden');
    }

    if (playersBadge && badgeData?.playersOnline > 0) {
      playersBadge.textContent = badgeData.playersOnline;
      playersBadge.classList.remove('hidden');
    } else if (playersBadge) {
      playersBadge.classList.add('hidden');
    }
  };

  // Make tab switching globally available
  window.switchTab = switchTab;
}
