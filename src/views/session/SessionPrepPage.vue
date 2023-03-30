<template>
  <div
    v-if="login_loader"
    style="height: 90vh"
    class="d-flex justify-content-center align-items-center"
  >
    <PreLoader />
  </div>
  <template v-else>
    <WaitingComponent />
  </template>
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import WaitingComponent from "@/components/Video/PrePlayer/WaitingComponent.vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import PreLoader from "@/components/Loader/PreLoader.vue";

const route = useRoute();

const { loginFromDashboard } = useActions({
  loginFromDashboard: "auth/loginFromDashboard",
});
const { login_loader } = useGetters({
  login_loader: "auth/login_loader",
});

onBeforeMount(() => {
  if (route.query.token) loginFromDashboard(route.query.token);
});
</script>