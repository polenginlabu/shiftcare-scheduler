import moment from 'moment';

/**
 * Generate 30-minute slots from start to end (end exclusive).
 * Example: start="09:00", end="17:00"
 */
export function generateThirtyMinuteSlots(startStr, endStr, dayDate) {
  const [sh, sm] = startStr.split(':').map(Number);
  const [eh, em] = endStr.split(':').map(Number);

  const start = moment(dayDate).set({ hour: sh, minute: sm, second: 0, millisecond: 0 });
  const end   = moment(dayDate).set({ hour: eh, minute: em, second: 0, millisecond: 0 });

  const slots = [];
  const cursor = start.clone();

  while (cursor.isBefore(end)) {
    slots.push({ ts: +cursor, label: cursor.format('HH:mm') });
    cursor.add(30, 'minutes');
  }
  return slots;
}

/**
 * Build week map: { 'YYYY-MM-DD': [{ts,label}, ...], ... }
 */
export function buildWeekSlots(weeklySchedule, anchorDate, daysCount = 7) {
  const dayKeys = ['sun','mon','tue','wed','thu','fri','sat'];
  const map = {};

  for (let i = 0; i < daysCount; i++) {
    const date = moment(anchorDate).add(i, 'days');
    const ymd = date.format('YYYY-MM-DD');
    const dayKey = dayKeys[date.day()];
    const windows = weeklySchedule?.[dayKey] || [];

    let slots = [];
    for (const w of windows) {
      slots = slots.concat(generateThirtyMinuteSlots(w.start, w.end, date));
    }
    map[ymd] = slots;
  }
  return map;
}

/** Monday (ISO) of current week */
export function mondayOfThisWeek(date = new Date()) {
  return moment(date).startOf('isoWeek').toDate();
}

/** Shift current anchor date by n weeks */
export function shiftWeek(anchorDate, n) {
  return moment(anchorDate).add(7 * n, 'days').toDate();
}
