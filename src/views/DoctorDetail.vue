<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, useRoute, onBeforeRouteUpdate } from 'vue-router'
import moment from 'moment'
import SlotPicker from '@/components/SlotPicker.vue'
import { fetchDoctors } from '@/services/api'
import { buildWeekSlots, mondayOfThisWeek, shiftWeek } from '@/utils/slots'
import { useAppointments } from '@/stores/appointments'

const route = useRoute()
const loading = ref(false)
const error = ref('')
const doctor = ref(null)
const anchor = ref(mondayOfThisWeek())
const weekSlots = ref({})

const appointments = useAppointments()
appointments.load()

const DAY_KEY_MAP = {
  Sunday: 'sun',
  Monday: 'mon',
  Tuesday: 'tue',
  Wednesday: 'wed',
  Thursday: 'thu',
  Friday: 'fri',
  Saturday: 'sat',
}

function emptySchedule() {
  return { sun: [], mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] }
}

function to24Hour(timeStr) {
  if (!timeStr) return null
  const parsed = moment(timeStr, ['h:mma', 'h:mmA', 'H:mm'], true)
  return parsed.isValid() ? parsed.format('HH:mm') : null
}

function normalizeSchedule(rawSchedule) {
  if (!rawSchedule) return emptySchedule()
  if (!Array.isArray(rawSchedule)) return rawSchedule

  const normalized = emptySchedule()
  for (const window of rawSchedule) {
    const dayKey = DAY_KEY_MAP[window.day]
    const start = to24Hour(window.from)
    const end = to24Hour(window.to)
    if (dayKey && start && end) normalized[dayKey].push({ start, end })
  }
  console.log(normalized)
  return normalized
}

const bookedTimestamps = computed(() => {
  if (!doctor.value) return new Set()
  return new Set(
    appointments.appointments
      .filter((item) => String(item.doctorId) === String(doctor.value.id))
      .map((item) => item.ts),
  )
})

const rangeLabel = computed(() => {
  const start = moment(anchor.value)
  const end = moment(anchor.value).add(6, 'days')
  return `${start.format('MMM D')} – ${end.format('MMM D')}`
})

function recompute() {
  if (!doctor.value) return
  weekSlots.value = buildWeekSlots(doctor.value.schedule, anchor.value, 7)
}

function moveWeek(step) {
  anchor.value = shiftWeek(anchor.value, step)
  recompute()
}

async function loadDoctor(id) {
  loading.value = true
  error.value = ''
  try {
    const list = await fetchDoctors()
    const found = list.find((d) => String(d.id) === String(id))
    console.log(found)
    if (!found) throw new Error('Doctor not found')
    doctor.value = {
      ...found,
      schedule: normalizeSchedule(found.schedule),
    }
    recompute()
  } catch (err) {
    error.value = err?.message || 'Failed to load doctor'
  } finally {
    loading.value = false
  }
}

function onBook({ date, time, ts }) {
  if (!doctor.value) return
  try {
    appointments.book({
      doctorId: doctor.value.id,
      doctorName: doctor.value.name,
      date,
      time,
      ts,
    })
    alert('Booked!')
  } catch (err) {
    alert(err?.message || 'Unable to book this timeslot')
  }
}

onMounted(() => loadDoctor(route.params.id))
onBeforeRouteUpdate((to) => loadDoctor(to.params.id))
</script>

<template>
  <section class="card">
    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="err">{{ error }}</p>

    <template v-else-if="doctor">
      <div class="row" style="justify-content: space-between; align-items: center">
        <div>
          <h2 style="margin: 0">{{ doctor.name }}</h2>
          <div class="badge">Timezone {{ doctor.timezone }}</div>
        </div>

        <div class="row" style="gap: 8px; align-items: center">
          <button class="btn" @click="moveWeek(-1)">◀ Prev</button>
          <div class="badge">{{ rangeLabel }}</div>
          <button class="btn" @click="moveWeek(1)">Next ▶</button>
        </div>
      </div>

      <SlotPicker :week-slots="weekSlots" :booked="bookedTimestamps" @book="onBook" />

      <div class="row" style="margin-top: 16px">
        <RouterLink class="btn" to="/">← Back to Doctors</RouterLink>
      </div>
    </template>
  </section>
</template>
