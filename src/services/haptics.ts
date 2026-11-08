export const triggerHaptic = (pattern: number | number[] = [40, 60, 40]) => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics not allowed or unsupported
    }
  }
};
