<script setup>
import moment from 'moment'

const props = defineProps({
  weekSlots: { type: Object, required: true },
  booked: { type: Object, required: true },
})
const emit = defineEmits(['book'])

function tryBook(date, slot) {
  if (props.booked.has(slot.ts)) return
  emit('book', { date, time: slot.label, ts: slot.ts })
}
</script>

<template>
  <div class="grid" style="gap: 18px">
    <div v-for="(slots, ymd) in weekSlots" :key="ymd" class="card">
      <div class="day">{{ ymd }} • {{ moment(ymd, 'YYYY-MM-DD').format('dddd') }}</div>

      <div v-if="slots.length === 0" style="color: #a3b0d9; margin-top: 8px">No availability</div>

      <div class="row" style="margin-top: 8px">
        <button
          v-for="s in slots"
          :key="s.ts"
          class="slot"
          :class="{ booked: booked.has(s.ts) }"
          @click="tryBook(ymd, s)"
          :disabled="booked.has(s.ts)"
          :title="booked.has(s.ts) ? 'Booked' : 'Book this time'"
        >
          {{ s.label }}
        </button>
      </div>
    </div>
  </div>
</template>
