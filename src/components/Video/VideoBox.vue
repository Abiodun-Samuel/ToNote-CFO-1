<template>
  <div class="videocall__box">
    <!-- <div class="d-flex justify-content-end mb-1">
      <NetworkSignal :signal_strength="networkSignal" />
    </div> -->

    <div v-if="refresh" class="mb-1">
      <p class="text-danger">
        Unable to load video fields. Please switch to a better network or click
        the button below to refresh the page.
      </p>
      <button @click="refresh_video" class="btn btn-outline-primary">
        Refresh
      </button>
    </div>

    <div class="mb-2" v-if="localVideo">
      <LocalPlayer
        @leave-channel="leaveAndRemoveLocalStream"
        :localAudio="localAudio"
        :localVideo="localVideo"
        :domId="UID"
      >
      </LocalPlayer>
      <div class="video__icon d-flex justify-content-between align-items-end">
        <div>
          <div>
            <AudioSignal
              :audioLevel="audioLevel"
              :mute="!localAudio.muted ? false : true"
            />
          </div>
        </div>
        <div class="d-flex justify-content-start align-items-center gap-1">
          <button @click="toggleCamera">
            <Icon
              :icon="
                !camera ? 'carbon:video-off-filled' : 'carbon:video-filled'
              "
              height="15"
              width="15"
            />
          </button>
          <button @click="toggleMic">
            <Icon
              :icon="
                !microphone ? 'fa:microphone-slash' : 'fa-solid:microphone'
              "
              height="15"
              width="15"
            />
          </button>
        </div>
        <span v-if="localVideo" class="text-primary fw-bold small"
          >{{ UID.split("-")[0] }} ({{
            UID.split("-")[1] == "Notary" ? "CFO" : UID.split("-")[1]
          }})</span
        >
      </div>
    </div>
    <!-- <button @click="leaveAndRemoveLocalStream">leave</button> -->
    <div v-if="loading">
      <SkeletonLoader height="160px" width="210px" :small="true" />
    </div>

    <div :class="handleEnlarge ? 'enlarge shadow rounded ' : ''">
      <div v-for="remoteStream in remoteStreams" :key="remoteStream.uid">
        <div
          :id="`user-container-${remoteStream.uid}`"
          :style="filteredUser && 'height:420px;width:800px;'"
          :class="
            filteredUser && filteredUser !== remoteStream.uid
              ? 'd-none'
              : 'agora-video-player shadow rounded'
          "
          style="margin-bottom: 28px"
        >
          <RemotePlayer
            :remoteStream="remoteStream"
            :remoteAudio="remoteStream.audioTrack"
            :remoteVideo="remoteStream.videoTrack"
            :remoteUid="remoteStream.uid"
          ></RemotePlayer>
          <div
            class="place__holder"
            v-if="remoteStream._video_muted_ ? 'd-none' : ''"
          >
            <h3>
              {{ remoteStream.uid.split("-")[2] }}
            </h3>
          </div>
          <div class="remote__content">
            <div class="pin">
              <button @click="handleEnlargeVideo(remoteStream.uid)" class="btn">
                <Icon
                  :icon="
                    !handleEnlarge
                      ? 'gg:arrows-expand-right'
                      : 'mdi:arrow-collapse'
                  "
                  height="20"
                  width="20"
                />
              </button>
            </div>
          </div>
          <div
            :class="
              filteredUser && filteredUser !== remoteStream.uid
                ? 'd-none'
                : 'indicator d-flex justify-content-between align-items-center bg-white'
            "
          >
            <span>
              <!-- <AudioSignal
                :audioLevel="remoteAudioLevel"
                :mute="!remoteStream._audio_muted_ ? false : true"
              /> -->
              <Icon
                :icon="
                  !remoteStream._audio_muted_
                    ? 'fa-solid:microphone'
                    : 'fa:microphone-slash'
                "
                height="15"
                width="15"
                :class="
                  !remoteStream._audio_muted_ ? 'text-primary' : 'text-danger'
                "
              />
            </span>
            <span class="text-primary fw-bold small"
              >{{ remoteStream.uid.split("-")[0] }} ({{
                remoteStream.uid.split("-")[1] == "Notary"
                  ? "CFO"
                  : remoteStream.uid.split("-")[1]
              }})</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { onMounted, ref } from "vue";
import AgoraRTC from "agora-rtc-sdk-ng";
import LocalPlayer from "@/components/Video/LocalPlayer.vue";
import RemotePlayer from "@/components/Video/RemotePlayer.vue";
import { useToast } from "vue-toast-notification";
import SkeletonLoader from "@/components/Loader/SkeletonLoader.vue";
import { useGetters } from "vuex-composition-helpers/dist";
// import NetworkSignal from "@/components/Video/Player/NetworkSignal.vue";
import AudioSignal from "@/components/Video/Player/AudioSignal.vue";

AgoraRTC.setLogLevel(4);
AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 100);

const toast = useToast();
const agora = JSON.parse(sessionStorage.getItem("agora"));

const APP_ID = agora.appid;
const TOKEN = agora.token;
const CHANNEL = agora.channelName;
const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});
client.enableAudioVolumeIndicator();
client.enableDualStream();

let remoteStreams = ref([]);
let filteredUser = ref(null);
let handleEnlarge = ref(false);
let camera = ref(true);
let microphone = ref(true);
let UID = ref("");
let localAudio = ref(null);
let localVideo = ref(null);
let loading = ref(true);
let audioLevel = ref(0);
// let remoteAudioLevel = ref(0);
let networkSignal = ref(null);

client.on("volume-indicator", function (result) {
  const res = result.filter(function (volume) {
    return volume.uid == UID.value;
  });
  const value = Number(res[0]?.level) * 100;
  audioLevel.value = value.toFixed(2);
});

const refresh = ref(false);
client.on("connection-state-change", (curState, revState, reason) => {
  console.log(curState);
  console.log(revState);
  console.log(reason);
  if (
    curState == "CONNECTING" &&
    revState == "DISCONNECTED" &&
    reason == undefined
  ) {
    refresh.value = true;
  } else {
    refresh.value = false;
  }
});

let user_from_doc = ref({});
const { profile, virtual_session_details } = useGetters({
  profile: "auth/profile",
  virtual_session_details: "schedule/virtual_session_details",
});

onMounted(async () => {
  const user = virtual_session_details.value?.schedule.participants.filter(
    (user) => {
      return user.user_id == profile.value?.id;
    }
  );
  user_from_doc.value = user[0];

  if (user_from_doc.value?.role == "Notary") {
    // fire notary joined event
  }
  // sub();
  // joinStream();
  await joinAndDisplayLocalStream();
});

const handleEnlargeVideo = (uid) => {
  if (!handleEnlarge.value) {
    handleEnlarge.value = true;
    filteredUser.value = uid;
  } else {
    handleEnlarge.value = false;
    filteredUser.value = null;
  }
};

const joinAndDisplayLocalStream = async () => {
  client.on("user-published", handleUserPublished);
  // client.on("user-unpublished", handleUserUnpublished);
  // client.on("user-info-updated", handleRemoteUnpublish);
  client.on("user-left", handleUserLeft);
  client.on("network-quality", (value) => {
    networkSignal.value = value.downlinkNetworkQuality;
  });

  UID.value = await client.join(APP_ID, CHANNEL, TOKEN, agora.uid);

  localAudio.value = await AgoraRTC.createMicrophoneAudioTrack({
    encoderConfig: "speech_standard",
  });

  localVideo.value = await AgoraRTC.createCameraVideoTrack({
    encoderConfig: {
      frameRate: 15,
      bitrateMin: 7,
      bitrateMax: 45,
    },
    optimizationMode: "motion",
  });
  loading.value = false;

  await client.publish([localAudio.value, localVideo.value]);

  toast.success(`You have joined the session.`, {
    position: "top-right",
    duration: 6000,
  });
};

// const handleUserUnpublished = async (user, type) => {
//   console.log("unpublished", user, type);
//   if (type === "audio") {
//     user.audioTrack?.stop();
//   }
//   if (type === "video") {
//     // remoteStreams
//     user.videoTrack?.stop();
//   }
// };
const handleUserPublished = async (user, mediaType) => {
  client.setRemoteVideoStreamType(user.uid, 1);
  await client.subscribe(user, mediaType);
  if (!remoteStreams.value.find((it) => it.uid == user.uid)) {
    remoteStreams.value.push(user);
    toast.success(`${user.uid.split("-")[0]} has joined the session.`, {
      position: "top-right",
      duration: 6000,
    });
  }
};

// const handleRemoteUnpublish = async (user, msg) => {
//   client.remoteUsers.map((u) => {
//     if (u.uid == user) {
//       if (msg == "mute-audio") {
//         remote_mic.value = false;
//       } else if (msg == "unmute-audio") {
//         remote_mic.value = true;
//       }
//       if (msg == "mute-video") {
//         remote_video.value = false;
//       } else if (msg == "unmute-video") {
//         remote_video.value = true;
//       }
//     }
//   });
// };

const handleUserLeft = async (user) => {
  console.log("leaving", user);
  remoteStreams.value = remoteStreams.value.filter(
    (User) => User.uid !== user.uid
  );
  // delete remoteStreams.value[user.uid];
  // document.getElementById(`user-container-${user.uid}`).remove();
  // remoteStreams.value = remoteStreams.value.filter((rem) => {
  //   return rem.uid != user.uid;
  // });
  toast.success(`${user.uid.split("-")[0]} has left the session.`, {
    position: "top-right",
    duration: 6000,
  });
};

const toggleMic = async () => {
  if (localAudio.value.muted) {
    microphone.value = true;
    await localAudio.value.setMuted(false);
    toast.success("Microphone is On", { position: "top-right" });
  } else {
    microphone.value = false;
    await localAudio.value.setMuted(true);
    toast.warning("Microphone is Off", { position: "top-right" });
  }
};

const toggleCamera = async () => {
  if (localVideo.value.muted) {
    camera.value = true;
    await localVideo.value.setMuted(false);
    toast.success("Camera is On", { position: "top-right" });
  } else {
    camera.value = false;
    await localVideo.value.setMuted(true);
    toast.warning("Camera is Off", { position: "top-right" });
  }
};

const refresh_video = () => {
  window.location.reload();
};
// const joinStream = async () => {
//   await joinAndDisplayLocalStream();
// };

const leaveAndRemoveLocalStream = async () => {
  await client.leave(`user-container-${UID.value}`);
  client.removeAllListeners();
  // localAudio.value?.close();
  localVideo.value?.close();
  localVideo.value?.close();
  remoteStreams.value = [];
  localVideo.value = null;
  toast.success(`You have left the session.`, {
    position: "top-right",
    duration: 6000,
  });
  window.location.reload();
};

// const handleEndSession = async () => {
//   toast.success(`notary session ends.`, {
//     position: "top-right",
//   });
// };

// const endSession = async () => {
//   // await client.unpublish([localAudio.value, localVideo.value]);
//   await client.leave();
//   toast.success(`notary session ends.`, {
//     position: "top-right",
//   });
//   //remove video box dom
//   // localVideo.value = null;
//   // remoteUsers.value = [];
//   console.log("local session has ended");
// };
</script>

<style>
.videocall__box {
  display: flex;
  position: relative;
  flex-direction: column;
}
.agora-video-player {
  width: 210px;
  height: 160px;
  border-radius: 5px !important;
  position: relative;
  background-color: #2f2f2f;
}
.video-player {
  height: 100%;
  width: 100%;
}
.enlarge {
  position: fixed;
  top: 0px;
  bottom: 0;
  left: 0px;
  right: 0;
  padding-top: 10rem;
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  transition: 500ms;
  background: rgba(0, 0, 0, 0.5);
}

.agora-video-player > div {
  border-radius: 5px !important;
  height: 100%;
  width: 100%;
}
.remote__content {
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0;
  height: 100%;
  width: 100%;
}
.pin {
  position: absolute;
  top: 3.5px;
  left: 3.5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pin button {
  height: 32px;
  width: 32px;
  background: rgba(0, 0, 0, 0.5);
  padding: 3px;
  border-radius: 50%;
  color: #cfcfcf;
}
.pin button:hover {
  color: #ffffff;
}

.indicator {
  margin-top: 2px !important;
  padding: 3px !important;
  height: 25px !important;
}

.place__holder {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid white;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.place__holder h3 {
  font-weight: bolder;
  font-size: 3rem;
  margin: 0;
  padding: 5px;
  min-width: 100px;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid rgb(201, 200, 200);
  color: rgb(201, 200, 200);
}

.video__icon {
  margin-top: 6px;
  height: 20px;
}

button:active {
  background-color: #dde8ff;
  color: #003bb3;
}

button {
  border: none;
  display: flex;
  padding: 3px 5px;
  font-size: 1rem;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
}

button:hover {
  background-color: #003bb3;
  color: #dde8ff;
}

button[disabled] {
  background-color: #e2e5ed;
  color: #878787;
}

button[disabled]:hover {
  background-color: #d3dffc;
}

.video-player > div {
  border-radius: 5px !important;
  box-shadow: var(--bs-box-shadow);
}
</style>
