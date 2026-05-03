export function whatsappLink(phone: string | undefined, text?: string): string | null {
  if (!phone) return null;
  const clean = phone.replace(/\D/g, '');
  const msg = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${clean}${msg}`;
}

export function telLink(phone: string | undefined): string | null {
  if (!phone) return null;
  return `tel:${phone.replace(/\s+/g, '')}`;
}

export function mailLink(email: string | undefined, subject?: string): string | null {
  if (!email) return null;
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  return `mailto:${email}${params}`;
}

export const priceUnitLabels: Record<string, string> = {
  per_night: 'noć',
  per_person: 'osoba',
  per_day: 'dan',
  per_meal: 'obrok',
  fixed: '',
};

export function formatPrice(amount: number | undefined, unit?: string): string {
  if (amount === undefined) return '';
  const unitLabel = unit ? priceUnitLabels[unit] : '';
  return unitLabel ? `${amount}€ / ${unitLabel}` : `${amount}€`;
}

/** Extract YouTube video ID from common URL forms (watch?v=, youtu.be/, /shorts/, /embed/). */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null;
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = u.searchParams.get('v');
      if (v) return v;
      const m = u.pathname.match(/^\/(?:embed|shorts|v)\/([^/]+)/);
      if (m) return m[1];
    }
  } catch {
    /* invalid URL */
  }
  return null;
}

export function osmEmbedUrl(lat: number, lng: number, zoom = 15): string {
  const delta = 0.012;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}
