<template>
  <div class="bar__container">
    <div v-if="!mute" class="bars" id="bars">
      <span :style="`height: ${level * 1}px`"></span>
      <span :style="`height: ${level * 1.5}px`"></span>
      <span :style="`height: ${level * 1}px`"></span>
    </div>
    <div v-if="!mute" class="bars_two" id="bars">
      <span :style="`height: ${level * 1}px`"></span>
      <span :style="`height: ${level * 1.5}px`"></span>
      <span :style="`height: ${level * 1}px`"></span>
    </div>
    <div v-if="mute" class="bars" id="bars">
      <span :style="`height: 3.5px`"></span>
      <span :style="`height: 3.5px`"></span>
      <span :style="`height: 3.5px`"></span>
    </div>
    <div v-if="mute" class="bars_two" id="bars">
      <span :style="`height: 3.5px`"></span>
      <span :style="`height: 3.5px`"></span>
      <span :style="`height: 3.5px`"></span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
const props = defineProps(["audioLevel", "mute"]);

// eslint-disable-next-line no-unused-vars
const level = computed(() => {
  return (Number(props.audioLevel) * 10) / 10000;
});
</script>

<style lang="css" scoped>
.bar__container {
  position: relative;
  background: #003bb3;
  border-radius: 50%;
  height: 23px;
  width: 23px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 3px;
}
.bars {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  transform: rotateX(180deg);
  gap: 1px;
  top: 1.5px;
}
.bars_two {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  gap: 1px;
  bottom: 1.5px;
}
.bars_two span,
.bars span {
  width: 3.5px;
  display: inline-block;
  background: #ffffff;
  border-bottom-left-radius: 3.5px;
  border-bottom-right-radius: 3.5px;
  /* border-top-left-radius: 2px;
  border-top-right-radius: 2px; */
}
</style>