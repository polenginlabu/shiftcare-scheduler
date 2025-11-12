const URL = 'https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json';

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

export async function fetchDoctors() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Failed to fetch doctors');

  const rows = await res.json();

  const doctors = rows.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = {
        name: curr.name,
        timezone: curr.timezone,
        id: slugify(curr.name),
        schedule: []
      };
    }
    acc[curr.name].schedule.push({
      day: curr.day_of_week,
      from: curr.available_at.trim(),
      to: curr.available_until.trim()
    });
    return acc;
  }, {});

  const todayIndex = new Date().getDay();

  Object.values(doctors).forEach((doctor) => {
    const sortedSchedule = doctor.schedule.sort((a, b) =>
      weekdays.indexOf(a.day) - weekdays.indexOf(b.day)
    );

    const next = sortedSchedule.find(s => weekdays.indexOf(s.day) >= todayIndex)
             || sortedSchedule[0];
    doctor.nextAvailability = `${next.day} ${next.from}`;
  });

  console.log(doctors);
  return Object.values(doctors).sort((a, b) => a.name.localeCompare(b.name));
}

