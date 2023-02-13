<template>
  <div>
    <button @click="onClick">start</button>
    <button @click="stopRecording">stop</button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import socket from "@/utils/event-bus";
import { useGetters } from "vuex-composition-helpers/dist";
import { slugify } from "@/utils/helper";

const { profile, session_details } = useGetters({
  profile: "auth/profile",
  session_details: "schedule/virtual_session_details",
});

let dataChunks = ref([]);
let mediaRecorder = ref(null);
let voiceStream = ref(null);
let screenStream = ref(null);
let loading = ref(true);
let recording = ref(false);

const startRecording = () => {
  console.log(screenStream.value);
  console.log(voiceStream.value);
  console.log(mediaRecorder.value);

  if (screenStream.value && voiceStream.value && !mediaRecorder.value) {
    // set recording state to true
    recording.value = true;

    //  videoRef.current.removeAttribute("src");
    //  linkRef.current.removeAttribute("href");
    //  linkRef.current.removeAttribute("download");

    let mediaStream;
    if (voiceStream.value === "unavailable") {
      mediaStream = screenStream;
    }

    // update media streams (... spread operator)
    else {
      mediaStream = new MediaStream([
        ...screenStream.value.getVideoTracks(),
        ...voiceStream.value.getAudioTracks(),
      ]);
    }

    // mediaRecorder instance
    mediaRecorder.value = new MediaRecorder(mediaStream);
    mediaRecorder.value.ondataavailable = ({ data }) => {
      dataChunks.value.push(data);
      socket.emit("screenData:start", {
        username: profile.value.first_name,
        session_id: session_details.value.id,
        session_title: slugify(session_details.value.title),
        data,
      });
    };

    mediaRecorder.value.onstop = stopRecording;
    // ..
    mediaRecorder.value.start(250);
  }
};

const stopRecording = () => {
  recording.value = true;

  socket.emit("screenData:end", profile.value.first_name);
  //   socket.emit("screenData:end", {
  //     username: profile.value.first_name,
  //     session_id: session_details.value.id,
  //     session_title: session_details.value.title,
  //   });
  //   const videoBlob = new Blob(dataChunks, {
  //     type: "video/webm", //... blob type of video web media
  //   });
  //   const videoSrc = URL.createObjectURL(videoBlob); //
  //...Refs and video source
  //   videoRef.current.src = videoSrc;
  //   linkRef.current.href = videoSrc;
  //   linkRef.current.download = `${Date.now()}-${username.current}.webm`;
  //...
  mediaRecorder.value = null;
  dataChunks.value = [];
};

// bind the onClick method to a DOM button
// to start or stop recording
const onClick = () => {
  if (!recording.value) {
    startRecording();
  } else {
    if (mediaRecorder.value) {
      mediaRecorder.value.stop();
    }
  }
};

watch(
  screenStream.value,
  ([newDoc], [oldDoc]) => {
    if (newDoc != oldDoc) {
      console.log({ newDoc });
      console.log({ oldDoc });
    }
  },
  { deep: true }
);

onMounted(() => {
  (async () => {
    if (navigator.mediaDevices.getDisplayMedia) {
      try {
        //  grant screen
        screenStream.value = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const _voiceStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        voiceStream.value = _voiceStream;
      } catch (err) {
        // exception handling
        loading.value = false;
        console.log("getDisplayMedia", err);
      }
    } else {
      loading.value = false;
      console.log("getDisplayMedia is not supported...");
    }
  })();

  //   (async () => {
  //     if (navigator.mediaDevices.getUserMedia) {
  //       if (screenStream.value) {
  //         try {
  //           const _voiceStream = await navigator.mediaDevices.getUserMedia({
  //             audio: true,
  //           });
  //           voiceStream.value = _voiceStream;
  //         } catch (e) {
  //           console.error("*** getUserMedia", e);
  //           voiceStream.value = "unavailable";
  //         } finally {
  //           loading.value = false;
  //           // setLoading(false)
  //         }
  //       }
  //     } else {
  //       console.warn("*** getUserMedia not supported");
  //       loading.value = false;
  //     }
  //   })();
});
</script>

<style lang="scss" scoped>
</style>