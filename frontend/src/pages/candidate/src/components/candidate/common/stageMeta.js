export const PIPELINE_STAGES = ['applied', 'screened', 'interview', 'offer'];

export const STAGE_META = {
  applied: { label: 'Applied', badgeClass: 'cp-badge-neutral' },
  screened: { label: 'Screened', badgeClass: 'cp-badge-aura' },
  interview: { label: 'Interview', badgeClass: 'cp-badge-flag' },
  offer: { label: 'Offer', badgeClass: 'cp-badge-signal' },
  rejected: { label: 'Not moving forward', badgeClass: 'cp-badge-danger' },
};

export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatSalary(min, max, currency) {
  const fmt = (n) => new Intl.NumberFormat('en-US').format(n);
  return `${currency} ${fmt(min)} – ${fmt(max)}`;
}
