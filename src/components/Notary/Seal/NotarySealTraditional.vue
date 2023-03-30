<template>
  <div class="company">
    <!-- User input field  -->
    <div v-if="is_notary" class="row mb-3">
      <!-- <div class="form-group col-4">
        <label for="companyName">Name:</label>
        <input
          type="text"
          class="input form-control"
          placeholder="Name"
          v-model="companyName"
          size="40"
          maxlength=""
        />
      </div> -->
      <div class="form-group col-4">
        <label for="companyAddress">SC Number:</label>
        <input
          type="text"
          class="input form-control"
          placeholder="SC Number"
          v-model="companyAddress"
          size="40"
          maxlength=""
        />
      </div>
      <!-- <div class="col-4">
        <label style="padding-right: 32px">RC Number:</label>
        <input
          type="text"
          v-model="companyRC"
          class="input form-control"
          placeholder="RC:12345"
        />
      </div> -->
    </div>

    <!-- <div class="row"> -->
    <div class="grid">
      <div v-if="is_notary" class="custom-sm">
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
          <div id="coy_number1" :style="`color: ${sealColor} !important`"></div>
          <img
            v-if="is_notary"
            width="380"
            height="380"
            ref="thumbSeal"
            src="@/assets/notary_seal_01.png"
            alt="Freedom Blog"
          />
          <canvas
            id="canvas1"
            width="320"
            height="320"
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
</template>

<script setup>
import domToImage from "dom-to-image";

import { ref, onMounted, watch, defineEmits } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";

const { token, companies, is_notary } = useGetters({
  token: "auth/token",
  companies: "company/companies",
  is_notary: "auth/is_notary",
});

// eslint-disable-next-line no-unused-vars
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
const sealColor = ref("#000000"); // red by default

const sealFrame = ref([
  require("@/assets/notary_seal_01.png"), //red
  // require("@/assets/notary_seal_05.png"), //gold
]);

const thumbSeal = ref("");
const selectedSeal = (e) => {
  thumbSeal.value.src = e.target.src;
  // seal_seal_01 is the red seal
  sealColor.value = thumbSeal.value?.src.includes("notary_seal_01")
    ? "#000000"
    : "#000000";
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
  ctx.font = "bold " + fontSize + " verdana ";
  ctx.beginPath();
  ctx.arc(155, 155, r, 0, Math.pow(r, 2), false);
  ctx.fillStyle = color;
  ctx.closePath();

  ctx.clearRect(0, top ? 0 : y, 600, y);
  space = space || 0;
  const numRadsPerLetter = (Math.PI - space * 2) / text?.length;
  ctx.save();
  ctx.translate(x, y);

  const k = top ? 1 : -1;
  ctx.rotate(-k * ((Math.PI - numRadsPerLetter) / 2 - space));

  for (let i = 0; i < text?.length; i++) {
    ctx.save();
    ctx.rotate(k * i * numRadsPerLetter);
    ctx.textAlign = "left";
    ctx.textBaseline = !top ? "top" : "bottom";
    ctx.backgroundColor = "rgba(255,255,255,0.1)";

    ctx.shadowColor = "";
    // ctx.shadowColor = "#464444";
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    //not sure
    ctx.fillText(text, x - i, y - i);

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
        type: "NotaryTraditionalSeal",
        category: "Upload",
      };
      savePrint(data.value);

      loading.value = false;
      emit("close", true);
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
};

watch(
  () => [
    companyName.value,
    companyAddress.value,
    companyRC.value,
    sealColor.value,
  ],
  ([newCnv, newCnv2, newCoy, newCol], [oldCnv, oldCnv2, oldCoy, oldCol]) => {
    if (
      companyName.value != "" &&
      companyAddress.value != "" &&
      companyRC.value != ""
    ) {
      isSealAdopt.value = true;
    }

    if (newCol != oldCol)
      // newCnv = companyName.value == undefined ? "Name" : companyName.value;
      newCnv2 =
        companyAddress.value == undefined ? "SC Number" : companyAddress.value;

    // updateCanvas(newCnv, 150, 150, 110, space, 1, "1.3em", sealColor.value);
    // updateCanvas(newCnv2, 149, 157, 107, space, 0, "1em", sealColor.value);
    updateCanvas(newCnv2, 159, 155, 139, space, 0, "1em", sealColor.value);

    if (newCnv != oldCnv)
      if (newCnv2 != oldCnv2)
        if (newCoy != oldCoy) {
          // updateCanvas(newCnv, 150, 150, 110, space, 1, "1.3em", sealColor.value);
          //original  updateCanvas(newCnv2, 149, 157, 107, space, 0, "1em", sealColor.value);

          const coy_number1 = document.getElementById("coy_number1");
          coy_number1.innerText = newCoy;
        }
  }
);
const rc = ref("");
onMounted(() => {
  getCompanies(token.value);
  // let name = companyName.value == undefined ? "Name" : companyName.value;
  let address =
    companyAddress.value == undefined ? "SC Number" : companyAddress.value;
  // rc.value =
  //   companyRC.value == undefined ? "NOTARY \n PUBLIC" : companyRC.value;
  const coy_number1 = document.getElementById("coy_number1");
  coy_number1.innerText = rc.value;

  // updateCanvas(name, 150, 150, 110, space, 1, "1.3em", sealColor.value);
  //original updateCanvas(address, 149, 157, 107, space, 0, "1em", sealColor.value);
  updateCanvas(address, 159, 155, 139, space, 0, "1em", sealColor.value);
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 2fr 8fr 2fr;
}

#canvas1 {
  border-radius: 50%;
  letter-spacing: 12px;
}

#coy_number1 {
  position: absolute;
  top: 156px;
  left: -1px;
  font-weight: normal;
  font-size: 20px;
  font-family: "verdana";
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  /* color: #c1353f; */
  text-shadow: 2px 2px 2px #464444;
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
