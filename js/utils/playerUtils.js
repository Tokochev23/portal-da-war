export function formatPlayerName(player) {
  if (!player) return 'Jogador';
  if (typeof player === 'string') {
    return player.length > 10 ? `${player.slice(0, 10)}…` : player;
  }
  if (player.nome) return player.nome;
  if (player.displayName) return player.displayName;
  if (player.email) return player.email.split('@')[0];
  return String(player.id || 'Jogador');
}
