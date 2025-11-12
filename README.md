# ShiftCare Scheduler

Single-page Vue application that fulfils the ShiftCare frontend scheduling challenge. It lists active doctors from the provided API, exposes their 30‑minute availability, and lets visitors book or cancel appointments with local persistence.

## Features

- Doctor catalogue with specialty badges and deep links to their schedules.
- Weekly schedule view per doctor, including week-to-week navigation and booked-slot highlighting.
- 30-minute slot booking flow with optimistic UI feedback and client-side validation.
- Appointment history panel with cancel actions and browser `localStorage` persistence.
- Error and loading states for API requests, plus graceful fallback when a doctor id is invalid.

## Tech Decisions

- **Vue 3 Composition API** for component state and lifecycle management.
- **Vite** dev/build tooling for fast feedback.
- **Vue Router** for two lightweight routes (`/` and `/doctor/:id`).
- **Pinia** store (`useAppointments`) to centralise appointment data and keep slot status reactive across views.
- **Moment.js** for date arithmetic and formatting; trading bundle size for quick, well-tested calendar helpers.
- **LocalStorage** persistence keyed under `shiftcare_appointments_v1`, matching the challenge requirement for non-auth experiences.

## Getting Started

```sh
npm install
npm run dev
```

Visit the dev server URL printed in the terminal (defaults to http://localhost:5173).

### Additional Commands

```sh
npm run build   # production bundle
npm run preview # preview the production build locally
npm run lint    # eslint with cached autofix
npm run format  # prettier on src/
```

## Using the App

1. The landing page fetches doctors from `https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json`.
2. Select “View Schedule” to inspect a doctor. The week view starts on Monday and supports moving forward/back in one-week increments.
3. Click an available slot to book it. The booking is saved to localStorage and immediately reflected across the app.
4. Manage existing appointments in the sidebar list, including cancel actions.

## Architecture Notes

- `src/services/api.js` isolates the fetch call for potential swap to a real backend later.
- `src/utils/slots.js` generates normalized 30-minute slots and exposes helpers for week navigation.
- `src/stores/appointments.js` owns booking rules, deduping, persistence, and cancellation logic.
- Views (`src/views`) stay presentation-focused by delegating business logic to the store + utilities.

## Known Tradeoffs / Future Ideas

- Moment.js keeps logic terse but could be replaced with the modern `Temporal` API or a lighter library.
- API errors currently surface as inline messages; a toast/notification system would improve UX.
- No server sync is implemented, so bookings are local to the browser session.
- Accessibility can be improved further (e.g. keyboard focus states, ARIA labels for slots).

## License

MIT © ShiftCare Scheduler contributors
