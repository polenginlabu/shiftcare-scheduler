<script setup>
defineProps({ doctor: { type: Object, required: true } })
</script>

<template>
  <div class="card">
    <h3 style="margin: 0 0 6px">{{ doctor.name }}</h3>
    <div class="card-body">
      <div class="badge">{{ doctor.timezone }}</div>
      <p><strong>Next availability:</strong> {{ doctor.nextAvailability }}</p>
      <router-link class="btn" :to="`/doctor/${doctor.id}`">View Schedule</router-link>
    </div>
  </div>
</template>
