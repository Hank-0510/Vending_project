<template>
  <span>{{ displayValue }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface Props {
  startVal?: number
  endVal: number
  duration?: number
  autoplay?: boolean
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  startVal: 0,
  duration: 2000,
  autoplay: true,
  decimals: 0
})

const displayValue = ref(props.startVal)
let startTime: number | null = null
let timer: number | null = null

const formatNumber = (num: number) => {
  return num.toFixed(props.decimals)
}

const countUp = () => {
  if (startTime === null) {
    startTime = Date.now()
  }

  const progress = Math.min((Date.now() - startTime) / props.duration, 1)
  const currentValue = props.startVal + (props.endVal - props.startVal) * progress

  displayValue.value = parseFloat(formatNumber(currentValue))

  if (progress < 1) {
    timer = requestAnimationFrame(countUp)
  }
}

const start = () => {
  startTime = null
  if (timer) {
    cancelAnimationFrame(timer)
  }
  countUp()
}

watch(() => props.endVal, () => {
  if (props.autoplay) {
    start()
  }
})

onMounted(() => {
  if (props.autoplay) {
    start()
  }
})

onUnmounted(() => {
  if (timer) {
    cancelAnimationFrame(timer)
  }
})
</script>