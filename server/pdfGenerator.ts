import fs from 'node:fs';
import path from 'node:path';

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' ');
}

export function buildSimplePdfBuffer(title: string, subtitle: string, lines: string[]): Buffer {
  const commands: string[] = [];
  commands.push('BT');
  commands.push('/F2 18 Tf');
  commands.push('54 748 Td');
  commands.push(`(${escapePdfText(title)}) Tj`);
  commands.push('/F1 11 Tf');
  commands.push('0 -22 Td');
  commands.push(`(${escapePdfText(subtitle)}) Tj`);
  commands.push('0 -26 Td');

  let yOffset = 700;
  for (const rawLine of lines) {
    if (yOffset < 64) break;
    const isHeading = rawLine.startsWith('## ');
    if (isHeading) {
      commands.push('/F2 12 Tf');
      commands.push('0 -20 Td');
      commands.push(`(${escapePdfText(rawLine.slice(3))}) Tj`);
      commands.push('/F1 10 Tf');
      yOffset -= 20;
    } else if (rawLine.trim() === '') {
      commands.push('0 -10 Td');
      yOffset -= 10;
    } else {
      commands.push('/F1 10 Tf');
      commands.push('0 -15 Td');
      commands.push(`(${escapePdfText(rawLine)}) Tj`);
      yOffset -= 15;
    }
  }
  commands.push('ET');

  const streamContent = commands.join('\n');
  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    `6 0 obj\n<< /Length ${Buffer.byteLength(streamContent, 'utf8')} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += obj;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

export function ensureSeedPdfs(docsDir: string): void {
  fs.mkdirSync(docsDir, { recursive: true });

  const files: Array<{ filename: string; title: string; subtitle: string; lines: string[] }> = [
    {
      filename: 'grade-10-application-form.pdf',
      title: "APOSTOLIC CARMEL GIRLS' SECONDARY SCHOOL",
      subtitle: 'Grade 10 & Senior School Admissions Application Form · Buru Buru Phase V, Nairobi',
      lines: [
        'Motto: Seeking the Heights  |  P.O. Box 1344-00515 Nairobi  |  Tel: +254 728 502 547',
        '',
        '## SECTION A: STUDENT DETAILS',
        'Full Name (as on Birth Certificate): ___________________________________________',
        'Date of Birth: ____ / ____ / ________     NEMIS / Assessment Number: ______________',
        'Current Junior School: _______________________________________________________',
        'Preferred Programme:  [ ] Day Scholar     [ ] Boarding Scholar',
        'Preferred CBE Pathway: [ ] STEM   [ ] Social Sciences   [ ] Arts & Sports Science',
        '',
        '## SECTION B: PARENT / GUARDIAN DETAILS',
        'Parent / Guardian Full Name: _________________________________________________',
        'Relationship: ___________________   Mobile Phone: ____________________________',
        'Email Address: ______________________________________________________________',
        'Residential Estate / Town: ____________________________________________________',
        '',
        '## SECTION C: REQUIRED ATTACHMENTS & REGISTRATION FEE',
        '1. Copy of student Birth Certificate and recent passport-size photograph.',
        '2. Junior School Assessment / Grade 9 progress report and school leaving certificate.',
        '3. Baptismal card (for Catholic applicants; students of all faiths are welcome).',
        '4. Non-refundable registration & interview fee: Ksh 2,500 (payable at the Accounts Office).',
        '',
        '## DECLARATION',
        'I confirm that the information provided above is accurate and agree to uphold the values,',
        'discipline, and ethos of Apostolic Carmel Girls Secondary School.',
        'Parent Signature: _______________________________   Date: ____ / ____ / ________',
      ],
    },
    {
      filename: 'carmel-echo-term-3-2026.pdf',
      title: 'THE CARMEL ECHO – TERMLY NEWSLETTER',
      subtitle: "Term III, 2026 Edition · Apostolic Carmel Girls' Secondary School, Nairobi",
      lines: [
        'Published by the Office of the Principal, Sr. Joanita AC · Buru Buru Phase V',
        '',
        '## PRINCIPAL’S MESSAGE',
        'Dear Parents and Guardians, we give thanks for a blessed and industrious Term III.',
        'Our learners demonstrated remarkable diligence in academic symposia, liturgy, and',
        'community outreach across Buru Buru and Nairobi Archdiocese.',
        '',
        '## GRADE 10 ADMISSIONS & CBE PATHWAY READINESS',
        'Preparations for our incoming Grade 10 cohort are complete across our science',
        'laboratories, humanities resource rooms, and ICT e-learning studio.',
        '',
        '## KEY DATES FOR TERM I, 2027',
        '- Boarders Reporting Day: Monday, 4 January 2027 (8:00 AM - 4:00 PM)',
        '- Day Scholars Opening Assembly: Tuesday, 5 January 2027 (7:30 AM)',
        '- Opening School Mass: Friday, 8 January 2027 at Blessed Sacrament Church',
        '- Mid-Term Prayer & Academic Clinic: Friday, 19 February 2027',
        '',
        'Contact: info@apostoliccarmel.ac.ke  |  +254 728 502 547  |  Katulo Road, Buru Buru V',
      ],
    },
    {
      filename: 'carmel-heights-magazine-2026.pdf',
      title: 'SEEKING THE HEIGHTS – ANNUAL MAGAZINE',
      subtitle: '2026 Annual Chronicle · Faith, Scholarship, Leadership & Service',
      lines: [
        "Apostolic Carmel Girls' Secondary School · Catholic Archdiocese of Nairobi",
        '',
        '## CELEBRATING OUR HERITAGE',
        'Rooted in the congregation founded in Bayonne, France in 1868 by Mother Veronica',
        'of the Passion and established in East Africa in 1991, our Buru Buru Phase V',
        'convent school continues to nurture confident, compassionate young women.',
        '',
        '## HIGHLIGHTS OF THE YEAR',
        '- National Kenya Music Festival: Regional finalists in Sacred Choral Verse & Folk Song.',
        '- Science & Innovation Congress: Distinction in Environmental Eco-Conservation.',
        '- Boarding Life: Renovated study halls and weekend mentorship circles since 2008.',
        '- Social Concern: Annual Lenten outreach supporting neighbouring parish families.',
        '',
        'All inquiries: P.O. Box 1344-00515 Nairobi | info@apostoliccarmel.ac.ke',
      ],
    },
    {
      filename: 'carmel-echo-term-2-2026.pdf',
      title: 'THE CARMEL ECHO – TERM II NEWSLETTER',
      subtitle: "Term II, 2026 Edition · Apostolic Carmel Girls' Secondary School, Nairobi",
      lines: [
        'Academic Milestones, Co-Curricular Highlights & Parent Calendar',
        '',
        '## ACADEMIC & CO-CURRICULAR REPORT',
        'Congratulations to our debate society and netball teams for representing the school',
        'with integrity during the Nairobi County Championships.',
        '',
        '## GUIDANCE & COUNSELLING NOTES',
        'Termly parent-daughter mentorship sessions focused on digital wellness, emotional',
        'resilience, and career pathway discernment.',
      ],
    },
  ];

  for (const item of files) {
    const target = path.join(docsDir, item.filename);
    if (!fs.existsSync(target)) {
      fs.writeFileSync(target, buildSimplePdfBuffer(item.title, item.subtitle, item.lines));
    }
  }
}
