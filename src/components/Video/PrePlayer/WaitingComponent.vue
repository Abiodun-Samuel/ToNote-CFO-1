<template>
  <div class="container">
    <div class="row my-1">
      <div class="col-md-12">
        <h3 class="fw-bolder my-0 py-0">Test Audio and Video Quality</h3>
        <p class="my-0" style="padding: 5px 0">
          Before your session is set up, please confirm that your camera and
          microphone are switched on.
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-7 mb-1">
        <AgoraPlayer
          v-if="agoraVideo"
          :localAudio="agoraAudio"
          :localVideo="agoraVideo"
          :domId="agoraVideo._ID"
        >
        </AgoraPlayer>
        <skeleton-loader v-else height="420px" width="100%" />
      </div>

      <div
        class="col-lg-5 mb-1 d-flex justify-content-center align-items-center"
      >
        <div
          v-if="virtual_session_loader"
          class="d-flex justify-content-center"
        >
          <PreLoader />
        </div>
        <div v-else>
          <!--=== verification===  -->
          <!-- v-if="!userProfile?.national_verification" -->
          <!-- <div
            v-if="!userProfile?.national_verification"
            class="alert alert-danger p-1 text-center my-1"
            role="alert"
          >
            <p>
              Please verify your identity before joining the notary session.
            </p>
            <button
              @click="openVerificationModal = true"
              class="btn btn-sm btn-outline-danger mt-1"
            >
              Verify
            </button>
          </div> -->

          <!-- === for inactive session === -->

          <!-- === immediate session===  -->
          <div v-if="virtual_session_details?.immediate">
            <!-- notary -->
            <div
              v-if="user_from_doc?.role === 'Notary'"
              style="height: 30px"
              class="my-2"
            >
              <VueWriter
                class="h4 fw-bold text-center"
                :array="['You can begin the session now.']"
                :typeSpeed="50"
                :eraseSpeed="50"
                :delay="500"
              />
            </div>
            <!-- Other participants  -->
            <div v-else style="height: 30px" class="my-2">
              <VueWriter
                v-if="!notary_available"
                class="h4 fw-bold text-center"
                :array="['Connecting to the Commissioner for Oaths...']"
                :typeSpeed="50"
                :eraseSpeed="50"
                :delay="500"
              />
              <div v-else>
                <h5 class="fw-bolder">
                  Your Commissioner for Oaths is now available.
                </h5>
                <div class="d-flex gap-1 align-items-center">
                  <Icon icon="iconoir:profile-circled" />
                  <span> {{ notary_details.name }}</span>
                </div>
              </div>
            </div>
            <!-- button  -->
            <div class="text-center mt-3">
              <!-- !camera || !microphone || !userProfile.national_verification -->
              <!--  -->
              <button
                class="btn btn-primary"
                @click="proceedToSession"
                :disabled="
                  agoraAudio?.muted ||
                  agoraVideo?.muted ||
                  !mediaDevicesReady ||
                  (!is_notary && !notary_available)
                "
              >
                Proceed</button
              ><br />
            </div>
          </div>
          <!-- === scheduled session  (for document owner ) === -->
          <div
            v-if="
              !virtual_session_details?.immediate &&
              virtual_session_details?.customer_id === userProfile?.id
            "
          >
            <template v-if="!sessionReady">
              <div class="text-center my-3">
                <h4 class="lead">This session is scheduled to hold on</h4>
                <h4 class="lead fw-bold">
                  <b>{{
                    moment(virtual_session_details?.date).format(
                      "dddd, MMMM DD YYYY."
                    )
                  }}</b>
                  <br />
                  <b>{{ virtual_session_details?.start_time }}</b>
                </h4>
              </div>

              <div class="text-center my-2">
                <h4 class="lead">
                  Will you like to
                  <router-link class="fw-bold" :to="{ name: 'notary.schedule' }"
                    >Reschedule</router-link
                  >? or
                  <router-link class="fw-bold" :to="{ name: 'document-index' }"
                    >Back to Homepage</router-link
                  >
                </h4>
              </div>
            </template>
            <template v-else>
              <div style="height: 30px" class="my-2">
                <VueWriter
                  v-if="!notary_available"
                  class="h4 fw-bold text-center"
                  :array="['Connecting to the Commissioner for Oaths...']"
                  :typeSpeed="50"
                  :eraseSpeed="50"
                  :delay="500"
                />
                <div v-else>
                  <h5 class="fw-bolder">Your Notary is now available.</h5>
                  <div class="d-flex gap-1 align-items-center">
                    <Icon icon="iconoir:profile-circled" />
                    <span> {{ notary_details.name }}</span>
                  </div>
                </div>
              </div>
              <!-- button  -->
              <div class="text-center mt-3">
                <!-- !camera || !microphone || !userProfile.national_verification -->
                <button
                  class="btn btn-primary"
                  @click="proceedToSession"
                  :disabled="
                    !mediaDevicesReady ||
                    agoraAudio?.muted ||
                    agoraVideo?.muted ||
                    (!is_notary && !notary_available)
                  "
                >
                  Proceed</button
                ><br />
              </div>
            </template>
          </div>
          <!--  === scheduled session (participants and notary) === -->
          <div
            v-if="
              !virtual_session_details?.immediate &&
              virtual_session_details?.customer_id !== userProfile?.id
            "
          >
            <template v-if="!sessionReady">
              <div class="text-center my-3">
                <h4 class="lead">This session is scheduled to hold on</h4>
                <h4 class="lead fw-bold">
                  <b>{{
                    moment(virtual_session_details?.date).format(
                      "dddd, MMMM DD YYYY."
                    )
                  }}</b>
                  <br />
                  <b>{{ virtual_session_details?.start_time }}</b>
                </h4>
              </div>
              <div class="text-center my-2">
                <h4 class="lead">Go back to dashboard</h4>
                <router-link :to="{ name: 'document-index' }">Home</router-link>
              </div>
            </template>
            <template v-else>
              <template v-if="user_from_doc?.role === 'Notary'">
                <div style="height: 30px" class="my-2">
                  <VueWriter
                    class="h4 fw-bold text-center"
                    :array="['You can begin the session now.']"
                    :typeSpeed="50"
                    :eraseSpeed="50"
                    :delay="500"
                  />
                </div>
                <div class="text-center mt-3">
                  <!-- !camera || !microphone || !userProfile.national_verification -->
                  <button
                    class="btn btn-primary"
                    @click="proceedToSession"
                    :disabled="
                      !mediaDevicesReady ||
                      agoraAudio?.muted ||
                      agoraVideo?.muted ||
                      (!is_notary && !notary_available)
                    "
                  >
                    Proceed</button
                  ><br />
                </div>
              </template>
              <template v-else>
                <div style="height: 30px" class="my-2">
                  <VueWriter
                    v-if="!notary_available"
                    class="h4 fw-bold text-center"
                    :array="['Connecting to the Commissioner for Oaths...']"
                    :typeSpeed="50"
                    :eraseSpeed="50"
                    :delay="500"
                  />
                  <div v-else>
                    <h5 class="fw-bolder">Your Notary is now available.</h5>
                    <div class="d-flex gap-1 align-items-center">
                      <Icon icon="iconoir:profile-circled" />
                      <span> {{ notary_details.name }}</span>
                    </div>
                  </div>
                </div>
                <!-- button  -->
                <div class="text-center mt-3">
                  <!-- !camera || !microphone || !userProfile.national_verification -->
                  <button
                    class="btn btn-primary"
                    @click="proceedToSession"
                    :disabled="
                      !mediaDevicesReady ||
                      agoraAudio?.muted ||
                      agoraVideo?.muted ||
                      (!is_notary && !notary_available)
                    "
                  >
                    Proceed</button
                  ><br />
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>

  <ModalComp
    :show="openVerificationModal"
    :size="'modal-md'"
    @close="openVerificationModal = false"
  >
    <template #header>
      <h4 class="modal-title text-primary fw-bolder">Identity Verification</h4>
    </template>

    <template #body>
      <VerificationComponent @close="openVerificationModal = false" />
    </template>
  </ModalComp>
</template>

<script setup>
import SkeletonLoader from "@/components/Loader/SkeletonLoader.vue";
import PreLoader from "@/components/Loader/PreLoader.vue";
import moment from "moment";
import { Icon } from "@iconify/vue";
import { useStore } from "vuex";
import { ref, onMounted, onUnmounted, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import ModalComp from "@/components/ModalComp.vue";
import VerificationComponent from "@/components/Auth/VerificationComponent.vue";
import AgoraPlayer from "@/components/Video/PrePlayer/AgoraPlayer.vue";
import { useToast } from "vue-toast-notification";
import socket from "@/utils/event-bus";
import { useGetters } from "vuex-composition-helpers/dist";
import AgoraRTC from "agora-rtc-sdk-ng";
import { events } from "@/utils/constants";

const agoraAudio = ref(null);
const agoraVideo = ref(null);
const toast = useToast();
const mediaDevicesReady = ref(false);
AgoraRTC.setLogLevel(4);

const start = async () => {
  try {
    agoraAudio.value = await AgoraRTC.createMicrophoneAudioTrack({
      encoderConfig: "speech_standard",
    });
    agoraVideo.value = await AgoraRTC.createCameraVideoTrack();
    mediaDevicesReady.value = true;
  } catch (error) {
    if (error) mediaDevicesReady.value = false;
    toast.error(
      "Please grant the permission for this page to access your microphone and camera.",
      {
        duration: 5000,
        position: "top-right",
      }
    );
  }
};

const router = useRouter();
const route = useRoute();
const store = useStore();

const virtual_session_loader = ref(true);
const sessionReady = ref(false);
const checkTimeInterval = ref(null);
const openVerificationModal = ref(false);
const user_from_doc = ref({
  role: "",
});
const notary_available = ref(false);
const notary_details = ref({
  id: "",
  name: "",
});

const {
  userProfile,
  is_notary,
  virtual_session_details,
  // virtual_session_loader,
} = useGetters({
  userProfile: "auth/profile",
  is_notary: "auth/is_notary",
  virtual_session_details: "schedule/virtual_session_details",
  // virtual_session_loader: "schedule/session_details_loading",
});
const proceedToSession = () => {
  if (
    mediaDevicesReady.value &&
    !agoraAudio.value?.muted &&
    !agoraVideo.value?.muted
  ) {
    router.push({
      name: "document.edit",
      params: {
        document_id: virtual_session_details.value?.schedule_id,
        session_id: virtual_session_details.value.id,
      },
    });
  } else {
    // return null;
    router.push({
      name: "document.edit",
      params: {
        document_id: virtual_session_details.value?.schedule_id,
        session_id: virtual_session_details.value.id,
      },
    });
  }
};

onUnmounted(() => {
  clearInterval(checkTimeInterval.value);
  socket.disconnect();
});

const checkdate = (date) => {
  let sessionDate = moment(date);
  let nowDate = moment();
  if (nowDate > sessionDate) {
    console.log("session ready");
    sessionReady.value = true;
  } else {
    console.log("awaiting session");
  }
};

onBeforeMount(() => {
  store
    .dispatch("schedule/VirtualSessionDetailsAction", route.params.session_id)
    .then(() => {
      if (
        moment() >
        moment(
          virtual_session_details.value?.date +
            " " +
            virtual_session_details.value?.start_time
        )
      ) {
        sessionReady.value = true;
      }
      checkTimeInterval.value = setInterval(() => {
        checkdate(
          virtual_session_details.value?.date +
            " " +
            virtual_session_details.value?.start_time
        );
      }, 1000);
      virtual_session_loader.value = false;
      socket.auth = {
        username: `${userProfile.value.first_name}-${userProfile.value.last_name}`,
        sessionRoom: `${virtual_session_details.value?.id}`,
      };
      socket.connect();

      user_from_doc.value =
        virtual_session_details.value?.schedule.participants.find((user) => {
          return user.user_id == userProfile.value?.id;
        });

      store.dispatch("schedule/GenAgoraTokenAction", {
        channel_name: route.params.session_id,
        user_id: `${userProfile.value.first_name}-${user_from_doc.value?.role}-${userProfile.value.initials}`,
        role: "Publisher",
      });
    });
});
onMounted(() => {
  start();
  socket.on(events.JOIN_ROOM_MESSAGE, (data) => {
    console.log(data.message);
  });
  // test parameters for socket.io
  // socket.on("connect_message", () => {});
  // socket.on("disconnect_message", () => {});
  // socket.on("join_message_others", () => {});

  const tryReconnect = () => {
    setTimeout(() => {
      socket.io.open((err) => {
        if (err) {
          tryReconnect();
        }
      });
    }, 2000);
  };
  socket.io.on("close", tryReconnect);
  socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
      ("");
    }
  });

  if (!is_notary.value) {
    socket.on(events.NOTARY_AVAILABLE, (data) => {
      notary_available.value = true;
      notary_details.value.id = JSON.parse(data).id;
      notary_details.value.name = JSON.parse(data).name;
    });
  }
});
</script>

<style scoped>
.btn-primary {
  background-color: #003bb3 !important;
  border-color: #003bb3 !important;
}
.btn {
  font-weight: 400;
  font-size: 1rem;
}

button:disabled,
button[disabled] {
  background: #f2f2f2 !important;
  color: #7b7b7b !important;
  border-color: #f2f2f2 !important;
  border: none;
  cursor: not-allowed !important;
  box-shadow: none;
}
</style>
