<script setup>
import { onMounted, ref } from 'vue'
import { fetchDoctors } from '@/services/api'
import DoctorCard from '@/components/DoctorCard.vue'
import AppointmentList from '@/components/AppointmentList.vue'
import { useAppointments } from '@/stores/appointments'

const loading = ref(false)
const error = ref('')
const doctors = ref([])

const appt = useAppointments()
appt.load()

onMounted(async () => {
  loading.value = true
  try {
    doctors.value = await fetchDoctors()
  } catch (e) {
    error.value = e?.message || 'Failed to load doctors'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="grid" style="gap: 20px">
    <section class="card">
      <h2>Doctors</h2>
      <p v-if="loading">Loading…</p>
      <p v-if="error" class="err">{{ error }}</p>
      <div v-if="!loading && !error" class="grid cols-3">
        <DoctorCard v-for="d in doctors" :key="d.id" :doctor="d" />
      </div>
    </section>

    <!-- <section class="card">
      <h2>Your Appointments</h2>
      <AppointmentList />
    </section> -->
  </div>
</template>
