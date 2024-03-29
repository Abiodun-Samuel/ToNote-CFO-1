<!-- eslint-disable vue/no-mutating-props -->
<template>
  <!-- owner.isOwner == true -->
  <Vue3DraggableResizable
    v-if="tool.append_print == null"
    :key="tool.id"
    :initH="tool.tool_name == 'Photo' ? 100 : 30"
    :initW="Number(tool.tool_width)"
    :x="Number(tool.tool_pos_left)"
    :y="Number(tool.tool_pos_top)"
    v-model:x="x"
    v-model:y="y"
    :parent="true"
    :draggable="
      comp == 'audit' ? false : profile.id == tool.user_id || is_notary
    "
    :resizable="false"
    @drag-end="dragEnd($event, tool)"
    class="image-area"
    :class="tool.tool_class"
  >
    <div
      class="h-100"
      :style="{
        outline:
          '2px solid ' +
          ((owner.isOwner && profile.id == tool.user_id) ||
          owner.name.includes(hex.name)
            ? '#28C76F'
            : hex.code),
      }"
      @click="getUserId(tool)"
    >
      <div v-if="tool.tool_name == 'Photo'">
        <img src="@/assets/noimage.png" class="img-fluid" alt="Preview" />
      </div>
      <div
        v-else
        class="
          bg-fill
          w-100
          h-100
          d-flex
          justify-content-center
          align-items-center
        "
      >
        {{ tool.tool_name }}
      </div>
    </div>

    <template
      v-if="comp == 'audit' ? false : profile.id == tool.user_id || is_notary"
    >
      <span class="drag-me">
        <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
          <MoveIcon />
        </span>

        <span
          v-if="is_notary"
          title="Remove"
          class="btn btn-xs btn-secondary rounded-0 remove"
          @click="remove({ toolId: tool.id })"
          :data-id="tool.id"
        >
          <DeleteIcon />
        </span>
      </span>
    </template>
    <ParticipantName :userId="tool.user_id" @code="code" />
  </Vue3DraggableResizable>
  <Vue3DraggableResizable
    v-else
    :initW="Number(tool.tool_width)"
    :initH="Number(tool.tool_height)"
    :minW="tool.tool_name == 'Textarea' ? 62 : 95"
    :minH="tool.tool_name == 'Textarea' ? 24 : 30"
    :x="Number(tool.tool_pos_left)"
    :y="Number(tool.tool_pos_top)"
    :parent="true"
    v-model:x="x"
    v-model:y="y"
    v-model:h="tool.tool_height"
    v-model:w="tool.tool_width"
    @drag-end="dragEnd($event, tool)"
    @resize-end="resizeEnd($event, tool)"
    @activated="print(tool.tool_name)"
    :draggable="
      comp == 'audit' ? false : profile.id == tool.user_id || is_notary
    "
    :resizable="comp == 'audit' ? false : profile.id == tool.user_id"
    :class="[
      tool.tool_name == 'Textarea' ? 'text-wrapper z-indexed' : 'image-area',
    ]"
    :lockAspectRatio="['Seal', 'Stamp'].includes(tool.tool_name) ? true : false"
    :handles="['tl', 'tr', 'bl', 'br']"
    :class-name-active="{ 'active-class': tool.tool_name != 'Textarea' }"
    class-name-dragging="dragging-class"
    class-name-handle="handle-class"
    class-name-resizing="resizing-class"
  >
    <div
      v-if="tool.tool_name == 'Textarea'"
      :style="{ height: textHeight + 'px' }"
    >
      <textarea
        v-model="textValue"
        class="textareaTool w-100 h-100"
        :class="{ 'tool-border': activatedTool }"
        @blur="textInput($event.target, tool)"
        placeholder="Text"
        :style="{
          '--placeholder-color':
            (owner.isOwner && profile.id == tool.user_id) ||
            owner.name.includes(hex.name)
              ? '#28C76F'
              : hex.code,
        }"
        :disabled="
          comp == 'audit' ? true : tool.user_id != profile.id ? true : false
        "
      ></textarea>
    </div>
    <!-- <input
      v-if="tool.tool_name == 'Textarea'"
      type="text"
      v-model="tool.append_print.value"
      class="textareaTool h-100 w-100"
      @blur="textInput($event.target, tool)"
      placeholder="Input text here"
      style="
        border: none;
        outline: none;
        font-weight: 500;
        transition: width 0.25s;
        color: #000 !important;
      "
      :style="{
        '--placeholder-color':
          (owner.isOwner && profile.id == tool.user_id) ||
          owner.name.includes(hex.name)
            ? '#28C76F'
            : hex.code,
      }"
      :disabled="
        comp == 'audit' ? true : tool.user_id != profile.id ? true : false
      "
    /> -->

    <template v-else>
      <div
        class="grid"
        v-if="isToolLoading.id == tool.id && isToolLoading.active"
      >
        <span class="spinner-border" role="status"></span>
      </div>
      <img
        v-else
        :src="b64"
        @contextmenu.prevent="false"
        :style="[
          ['Draw', 'Upload', 'Type'].includes(tool.append_print.category)
            ? 'object-fit: scale-down'
            : '',
        ]"
      />
    </template>

    <template
      v-if="comp == 'audit' ? false : profile.id == tool.user_id || is_notary"
    >
      <span class="drag-me">
        <span title="Drag" class="btn btn-xs btn-secondary rounded-0 movement">
          <MoveIcon />
        </span>

        <span
          v-if="tool.tool_name != 'Textarea'"
          title="Edit"
          class="btn btn-xs btn-secondary rounded-0 edit"
          @click="getUserId(tool)"
        >
          <EditIcon />
        </span>

        <span
          v-if="is_notary"
          title="Remove"
          class="btn btn-xs btn-secondary rounded-0 remove"
          @click="remove({ printId: tool.append_print.id, toolId: tool.id })"
          :data-id="tool.id"
        >
          <DeleteIcon />
        </span>
      </span>
    </template>
    <ParticipantName :userId="tool.user_id" @code="code" />
  </Vue3DraggableResizable>

  <Teleport to="body">
    <ModalComp
      :show="affixModal"
      :footer="false"
      :size="'modal-lg'"
      @close="affixModal = false"
    >
      <template #header>
        <h4 class="modal-title">Signature box</h4>
      </template>

      <template #body>
        <SignaturePrintFull
          @selectedSignature="savePrint"
          @closeModal="affixModal = false"
        />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp
      :show="initialModal"
      :footer="false"
      :size="'modal-md'"
      @close="initialModal = false"
    >
      <template #header>
        <h4 class="modal-title">Initial signature box</h4>
      </template>

      <template #body>
        <SignaturePrintInitial
          @selectedSignature="savePrint"
          @closeModal="initialModal = false"
        />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp
      :show="sealModal"
      :footer="false"
      :size="'modal-md'"
      @close="sealModal = false"
    >
      <template #header>
        <h4 class="modal-title">Seal box</h4>
      </template>

      <template #body>
        <SealAppend @close="sealModal = false" @selectedSeal="savePrint" />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp
      :show="stampModal"
      :footer="false"
      :size="'modal-md'"
      @close="stampModal = false"
    >
      <template #header>
        <h4 class="modal-title">Stamp box</h4>
      </template>

      <template #body>
        <StampAppend @close="stampModal = false" @selectedStamp="savePrint" />
      </template>
    </ModalComp>
  </Teleport>

  <Teleport to="body">
    <ModalComp
      :show="uploadImage"
      :footer="false"
      :size="'modal-lg'"
      @close="uploadImage = false"
    >
      <template #header>
        <h4 class="modal-title">Image management</h4>
      </template>

      <template #body>
        <PassportPhotograph
          @close="uploadImage = false"
          @selectedPassport="savePrint"
        />
      </template>
    </ModalComp>
  </Teleport>
</template>

<script setup>
import ModalComp from "@/components/ModalComp.vue";
import SealAppend from "@/components/Notary/Seal/SealAppend.vue";
import StampAppend from "@/components/Notary/Stamp/StampAppend.vue";
import SignaturePrintFull from "@/components/Signature/SignaturePrintFull.vue";
import SignaturePrintInitial from "@/components/Signature/SignaturePrintInitial.vue";
import PassportPhotograph from "@/components/Passport/PassportPhotograph.vue";
import ParticipantName from "@/components/Document/Edit/ParticipantName.vue";
import MoveIcon from "@/icons/MoveIcon.vue";
import EditIcon from "@/icons/EditIcon.vue";
import DeleteIcon from "@/icons/DeleteIcon.vue";

import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
import { useActions, useGetters } from "vuex-composition-helpers/dist";
import { useToast } from "vue-toast-notification";

import { useDragResizeComposable } from "@/composables/useDragResize";
import { useConvertToBase64Composable } from "@/composables/useDataURL";
const { dragEnd, resizeEnd } = useDragResizeComposable();

const { toBase64 } = useConvertToBase64Composable();

const toast = useToast();
const props = defineProps({ tool: Object, owner: Object, comp: String });

const { profile, isToolLoading, is_notary } = useGetters({
  profile: "auth/profile",
  isToolLoading: "document/isToolLoading",
  is_notary: "auth/is_notary",
});

const { editTools } = useActions({
  editTools: "document/editTools",
});

const hex = ref("");
const code = (params) => (hex.value = params);

const toolWidth = ref(0);
const toolHeight = ref(0);
const b64 = ref("");
watch(
  () => props.tool,
  (newTool, oldTool) => {
    if (newTool != oldTool) {
      toolWidth.value = Number(newTool.tool_width);
      toolHeight.value = Number(newTool.tool_height);
      if (newTool.append_print != null) {
        toBase64(newTool.append_print.file, (dataUrl) => {
          if (dataUrl != "") {
            b64.value = dataUrl;
          }
        });
      }
    }
  },
  { deep: true }
);

const x = ref(Number(props.tool.tool_pos_left));
const y = ref(Number(props.tool.tool_pos_top));

const documentId = ref(null);
const sealModal = ref(false);
const stampModal = ref(false);
const initialModal = ref(false);
const affixModal = ref(false);
const uploadImage = ref(false);
const toolId = ref(null);

const getUserId = (params) => {
  if (props.comp == "audit") return;
  const toaster = (message) => {
    toast.error(message, {
      timeout: 5000,
      position: "top-right",
    });
  };

  if (params.user_id != profile.value.id) {
    if (params.tool_name == "Signature" || params.tool_name == "Initial")
      return toaster("Sorry, you are not permitted to sign here");
    if (params.tool_name == "Seal")
      return toaster("Sorry, you cannot upload this seal");
    if (params.tool_name == "Stamp")
      return toaster("Sorry, you cannot upload this stamp");
    if (params.tool_name == "Photo")
      return toaster("Sorry, you cannot upload this passport");
  }

  if (params.tool_name == "Seal") sealModal.value = true;
  if (params.tool_name == "Stamp") stampModal.value = true;
  if (params.tool_name == "Initial") initialModal.value = true;
  if (params.tool_name == "Signature") affixModal.value = true;
  if (params.tool_name == "Photo") uploadImage.value = true;

  documentId.value = params.document_upload_id;
  toolId.value = params.id;
};

const textValue = ref(
  props.tool.append_print?.value != "" ? props.tool.append_print?.value : ""
);

const textInput = (e, params) => {
  activatedTool.value = false;

  const data = {
    append_print_id: params.append_print.id,
    document_upload_id: params.document_upload_id,
    value: e.value,
    type: "Text",
    category: "Type",
    tool_width: textWidth.value.toString(),
  };
  editTools({ id: params.id, payload: data });
};

const savePrint = (params) => {
  params.document_upload_id = documentId.value;
  editTools({ id: toolId.value, payload: params });
};

const emit = defineEmits(["remove"]);
const remove = (params) => {
  emit("remove", params);
};

const activatedTool = ref(false);
const print = (params) => {
  if (params == "Textarea") activatedTool.value = true;
};

const textWidth = ref(62);
const textHeight = ref(24);
const autoResize = {
  minWidth: 62,
  maxWidth: 600,
  buffer: 0,

  resize: function (el) {
    const test = document.createElement("pre");
    test.className = "input-test";
    test.innerHTML = el.value;
    el.parentNode.appendChild(test);

    let numberOfLineBreaks = (el.value.match(/\n/g) || []).length;
    // min - height + lines x line - height + padding + border
    let newHeight = 10 + numberOfLineBreaks * 20 + 12 + 2;

    const calculatedWidth = Math.min(
      Math.max(test.offsetWidth + this.buffer, this.minWidth),
      this.maxWidth
    );
    el.parentElement.style.width = calculatedWidth + "px";
    // el.style.width = calculatedWidth + "px";
    textWidth.value = calculatedWidth;

    // const calculatedHeight = newHeight;
    const calculatedHeight =
      calculatedWidth < 600 ? newHeight : el.scrollHeight;
    el.parentElement.style.height = calculatedHeight + "px";
    // el.style.height = calculatedHeight + "px";
    textHeight.value = calculatedHeight;

    el.parentNode.removeChild(test);
  },

  init: function () {
    let els = document.getElementsByClassName("textareaTool"),
      i = els.length;

    while (i--) {
      els[i].addEventListener(
        "keydown",
        function () {
          autoResize.resize(this);
        },
        false
      );

      els[i].addEventListener(
        "keyup",
        function () {
          autoResize.resize(this);
        },
        false
      );

      this.resize(els[i]);
    }
  },
};

onMounted(() => {
  autoResize.init();

  if (props.tool.append_print != null) {
    toBase64(props.tool.append_print.file, (dataUrl) => {
      if (dataUrl != "") {
        b64.value = dataUrl;
      }
    });
  }
});
</script>

<style>
.input-test {
  display: inline;
  visibility: hidden;
}
/* input::-webkit-input-placeholder {
  color: var(--placeholder-color);
}

input:-moz-placeholder {
  color: var(--placeholder-color);
}

input::-moz-placeholder {
  color: var(--placeholder-color);
}

input:-ms-input-placeholder {
  color: var(--placeholder-color);
} */
</style>

<style scoped>
.z-indexed {
  z-index: 1;
}
textarea::-webkit-input-placeholder {
  color: var(--placeholder-color);
}

textarea:-moz-placeholder {
  color: var(--placeholder-color);
}

textarea::-moz-placeholder {
  color: var(--placeholder-color);
}

textarea:-ms-input-placeholder {
  color: var(--placeholder-color);
}

.tool-border {
  outline: 1px solid #003bb3 !important;
}

.z-indexed {
  z-index: 1;
}

.grid {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  font-size: 12px;
}
.grid {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.spinner-border {
  width: 1rem;
  height: 1rem;
  font-size: 12px;
}
</style>
