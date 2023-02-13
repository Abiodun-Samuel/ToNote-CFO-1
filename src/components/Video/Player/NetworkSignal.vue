<template>
  <div class="inb">
    <div class="bars" :data-bars="level" id="bars">
      <span></span><span></span><span></span><span></span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onUpdated, ref } from "vue";

const props = defineProps(["signal_strength"]);
const level = ref(1);

onUpdated(() => {
  level.value = props.signal_strength;
});
</script>

<style lang="css" scoped>
.bars {
  width: 2.9em;
  height: 2.2em;
  background: transparent;
  position: relative;
  transform: rotateY(180deg);
}
.bars > span {
  width: 0.5em;
  position: absolute;
  bottom: 0em;
  margin: 2px;
  transition: all linear 0.25s;
}
.bars > span:nth-child(1) {
  height: 2em;
  left: 0.1em;
}
.bars > span:nth-child(2) {
  height: 1.5em;
  left: 0.8em;
}
.bars > span:nth-child(3) {
  height: 1em;
  left: 1.5em;
}
.bars > span:nth-child(4) {
  height: 0.5em;
  left: 2.2em;
}

.bars[data-bars="4"] > span {
  background: #0f1;
}

.bars[data-bars="3"] > span {
  background: #0af;
}
.bars[data-bars="3"] > span:nth-child(1) {
  background: #ddd;
}

.bars[data-bars="2"] > span {
  background: #ffb03d;
}
.bars[data-bars="2"] > span:nth-child(1),
.bars[data-bars="2"] span:nth-child(2) {
  background: #ddd;
}

.bars[data-bars="2"] > span {
  background: #ffb03d;
}
.bars[data-bars="2"] > span:nth-child(1),
.bars[data-bars="2"] span:nth-child(2) {
  background: #ddd;
}

.bars[data-bars="1"] > span {
  background: #f00;
}
.bars[data-bars="1"] > span:nth-child(1),
.bars[data-bars="1"] > span:nth-child(2),
.bars[data-bars="1"] > span:nth-child(3) {
  background: #ddd;
}
.bars[data-bars="0"] > span {
  background: #ddd;
}
.bars[data-bars="0"] > span:nth-child(1),
.bars[data-bars="0"] > span:nth-child(2),
.bars[data-bars="0"] > span:nth-child(3) {
  background: #ddd;
}
</style>