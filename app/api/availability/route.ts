import {NextResponse} from 'next/server';
import ICAL from 'ical.js';

export const runtime = 'nodejs';

type BlockedRange = {
  start: string;
  end: string;
};

function dateKey(time: ICAL.Time) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${time.year}-${pad(time.month)}-${pad(time.day)}`;
}

function mergeRanges(ranges: BlockedRange[]) {
  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  const merged: BlockedRange[] = [];

  for (const range of sorted) {
    const previous = merged.at(-1);
    if (!previous || range.start > previous.end) {
      merged.push({...range});
      continue;
    }
    if (range.end > previous.end) previous.end = range.end;
  }

  return merged;
}

function tunisDateKey(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Tunis',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export async function GET() {
  const calendarUrl = process.env.LODGIFY_ICAL_URL;
  if (!calendarUrl) {
    return NextResponse.json({error: 'Availability is not configured.'}, {status: 503});
  }

  try {
    const url = new URL(calendarUrl);
    if (url.protocol !== 'https:') throw new Error('Calendar URL must use HTTPS.');

    const response = await fetch(url, {
      headers: {Accept: 'text/calendar, text/plain;q=0.9'},
      next: {revalidate: 300},
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`Calendar returned ${response.status}.`);

    const source = await response.text();
    if (source.length > 1_000_000 || !source.includes('BEGIN:VCALENDAR')) {
      throw new Error('Calendar response is invalid.');
    }

    const calendar = new ICAL.Component(ICAL.parse(source));
    const ranges = calendar.getAllSubcomponents('vevent').flatMap<BlockedRange>((component) => {
      const status = String(component.getFirstPropertyValue('status') ?? '').toUpperCase();
      if (status === 'CANCELLED') return [];

      const event = new ICAL.Event(component);
      if (!event.startDate || !event.endDate) return [];
      const start = dateKey(event.startDate);
      const end = dateKey(event.endDate);
      return start < end ? [{start, end}] : [];
    });

    return NextResponse.json(
      {
        blocked: mergeRanges(ranges),
        today: tunisDateKey(new Date()),
        checkedAt: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('Unable to load Lodgify availability:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({error: 'Availability could not be loaded.'}, {status: 502});
  }
}
