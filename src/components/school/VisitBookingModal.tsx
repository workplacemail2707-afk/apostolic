import { useState, type FormEvent } from 'react';
import { CheckCircle2, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input, Label, Textarea } from '@/src/components/ui/forms';

interface VisitBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitBookingModal({ open, onOpenChange }: VisitBookingModalProps) {
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [studentGrade, setStudentGrade] = useState('Grade 10 Boarding');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('10:00 AM – 11:30 AM');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setParentName('');
    setPhone('');
    setEmail('');
    setStudentGrade('Grade 10 Boarding');
    setPreferredDate('');
    setPreferredSlot('10:00 AM – 11:30 AM');
    setNotes('');
    setError('');
    setSubmitted(false);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(resetForm, 150);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (parentName.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (phone.trim().length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!preferredDate) {
      setError('Please choose a preferred date for your visit.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName,
          phone,
          email,
          studentGrade,
          preferredDate,
          preferredSlot,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not submit visit request.');
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Network error while booking your visit. Please try again or call +254 728 502 547.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        {submitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cream)] text-[var(--plum)]">
              <CheckCircle2 className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <DialogHeader className="items-center text-center pr-0">
              <DialogTitle>School Visit Request Confirmed</DialogTitle>
              <DialogDescription className="mt-2 max-w-sm">
                Thank you, {parentName}. Our Admissions Office has logged your request for{' '}
                <span className="font-medium text-[var(--brown)]">{preferredDate}</span> ({preferredSlot}) and will call{' '}
                <span className="font-medium text-[var(--brown)]">{phone}</span> shortly.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex justify-center">
              <Button variant="primary" onClick={() => handleClose(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mb-1 flex items-center gap-2 text-[13px] font-medium text-[var(--orange)]">
                <Calendar className="h-4 w-4" strokeWidth={1.5} />
                <span>Buru Buru Phase V Campus Tour</span>
              </div>
              <DialogTitle>Book a School Visit</DialogTitle>
              <DialogDescription>
                Meet our Sisters and faculty, tour our classrooms, labs, and boarding wing, and discuss Grade 10 placement.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-[12px] border border-[#F04438]/30 bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]"
                >
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="visit-name">Parent / Guardian Name</Label>
                <Input
                  id="visit-name"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Grace Wanjiku"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="visit-phone">Mobile Phone</Label>
                  <Input
                    id="visit-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
                <div>
                  <Label htmlFor="visit-email">Email Address</Label>
                  <Input
                    id="visit-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.co.ke"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="visit-grade">Programme of Interest</Label>
                  <select
                    id="visit-grade"
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="flex h-11 w-full rounded-[12px] border border-[var(--line)] bg-white px-3.5 text-[15px] text-[var(--brown)] focus-visible:border-[var(--plum)] focus-visible:outline-2 focus-visible:outline-[var(--plum)]/25"
                  >
                    <option value="Grade 10 Boarding">Grade 10 Boarding</option>
                    <option value="Grade 10 Day Scholar">Grade 10 Day Scholar</option>
                    <option value="Senior Transfer Enquiry">Senior School Transfer</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="visit-date">Preferred Date</Label>
                  <Input
                    id="visit-date"
                    type="date"
                    required
                    min={new Date().toISOString().slice(0, 10)}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="visit-slot">Preferred Time Window</Label>
                <select
                  id="visit-slot"
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="flex h-11 w-full rounded-[12px] border border-[var(--line)] bg-white px-3.5 text-[15px] text-[var(--brown)] focus-visible:border-[var(--plum)] focus-visible:outline-2 focus-visible:outline-[var(--plum)]/25"
                >
                  <option value="8:30 AM – 10:00 AM">Morning: 8:30 AM – 10:00 AM</option>
                  <option value="10:00 AM – 11:30 AM">Mid-Morning: 10:00 AM – 11:30 AM</option>
                  <option value="2:00 PM – 3:30 PM">Afternoon: 2:00 PM – 3:30 PM</option>
                </select>
              </div>

              <div>
                <Label htmlFor="visit-notes">Questions or Notes (Optional)</Label>
                <Textarea
                  id="visit-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share any questions regarding boarding, pathways, or transport."
                  className="min-h-[84px]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => handleClose(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="accent" disabled={submitting}>
                  {submitting ? 'Sending Request…' : 'Confirm Visit Request'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
