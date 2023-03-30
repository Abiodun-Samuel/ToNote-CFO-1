<template>
  <div class="container">
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
      style="height: 100vh"
    >
      <PreLoader />
    </div>

    <div class="row d-flex justify-content-center align-items-center">
      <div class="col-lg-10">
        <div class="auth-wrapper auth-basic px-2">
          <div class="auth-inner my-2">
            <div class="card mb-0">
              <div class="card-body">
                <div class="brand-logo">
                  <img src="@/assets/images/logo-dark.png" alt="" height="60" />
                </div>
                <template v-if="hasAccount == false">
                  <h2 class="card-title fw-bolder mb-1">
                    Two Step Verification 💬
                  </h2>
                  <p class="card-text mb-75">
                    Enter the code from the email in the field below.
                  </p>
                  <form class="mt-2" @submit.prevent="verifyAccessWithOtp">
                    <label for="security" class="form-label"
                      >Type your security code</label
                    >

                    <div
                      class="auth-input-wrapper d-flex align-items-center justify-content-between"
                    >
                      <v-otp-input
                        ref="otpInput"
                        input-classes="form-control auth-input height-50 text-center numeral-mask mx-25 mb-1"
                        separator=" "
                        :num-inputs="6"
                        :should-auto-focus="true"
                        :is-input-num="true"
                        @on-change="handleOnChange"
                        @on-complete="handleOnComplete"
                      />
                    </div>

                    <span
                      role="button"
                      class="d-block text-decoration-underline mb-1"
                      @click="clearInput()"
                      >Clear</span
                    >
                    <button
                      @click="verifyAccessWithPassword"
                      type="submit"
                      class="btn btn-primary w-100"
                      tabindex="4"
                      :disabled="disabled"
                    >
                      <span
                        v-show="verify_loader"
                        class="spinner-border spinner-border-sm"
                      ></span>
                      Verify
                    </button>
                  </form>

                  <p class="text-center mt-2">
                    <span>Didn't get the code?</span>
                    <a href="Javascript:void(0)" @click="resendToken"
                      ><span>&nbsp;Resend</span></a
                    >
                    <span> or</span>
                    <a href="Javascript:void(0)"
                      ><span>&nbsp;Contact Us</span></a
                    >
                  </p>
                </template>
                <template v-else>
                  <h2 class="card-title fw-bolder mb-1">
                    Enter your password 💬
                  </h2>
                  <p class="card-text mb-75">
                    Please, enter your password to view this document.
                  </p>

                  <form class="mt-2" @submit.prevent="verifyAccessWithPassword">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <label for="security" class="form-label">Password</label>
                      <label class="form-label">
                        <a :href="forgotPassword">Forgot Password?</a>
                      </label>
                    </div>

                    <div class="input-group mb-3">
                      <input
                        :type="inputType"
                        class="form-control"
                        placeholder="Enter password"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        v-model="otpPassword"
                      />
                      <span
                        @click="switchType"
                        role="button"
                        class="input-group-text"
                        id="basic-addon1"
                      >
                        <Icon :icon="iconType" height="18" />
                      </span>
                    </div>
                    <!-- <div class="form-group">
                      <input
                        type="password"
                        v-model="otpPassword"
                        class="form-control numeral-mask mb-1"
                        id="security"
                        placeholder="Enter password"
                      />
                    </div> -->
                    <button
                      type="submit"
                      class="btn btn-primary w-100"
                      tabindex="4"
                      :disabled="!otpPassword"
                    >
                      <span
                        v-show="verify_loader"
                        class="spinner-border spinner-border-sm"
                      ></span>
                      Sign in
                    </button>
                  </form>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PreLoader from "@/components/Loader/PreLoader.vue";
import VOtpInput from "vue3-otp-input";
import Api from "@/api/Api";
import { ref, onMounted, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { verify_loader } = useGetters({
  verify_loader: "auth/verify_loader",
});

const { verifyUserByPassword, userResendVerifyOTP } = useActions({
  verifyUserByPassword: "auth/verifyUserByPassword",
  userResendVerifyOTP: "auth/userResendVerifyOTP",
});

const route = useRoute();
// const router = useRouter();
const disabled = ref(true);
const forgotPassword = ref("");
const otpPassword = ref(null);
const hasAccount = ref(false);
const flag = ref(null);
const documentId = ref(null);
const email = ref(null);
const loading = ref(false);
const otpInput = ref();
const inputType = ref("password");
const iconType = ref("mdi:eye-off-outline");

const verifyAccessWithPassword = () => {
  let formData = {
    email: email.value,
    password: otpPassword.value,
    session_id: documentId.value,
  };
  verifyUserByPassword(formData);
};
const switchType = () => {
  iconType.value =
    iconType.value == "mdi:eye-off-outline"
      ? "mdi:eye-outline"
      : "mdi:eye-off-outline";
  inputType.value = inputType.value == "password" ? "text" : "password";
};
const handleOnComplete = (value) => {
  disabled.value = false;
  otpPassword.value = value;
};

const resendToken = () => {
  let formData = {
    email: email.value,
    session_id: documentId.value,
  };
  userResendVerifyOTP(formData);
};

const clearInput = () => {
  otpInput.value.clearInput();
};

onBeforeMount(() => {
  loading.value = true;
  email.value = route.query.e;
  flag.value = route.query.f;
  documentId.value = route.query.di;
  Api.get(
    process.env.VUE_APP_API_LIVE + "document-user-check/" + email.value
  ).then((response) => {
    hasAccount.value = response.data.data.message;
    loading.value = false;
  });
});

onMounted(() => {});
// computed: {
//     isAuth() {
//       return store.state.auth.profile;
//     },
//   },
//  verifyAccessWithOtp() {
//    let formData = {
//      email: this.$route.query.e,
//      password: this.otpPassword,
//      session_id: this.$route.query.di,
//    };
//    store.dispatch("authStore/ScheduleSessionVerifyAction", formData).then(
//      () => {
//        router.push({
//          path: `/await-notary-session/${this.$route.query.di}`,
//        });
//      },
//      // error
//      () => {}
//    );
//  },
//
//  handleOnChange() {
//    console.log("onchanged");
//  },

//  if (store.state.authStore.isAuthenticated) {
//    router.push({
//      path: `/await-notary-session/${this.$route.query.di}`,
//    });
//  }
// if (!this.$route.query.e && !this.$route.query.di && !this.$route.query.f) {
//   this.$toast.error("Unauthorized");
// }
forgotPassword.value =
  process.env.NODE_ENV != "development"
    ? process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LIVE
    : process.env.VUE_APP_URL_AUTH_FORGOT_PASSWORD_LOCAL;
</script>

<style lang="css" scoped>
@import "@/assets/css/home.css";
</style>
