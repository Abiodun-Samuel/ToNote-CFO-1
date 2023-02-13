<template>
  <div>
    <div class="recorder-container">
      <div class="recorder-style recorder-layout recorder-row">
        <div class="btn-wrap btn-group">
          <div class="recorder-arrow" id="time">
            <div class="btn me-1">
              <span class="digit text-danger" id="hr">00</span>
              <span class="txt text-danger"> : </span>
              <span class="digit text-danger" id="min">00</span>
              <span class="txt text-danger"> : </span>
              <span class="digit text-danger" id="sec">00</span>
              <span class="txt"></span>
              <span class="digit text-danger" id="count" style="display: none"
                >00</span
              >
            </div>
          </div>
          <!-- <div class="recorder-arrow d-flex align-items-center">
            <button
              type="button"
              class="btn btn-sm me-1 btn-primary"
              id="stop"
              disabled
              @click="stop"
            >
              Stop
            </button>
          </div>
          <div class="recorder-arrow d-flex align-items-center">
            <button
              type="button"
              id="pauseResume"
              class="btn btn-sm btn-primary me-1 waves-effect"
              @click="pauseResume"
            >
              Pause
            </button>
          </div>
          <div class="recorder-arrow d-flex align-items-center">
            <button
              type="button"
              @click="recordScreen"
              class="btn btn-sm me-1 btn-primary record"
            >
              <Icon class="size text-danger" icon="ph:record-fill" /> Start
              Recording
            </button>
          </div>

          <div class="recorder-arrow d-flex align-items-center">
            <a
              id="download"
              style="display: none"
              class="btn btn-sm me-1 btn-primary"
              ><Icon class="size" icon="fa-solid:cloud-download-alt" /> Download
              Recording</a
            >
          </div>

          <div class="recorder-arrow d-flex align-items-center">
            <button class="btn btn-sm btn-primary waves-effect" @click="done">
              Complete Session
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>

  <!-- <ModalComp
    :show="confirmModal"
    :size="'modal-sm'"
    @close="confirmModal = false"
  >
    <template #header>
      <h4 class="modal-title text-success mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Notice
      </h4>
    </template>

    <template #body>
      <p class="text-center">
        Remember to let people in the meeting know they are being recorded
      </p>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="confirmRecording">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Ok
      </button>
    </template>
  </ModalComp> -->

  <!-- <ModalComp :show="doneModal" :size="'modal-sm'" @close="doneModal = false">
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <p class="text-center">
        <i>Please confirm that you are done editing.</i>
      </p>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="confirmEdit">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Confirm
      </button>
    </template>
  </ModalComp> -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useGetters } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
// import ModalComp from "@/components/ModalComp.vue";
// import { Icon } from "@iconify/vue";
import moment from "moment";
import "jquery/dist/jquery.min";
import $ from "jquery";

const route = useRouter();

const { userDocument } = useGetters({
  userDocument: "document/userDocument",
});

const dateTime = () => {
  return moment().format("Do MMM YYYY");
};
const date = dateTime();

let shouldStop = false;
let stopped = false;
let recordedChunks = [];

let timer = false;
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;

// const doneModal = ref(false);
const mimeType = "video/webm";
const recordStream = [];
const confirmModal = ref(false);

const startRecord = () => {
  $(".record").prop("disabled", true).hide();
  $("#stop").prop("disabled", false).show();
  $("#download").css("display", "none");
  $("#pauseResume").css("display", "block");
  $("#time").css("display", "block");
};

const stopRecord = () => {
  $("#stop").hide();
  $(".record").show().prop("disabled", false);
  resetTime();
  $("#download").css("display", "block");
  $("#pauseResume").css("display", "none");
  $("#time").css("display", "none");
};

// const stop = () => {
//   shouldStop = true;
//   timer = false;
// };

const handleRecord = function ({ stream, mimeType }) {
  stopped = false;
  startRecord();
  timer = true;
  stopWatch();

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }

    if (shouldStop === true && stopped === false) {
      mediaRecorder.stop();
      stopped = true;
    }
    recordStream.push(mediaRecorder);
    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, {
        type: mimeType,
      });
      recordedChunks = [];
      const filename = userDocument.value.title + "_" + date;
      let downloadLink = document.getElementById("download");
      downloadLink.href = URL.createObjectURL(blob);

      downloadLink.download = `${filename || "recording"}.webm`;
      stopRecord();

      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
        track.enabled = false;
      });

      let videoFile = URL.createObjectURL(blob);
      route.push({
        name: "document.downloadrecording",
        query: { record_file: videoFile },
      });
    };
  };
  console.log(recordStream);
  mediaRecorder.start(200);
};

// const recordScreen = async () => {
//   shouldStop = false;
//   confirmModal.value = true;
// };

// eslint-disable-next-line no-unused-vars
const confirmRecording = async () => {
  confirmModal.value = false;
  if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
    return window.alert("Screen Record not supported!");
  }
  let stream = null;
  const displayStream = await navigator.mediaDevices.getDisplayMedia({
    video: { cursor: "motion" },
    audio: { echoCancellation: true },
  });

  const audioContext = new AudioContext();

  const voiceStream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: true },
    video: false,
  });
  const userAudio = audioContext.createMediaStreamSource(voiceStream);

  const audioDestination = audioContext.createMediaStreamDestination();
  userAudio.connect(audioDestination);

  if (displayStream.getAudioTracks().length > 0) {
    const displayAudio = audioContext.createMediaStreamSource(displayStream);
    displayAudio.connect(audioDestination);
  }

  const tracks = [
    ...displayStream.getVideoTracks(),
    ...audioDestination.stream.getTracks(),
  ];
  stream = new MediaStream(tracks);
  handleRecord({ stream, mimeType });
};
// const pauseResume = (e) => {
//   const mRecorder = recordStream[0];
//   console.log(mRecorder.state);
//   if (mRecorder.state === "recording") {
//     timer = false;
//     mRecorder.pause();
//     e.target.innerHTML =
//       "<Icon class='size' icon='grommet-icons:resume' /> Resume";
//   } else if (mRecorder.state === "paused") {
//     timer = true;
//     stopWatch();
//     e.target.innerHTML = "<Icon class='size' icon='ic:sharp-pause' /> Pause";
//     mRecorder.resume();
//   }
//   return false;
// };

// Timer
function resetTime() {
  timer = false;
  hour = 0;
  minute = 0;
  second = 0;
  count = 0;
  document.getElementById("hr").innerHTML = "00";
  document.getElementById("min").innerHTML = "00";
  document.getElementById("sec").innerHTML = "00";
  document.getElementById("count").innerHTML = "00";
}

function stopWatch() {
  if (timer) {
    count++;

    if (count == 100) {
      second++;
      count = 0;
    }

    if (second == 60) {
      minute++;
      second = 0;
    }

    if (minute == 60) {
      hour++;
      minute = 0;
      second = 0;
    }

    let hrString = hour;
    let minString = minute;
    let secString = second;
    let countString = count;

    if (hour < 10) {
      hrString = "0" + hrString;
    }

    if (minute < 10) {
      minString = "0" + minString;
    }

    if (second < 10) {
      secString = "0" + secString;
    }

    if (count < 10) {
      countString = "0" + countString;
    }

    document.getElementById("hr").innerHTML = hrString;
    document.getElementById("min").innerHTML = minString;
    document.getElementById("sec").innerHTML = secString;
    document.getElementById("count").innerHTML = countString;
    setTimeout(stopWatch, 10);
  }
}

// const done = () => {
//   doneModal.value = true;
// };
// const confirmEdit = () => {
//   console.log(recordStream.length);
//   if (recordStream.length === 0) {
//     route.push({
//       name: "Document",
//       query: { page: "video-sign" },
//     });
//     // window.location.href =
//     //   redirectToUserDashboard.value + "/redirecting?qt=" + token.value;
//   } else {
//     shouldStop = true;
//     timer = false;
//   }
// };

onMounted(() => {
  // confirmRecording();
  // redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_LIVE;
});
</script>

<style scoped>
.size {
  width: 14px;
  height: 14px;
}
#stop,
#pauseResume,
#time {
  display: none;
}
</style>
