<template>
  <div class="my-1 d-flex align-items-center gap-2">
    <button
      @click="seal_type = 'traditional'"
      :class="
        seal_type == 'traditional'
          ? 'btn btn-sm btn-primary'
          : 'btn btn-sm btn-outline-primary'
      "
    >
      Traditional Seal
    </button>
    <!-- <button
      @click="seal_type = 'digital'"
      :class="
        seal_type == 'digital'
          ? 'btn btn-sm btn-primary'
          : 'btn btn-sm btn-outline-primary'
      "
    >
      Digital Seal
    </button> -->
  </div>
  <hr />
  <div v-if="seal_type == 'digital'" class="company">
    <!-- User input field  -->
    <div v-if="userProfile?.role[0] == 'Notary'" class="row mb-3">
      <div class="form-group col-4">
        <label for="companyName">Name:</label>
        <input
          type="text"
          class="input form-control"
          placeholder="Name"
          v-model="companyName"
          size="40"
          maxlength=""
        />
      </div>
      <!-- <div class="form-group col-4">
        <label for="companyAddress">Company Address:</label>
        <input
          type="text"
          class="input form-control"
          placeholder="Your place, State"
          v-model="companyAddress"
          size="40"
          maxlength=""
        />
      </div> -->
      <div class="col-4">
        <label style="padding-right: 32px">SC Number:</label>
        <input
          type="text"
          v-model="companyRC"
          class="input form-control"
          placeholder="SC No:12345"
        />
      </div>
    </div>

    <!-- <div class="row"> -->
    <div class="grid">
      <div v-if="userProfile?.role[0] == 'Notary'" class="custom-sm">
        <div v-for="(seal, index) in sealFrame" :key="index">
          <div
            style="width: 100px; height: 100px"
            class="sealList mb-1 active"
            data-id="1"
          >
            <img
              @click="selectedSeal"
              ref="selected"
              :src="seal"
              alt="seal gray"
              class="img-fluid"
            />
          </div>
        </div>
      </div>

      <div class="grid-8">
        <div class="position-relative" style="width: max-content" ref="capture">
          <div id="coy_number1"></div>
          <div id="coy_number2"></div>
          <img
            v-if="userProfile?.role[0] == 'Notary'"
            width="380"
            height="380"
            ref="thumbSeal"
            src="@/assets/notary_seal_02.png"
            alt="Freedom Blog"
          />
          <canvas
            id="canvas1"
            width="300"
            height="300"
            style="
              transform: translate(-50%, -50%);
              position: absolute;
              top: 50%;
              left: 190px;
            "
          ></canvas>
        </div>
      </div>

      <div class="preview">
        <template v-if="data.file == null">
          <img src="@/assets/empty.png" class="img-fluid" alt="Seal" />
        </template>
        <template v-else>
          <img :src="data.file" class="img-fluid" alt="Seal" />
        </template>
      </div>
    </div>
    <!-- </div> -->

    <button
      type="button"
      class="btn btn-primary d-block ms-auto mt-2"
      @click="captureSeal"
      :disabled="!isSealAdopt"
    >
      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
      <span>Adopt</span>
    </button>
  </div>
  <div v-if="seal_type == 'traditional'">
    <NotarySealTraditional @close="$emit('close')" />
  </div>
</template>

<script setup>
import domToImage from "dom-to-image";
import NotarySealTraditional from "@/components/Notary/Seal/NotarySealTraditional.vue";

import { ref, onMounted, watch, computed, defineEmits } from "vue";
import { useStore } from "vuex";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const store = useStore();
const { token, companies } = useGetters({
  token: "auth/token",
  companies: "company/companies",
});
const userProfile = computed(() => store.getters["auth/profile"]);
const { savePrint, getCompanies } = useActions({
  savePrint: "print/savePrint",
  getCompanies: "company/getCompanies",
});

const loading = ref(false);
const companyName = ref(companies.value.company_name);
const companyAddress = ref(companies.value.address);
const companyRC = ref(companies.value.registration_company_number);
const base64Url = ref("");
const capture = ref("");
const data = ref("");
const isSealAdopt = ref(false);
const seal_type = ref("traditional");
const rc = ref("");

const sealFrame = ref([
  require("@/assets/notary_seal_02.png"),
  require("@/assets/notary_seal_04.png"),
  require("@/assets/notary_seal_03.png"),
]);

const thumbSeal = ref("");
const selectedSeal = (e) => {
  thumbSeal.value.src = e.target.src;
};

const r = 120;
const space = Math.PI / 12;

const updateCanvas = function (
  text,
  x,
  y,
  radius,
  space,
  top,
  fontSize,
  color
) {
  const canvas = document.getElementById("canvas1"),
    ctx = canvas.getContext("2d");

  ctx.font = "normal " + fontSize + " verdana ";
  ctx.beginPath();
  ctx.arc(155, 155, r, 0, Math.pow(r, 2), false);
  ctx.fillStyle = color;
  ctx.closePath();

  ctx.clearRect(0, top ? 0 : y, 600, y);
  space = space || 0;
  const numRadsPerLetter = (Math.PI - space * 2) / text.length;
  ctx.save();
  ctx.translate(x, y);

  const k = top ? 1 : -1;
  ctx.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));

  for (let i = 0; i < text.length; i++) {
    ctx.save();
    ctx.rotate(k * i * numRadsPerLetter);
    ctx.textAlign = "left";
    ctx.textBaseline = !top ? "top" : "bottom";
    ctx.backgroundColor = "rgba(255,255,255,0.1)";
    const cText = text[i].split(" ").join(String.fromCharCode(8201));
    ctx.fillText(cText.toUpperCase(), 0, -k * radius);
    ctx.restore();
  }

  base64Url.value = canvas.toDataURL("image/png");

  ctx.restore();
};

const emit = defineEmits(["close"]);
const captureSeal = () => {
  loading.value = true;
  isSealAdopt.value = false;
  const scale = 2;

  domToImage
    .toPng(capture.value, {
      quality: 1,
      height: capture.value.offsetHeight * scale,
      style: {
        transform: `scale(${scale}) translate(${
          capture.value.offsetWidth / 2 / scale
        }px, ${capture.value.offsetHeight / 2 / scale}px)`,
      },
      width: capture.value.offsetWidth * scale,
    })
    .then((dataUrl) => {
      data.value = {
        file: dataUrl,
        type: "NotaryDigitalSeal",
        category: "Upload",
      };

      console.log(data.value);
      savePrint(data.value);

      loading.value = false;
      emit("close", true);
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
};

watch(
  () => [companyName.value, companyAddress.value, companyRC.value],
  ([newCnv, newCnv2, newCoy], [oldCnv, oldCnv2, oldCoy]) => {
    if (
      companyName.value != "" &&
      companyAddress.value != "" &&
      companyRC.value != ""
    ) {
      isSealAdopt.value = true;
    }

    if (newCnv != oldCnv) {
      const coy_number2 = document.getElementById("coy_number2");
      coy_number2.innerText = newCnv;
      // return updateCanvas(newCnv, 150, 150, 110, space, 1, "1.3em", "#000");
    }

    if (newCnv2 != oldCnv2)
      return updateCanvas(newCnv2, 149, 157, 107, space, 0, "1em", "#000");

    if (newCoy != oldCoy) {
      const coy_number1 = document.getElementById("coy_number1");
      coy_number1.innerText = newCoy;
    }
  }
);

onMounted(() => {
  getCompanies(token.value);
  //   let name = companyName.value == undefined ? "Name" : companyName.value;
  //  let address =
  //    companyAddress.value == undefined ? "Address" : companyAddress.value;
  rc.value =
    companyRC.value == undefined ? `NOTARY \n PUBLIC` : companyRC.value;
  // rc.value = companyRC.value == undefined ? `SC NUMBER` : companyRC.value;
  const coy_number1 = document.getElementById("coy_number1");
  coy_number1.innerText = rc.value;

  //   updateCanvas(name, 150, 150, 110, space, 1, "1.3em", "#000");
  //  updateCanvas(address, 149, 157, 107, space, 0, "1em", "#000");
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 2fr 8fr 2fr;
}

#canvas1 {
  border-radius: 50%;
  letter-spacing: 20px;
}

#coy_number2 {
  position: absolute;
  top: 155px;
  left: -1px;
  font-weight: normal;
  font-size: 20px;
  font-family: "verdana";
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  color: #000;
  /* text-shadow: 1px 4px 6px #190000; */
  font-weight: bold;
}
#coy_number1 {
  position: absolute;
  top: 185px;
  left: -1px;
  font-weight: normal;
  font-size: 20px;
  font-family: "verdana";
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  color: #000;
  /* text-shadow: 1px 4px 6px #190000; */
}

.input {
  text-transform: uppercase;
}

@media screen and (max-width: 991.5px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .custom-sm {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .preview {
    display: none;
  }
}
</style>
