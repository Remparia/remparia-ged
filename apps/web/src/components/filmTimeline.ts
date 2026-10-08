const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Finish the film before releasing the sticky scene, leaving a final visual beat. */
export function getFilmProgress(sectionTop: number, sectionHeight: number, stageHeight: number, stickyTop: number) {
  const distance = sectionHeight - stageHeight;
  if (!Number.isFinite(distance) || distance <= 0 || !Number.isFinite(sectionTop)) return 0;
  return clamp((stickyTop - sectionTop) / distance / 0.92);
}

export function getFilmTime(progress: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(progress)) return 0;
  return clamp(progress) * Math.max(0, duration - 0.04);
}
