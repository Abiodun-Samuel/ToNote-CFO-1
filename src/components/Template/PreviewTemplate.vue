<template>
  <div>
    <div class="d-flex justify-content-center">
      <PreLoader v-if="loading" />
    </div>
    <VuePdfEmbed @loaded="loading = false" :source="source" />
  </div>
</template>

<script setup>
import VuePdfEmbed from "vue-pdf-embed";
import PreLoader from "@/components/Loader/PreLoader.vue";
import { ref, defineProps } from "vue";

defineProps({
  source: {
    type: String,
    default: "",
  },
});
const loading = ref(true);
</script>
