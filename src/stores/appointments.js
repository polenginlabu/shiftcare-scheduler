import { defineStore } from 'pinia';
const KEY = 'shiftcare_appointments_v1';

export const useAppointments = defineStore('appointments', {
  state: () => ({
    appointments: [],
  }),
  actions: {
    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) this.appointments = JSON.parse(raw);
      } catch {}
    },
    persist() { localStorage.setItem(KEY, JSON.stringify(this.appointments)); },
    book({ doctorId, doctorName, date, time, ts }) {
      const exists = this.appointments.some(a => a.doctorId === doctorId && a.ts === ts);
      if (exists) throw new Error('This timeslot is already booked.');
      const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      this.appointments.push({ id, doctorId, doctorName, date, time, ts });
      this.persist();
      return id;
    },
    cancel(id) {
      this.appointments = this.appointments.filter(a => a.id !== id);
      this.persist();
    },
  },
});
