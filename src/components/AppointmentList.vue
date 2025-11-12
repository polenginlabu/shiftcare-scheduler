<script setup>
import { useAppointments } from '@/stores/appointments'
const appt = useAppointments()
appt.load()

function cancel(id) {
  if (confirm('Cancel this appointment?')) appt.cancel(id)
}
</script>

<template>
  <div>
    <div v-if="appt.appointments.length === 0" style="color: #a3b0d9">No appointments yet.</div>

    <div v-else class="grid" style="gap: 12px">
      <div class="card" v-for="a in appt.appointments" :key="a.id">
        <div class="row" style="justify-content: space-between">
          <div>
            <strong>{{ a.doctorName }}</strong>
            <div class="badge">{{ a.date }} @ {{ a.time }}</div>
          </div>
          <button class="btn" @click="cancel(a.id)">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
