<template>
  <div
    v-if="domId"
    class="agora__player shadow"
    :id="`user-container-${domId}`"
  >
    <div class="video-player" :id="`user-${domId}`"></div>
    <div class="place__holder" v-if="!localVideo.muted ? '' : 'd-none'">
      <h3>
        {{ profile.initials }}
      </h3>
    </div>
    <div class="agoraplayer__icons">
      <button
        @click="toggleCamera"
        :class="localVideo.muted ? 'shadow icon__off' : 'shadow icon__on'"
      >
        <Icon
          :icon="
            localVideo.muted ? 'carbon:video-off-filled' : 'carbon:video-filled'
          "
          height="20"
          width="20"
        />
      </button>
      <button
        :class="localAudio.muted ? 'shadow icon__off' : 'shadow icon__on'"
        @click="toggleMic"
      >
        <Icon
          :icon="
            localAudio.muted ? 'fa:microphone-slash' : 'fa-solid:microphone'
          "
          height="20"
          width="20"
        />
      </button>
      <!-- <AudioSignal v-if="!localAudio.muted" :audioLevel="audioLevel" />
      {{ audioSignal }} -->
      <!-- 
      <Icon
        v-if="localAudio.muted"
        icon="fa:microphone-slash"
        class="text-danger"
        height="15"
        width="15"
      /> -->
    </div>
  </div>
</template>

<script>
import store from "@/store";
import { Icon } from "@iconify/vue";
import AudioSignal from "@/components/Video/Player/AudioSignal.vue";

export default {
  props: ["localAudio", "localVideo", "domId"],
  data() {
    return {
      volumeLevel: 0,
    };
  },
  computed: {
    profile() {
      return store.getters["auth/profile"];
    },
    audioSignal() {
      // setInterval(() => {
      const value = (Number(this.localAudio.getVolumeLevel()) * 100).toFixed(2);
      return value;
      // }, 10);
    },
  },
  // eslint-disable-next-line vue/no-unused-components
  components: { Icon, AudioSignal },
  methods: {
    async toggleCamera() {
      if (this.localVideo.muted) {
        await this.localVideo.setMuted(false);
        this.$toast.success("Camera is On", { position: "top-right" });
      } else {
        await this.localVideo.setMuted(true);
        this.$toast.warning("Camera is Off", { position: "top-right" });
      }
    },
    async toggleMic() {
      if (this.localAudio.muted) {
        await this.localAudio.setMuted(false);
        this.$toast.success("Microphone is On", { position: "top-right" });
      } else {
        await this.localAudio.setMuted(true);
        this.$toast.warning("Microphone is Off", { position: "top-right" });
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      if (this.localVideo) {
        this.localVideo.play(
          `user-${this.domId}`,
          { fit: "cover", mirror: true },
          (err) => {
            if (err && err.status !== "aborted") {
              console.warn("trigger autoplay policy");
            }
          }
        );
      }
      // if (this.localAudio) {
      //   this.localAudio.play((err) => {
      //     if (err && err.status !== "aborted") {
      //       console.warn("trigger autoplay policy");
      //     }
      //   });
      // }
    });
  },
  beforeUnmount() {
    this.$emit("leave-channel");
  },
};
</script>

<style>
.agora__player {
  height: 420px;
  width: 100%;
  border-radius: 5px !important;
  position: relative;
  background-color: #2f2f2f;
}

.agora__player .video-player {
  height: 100%;
  width: 100%;
}

.agora__player .video-player > div {
  border-radius: 5px !important;
}

.agora__player .place__holder {
  position: absolute;
  border-radius: 5px !important;
  width: 100%;
  height: 100%;
  border: 2px solid white;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.agora__player .place__holder h3 {
  font-weight: bolder;
  font-size: 5rem;
  margin: 0;
  padding: 5px;
  min-width: 200px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid rgb(201, 200, 200);
  color: rgb(201, 200, 200);
}
.agora__player .agoraplayer__icons {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.agora__player .icon__off {
  border-radius: 50%;
  height: 45px;
  width: 45px;
  border: 1.5px solid var(--bs-danger);
  background: transparent;
  padding: 3px;
  margin: 5px;
  font-size: 1rem;
  color: var(--bs-danger);
}
.agora__player .icon__on:hover {
  background: var(--bs-gray-100);
}
.agora__player .icon__on {
  border-radius: 50%;
  height: 45px;
  width: 45px;
  border: 1.5px solid var(--bs-gray-200);
  background: transparent;
  padding: 3px;
  font-size: 1rem;
  margin: 5px;
  color: var(--bs-gray-200);
}
</style>
