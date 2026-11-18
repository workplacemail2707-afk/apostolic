import { useEffect } from 'react';
import { SCHOOL_INFO } from '@/src/lib/utils';

interface SeoHeadProps {
  title: string;
  description: string;
  path?: string;
}

export function SeoHead({ title, description, path = '/' }: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes('Apostolic Carmel')
      ? title
      : `${title} – ${SCHOOL_INFO.shortName} Girls' Secondary School`;
    document.title = fullTitle;

    const setMeta = (selector: string, attrName: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    const origin = window.location.origin;
    const canonicalHref = `${origin}${path}`;
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalHref);

    let ldScript = document.getElementById('school-jsonld') as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'school-jsonld';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    ldScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'School',
      name: SCHOOL_INFO.name,
      alternateName: 'Apostolic Carmel Buru Buru',
      slogan: SCHOOL_INFO.tagline,
      url: origin,
      telephone: '+254728502547',
      email: SCHOOL_INFO.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Katulo Road, Buru Buru Phase V, next to Blessed Sacrament Church',
        postOfficeBoxNumber: 'P.O. Box 1344-00515',
        addressLocality: 'Nairobi',
        addressCountry: 'KE',
      },
      foundingDate: '2008',
    });
  }, [title, description, path]);

  return null;
}
