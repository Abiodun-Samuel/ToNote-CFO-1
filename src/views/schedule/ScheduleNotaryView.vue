<template>
  <div
    v-if="login_loader"
    style="height: 75vh"
    class="d-flex justify-content-center align-items-center"
  >
    <pre-loader />
  </div>
  <template v-else>
    <ScheduleNotaryComponent />
  </template>
</template>

<script setup>
import ScheduleNotaryComponent from "@/components/ScheduleNotary/ScheduleNotaryComponent.vue";
import { onBeforeMount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import PreLoader from "@/components/Loader/PreLoader.vue";
// import store from "@/store";

const route = useRoute();
const router = useRouter();

const { login_loader } = useGetters({ login_loader: "auth/login_loader" });

const { loginFromDashboard } = useActions({
  loginFromDashboard: "auth/loginFromDashboard",
});

onBeforeMount(() => {
  if (route.query.session != "affidavit" && route.query.session != "notary") {
    router.push({ path: "notary" });
  }
  // const hasToken = store.getters["auth/token"];
  // if (!hasToken && route.query.token) {
  // }
  if (route.query.token) loginFromDashboard(route.query.token);
});
onMounted(() => {});
</script>