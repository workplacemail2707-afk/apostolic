import { useState, type FormEvent } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, MessageCircle } from 'lucide-react';
import { SeoHead } from '@/src/components/SeoHead';
import { Hero } from '@/src/components/school/Primitives';
import { Section } from '@/src/components/school/Section';
import { Button } from '@/src/components/ui/button';
import { Input, Label, Textarea } from '@/src/components/ui/forms';
import { MAP_DIRECTIONS_URL, MAP_EMBED_URL } from '@/src/data/schoolContent';
import { SCHOOL_INFO } from '@/src/lib/utils';

export function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Admissions & Placement');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('Please enter a valid Kenyan or international phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 8) {
      setError('Please write a brief message (at least 8 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not send enquiry.');
      } else {
        setSent(true);
      }
    } catch {
      setError('Network error sending your message. Please call us on +254 728 502 547.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Contact & Location"
        description="Contact Apostolic Carmel Girls' Secondary School at Katulo Road, Buru Buru Phase V, Nairobi. Phone, postal box, map directions, and parent enquiry form."
        path="/contact"
      />

      <Hero
        compact
        eyebrow="Get in Touch"
        title="Contact & Location"
        subtitle="We welcome parent calls, campus visits, and written enquiries from Monday to Friday."
      />

      <Section surface="white">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Contact Details */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[16px] border border-[var(--line)] bg-[var(--cream)] p-6 md:p-8">
              <h2 className="font-display text-[26px] leading-[34px] text-[var(--brown)]">
                School Office Details
              </h2>
              <dl className="mt-6 space-y-5 text-[15px]">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--plum)]" strokeWidth={1.5} />
                  <div>
                    <dt className="font-medium text-[var(--brown)]">Campus Address</dt>
                    <dd className="text-[#5C4639]">
                      {SCHOOL_INFO.addressLine}
                      <br />
                      {SCHOOL_INFO.poBox}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[var(--plum)]" strokeWidth={1.5} />
                  <div>
                    <dt className="font-medium text-[var(--brown)]">Telephone</dt>
                    <dd className="tabular-nums">
                      <a href={SCHOOL_INFO.phoneHref} className="text-[var(--plum)] hover:underline">
                        {SCHOOL_INFO.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[var(--plum)]" strokeWidth={1.5} />
                  <div>
                    <dt className="font-medium text-[var(--brown)]">Email</dt>
                    <dd>
                      <a href={`mailto:${SCHOOL_INFO.email}`} className="text-[var(--plum)] hover:underline">
                        {SCHOOL_INFO.email}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--plum)]" strokeWidth={1.5} />
                  <div>
                    <dt className="font-medium text-[var(--brown)]">Visiting Hours</dt>
                    <dd className="text-[#5C4639]">{SCHOOL_INFO.hours}</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--line)] pt-5">
                <a
                  href={SCHOOL_INFO.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--plum)] px-5 py-2 text-[14px] font-medium text-white hover:bg-[var(--plum-dark)] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                  <span>WhatsApp Office</span>
                </a>
                <a
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-2 text-[14px] font-medium text-[var(--brown)] hover:border-[var(--plum)] hover:text-[var(--plum)] transition-colors"
                >
                  <span>Directions</span>
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--cream)]">
              <iframe
                title="Apostolic Carmel Girls' Secondary School location map"
                src={MAP_EMBED_URL}
                loading="lazy"
                className="h-[280px] w-full border-0"
              />
            </div>
          </div>

          {/* Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[16px] border border-[var(--line)] bg-white p-6 md:p-8">
              {sent ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--plum)]">
                    <CheckCircle2 className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-display text-[28px] text-[var(--brown)]">
                    Message Received
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-[16px] leading-[26px] text-[#5C4639]">
                    Thank you, {name}. Your enquiry has been logged by our Buru Buru Phase V office. A member of our staff will respond shortly via phone or email.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => {
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                      setSent(false);
                    }}
                  >
                    Send Another Enquiry
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-[28px] leading-[36px] text-[var(--brown)]">
                    Send an Enquiry
                  </h2>
                  <p className="mt-2 text-[15px] text-[#5C4639]">
                    Questions regarding Grade 10 admissions, boarding, fee structures, or transfer vacancies.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
                    {error && (
                      <div
                        role="alert"
                        className="rounded-[12px] border border-[#F04438]/30 bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]"
                      >
                        {error}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="contact-name">Your Full Name</Label>
                        <Input
                          id="contact-name"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Grace Wanjiku Mwangi"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Phone Number</Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="contact-email">Email Address</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="parent@example.co.ke"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-subject">Topic</Label>
                        <select
                          id="contact-subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="flex h-11 w-full rounded-[12px] border border-[var(--line)] bg-white px-3.5 text-[15px] text-[var(--brown)] focus-visible:border-[var(--plum)] focus-visible:outline-2 focus-visible:outline-[var(--plum)]/25"
                        >
                          <option value="Admissions & Placement">Admissions & Placement</option>
                          <option value="School Fees & Accounts">School Fees & Accounts</option>
                          <option value="Boarding & Welfare">Boarding & Welfare</option>
                          <option value="General Enquiry">General Enquiry</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How may our office assist your family?"
                        className="min-h-[140px]"
                      />
                    </div>

                    <Button type="submit" variant="accent" size="lg" disabled={submitting}>
                      {submitting ? 'Sending Message…' : 'Send Message'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
