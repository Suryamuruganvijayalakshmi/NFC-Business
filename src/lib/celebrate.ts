import confetti from 'canvas-confetti';

/**
 * Fires a subtle burst of mini confetti papers right at the clicked button
 * (or center-top fallback) for likes, reactions, follows, and connection requests.
 * Respects prefers-reduced-motion.
 */
export function popMiniPapers(e?: React.MouseEvent<HTMLElement>) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  let origin = { x: 0.5, y: 0.5 };
  if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number' && (e.clientX > 0 || e.clientY > 0)) {
    origin = {
      x: Math.min(0.95, Math.max(0.05, e.clientX / window.innerWidth)),
      y: Math.min(0.95, Math.max(0.05, e.clientY / window.innerHeight)),
    };
  }

  try {
    confetti({
      particleCount: 18,
      spread: 50,
      startVelocity: 20,
      gravity: 0.9,
      scalar: 0.65,
      ticks: 55,
      origin,
      colors: ['#6969F5', '#A78BFA', '#F472B6', '#38BDF8', '#FBBF24'],
      disableForReducedMotion: true,
    });
  } catch {
    // Ignore canvas errors in headless environments
  }
}
