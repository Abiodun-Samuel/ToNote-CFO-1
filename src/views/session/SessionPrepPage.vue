<template>
  <WaitingComponent />
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import WaitingComponent from "@/components/Video/PrePlayer/WaitingComponent.vue";
import { useActions } from "vuex-composition-helpers/dist";

const route = useRoute();

const { loginFromDashboard } = useActions({
  loginFromDashboard: "auth/loginFromDashboard",
});

onBeforeMount(() => {
  if (route.query.token) loginFromDashboard(route.query.token);
});
</script>