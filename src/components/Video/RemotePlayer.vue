<template>
  <div class="video-player" :id="`user-${remoteUid}`"></div>
</template>

<script>
export default {
  props: ["remoteAudio", "remoteVideo", "remoteUid", "remoteStream"],
  updated() {
    this.$nextTick(function () {
      if (this.remoteVideo && !this.remoteVideo.isPlaying) {
        this.remoteVideo.play(
          `user-${this.remoteUid}`,
          { fit: "cover", mirror: true },
          (err) => {
            if (err && err.status !== "aborted") {
              console.warn("trigger autoplay policy");
            }
          }
        );
      }
      if (this.remoteAudio && !this.remoteAudio?.isPlaying) {
        this.remoteAudio?.play();
      }
    });
  },
  beforeUnmount() {
    if (this.remoteVideo) {
      if (this.remoteVideo?.isPlaying) {
        this.remoteVideo?.stop();
      }
      this.remoteVideo?.close();
    }
    // if (this.remoteAudio) {
    //   if (this.remoteAudio?.isPlaying) {
    //     this.remoteAudio?.stop();
    //   }
    //   this.remoteAudio?.close();
    // }
  },
};
</script>

<style>
</style>
