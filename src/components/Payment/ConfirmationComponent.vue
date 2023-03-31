<template>
  <div data-aos="zoom-in" class="row d-flex justify-content-center">
    <div class="col-lg-12 col-md-10">
      <div class="text-center mb-2">
        <img
          src="../../assets/images/logo2.png"
          alt="ToNote Logo"
          class="my-1 confimation__logo"
        />
        <h4 class="fw-bolder text-primary">Session created successfully</h4>
      </div>
      <div class="text-center">
        <p><b>Title:</b> {{ schedule_details.title }}</p>
        <p v-if="schedule_details.notary">
          <b>Commissioner for Oaths:</b>
          {{
            schedule_details.notary.first_name +
            " " +
            schedule_details.notary.last_name
          }}
        </p>
        <p>{{ formatted_date }} <b>|</b> {{ schedule_details.start_time }}</p>

        <div class="copy__input">
          <input
            disabled
            ref="url"
            type="text"
            :value="`${home}/notary/session-prep/${schedule_details?.id}?token=${token}`"
            placeholder="Enter your email"
            class="form-control"
            :style="copy_state && 'border-color: #14A44D'"
          />
          <button
            @click="copy"
            class="copy-button"
            :class="copy_state ? `btn btn-success` : 'btn btn-primary'"
            type="button"
          >
            <span>{{ copy_state ? "Copied" : "Copy" }}</span>
          </button>
        </div>
      </div>

      <div class="mt-2 text-center">
        <router-link
          v-if="schedule_details.immediate"
          class="btn btn-primary"
          :to="{
            name: 'session-prep',
            params: { session_id: schedule_details.id },
            query: { token: token },
          }"
        >
          Proceed</router-link
        >
        <a
          v-else
          class="btn btn-primary"
          :href="redirectToUserDashboard + '/redirecting?qt=' + token"
        >
          Dashboard</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
import { computed, ref, onMounted, onUnmounted, onBeforeMount } from "vue";
import { useGetters } from "vuex-composition-helpers/dist";

const redirectToUserDashboard = ref("");
const url = ref();
const clear = ref(null);
const copy_state = ref(false);
const home =
  process.env.NODE_ENV == "development"
    ? process.env.VUE_APP_URL_NOTARY_REQ_LOCAL
    : process.env.VUE_APP_URL_NOTARY_REQ_STAGING;

const { token, schedule_details } = useGetters({
  token: "auth/token",
  schedule_details: "schedule/schedule_details",
});

const formatted_date = computed(() => {
  return moment(schedule_details.value.date).format("dddd, MMMM DD YYYY");
});

const copy = () => {
  var copyText = url.value;
  copyText.select();
  // for mobile devices
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  copy_state.value = true;
  clear.value = setTimeout(() => {
    copy_state.value = false;
  }, 2000);
};
onBeforeMount(() => {
  //  store
  //   .dispatch("schedule/VirtualSessionDetailsAction", route.params.session_id)
});
onMounted(() => {
  redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_STAGING;
});
onUnmounted(() => {
  clearTimeout(clear.value);
});
</script>

<style lang="css">
.confimation__logo {
  height: 100px;
  width: 100px;
}
.copy-button {
  padding-left: 6px;
  padding-right: 6px;
}
.copy__input {
  display: flex;
  position: relative;
  align-items: stretch;
}
.copy__input input {
  height: 3.2rem;
}
.copy__input button {
  position: relative;
  right: 7px;
}
</style>