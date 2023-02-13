<!-- eslint-disable vue/no-mutating-props -->
<template>
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
      profile.id == tool.user_id || owner.isOwner == true || is_notary
    "
    :resizable="false"
    @drag-end="dragEnd($event, tool)"
    class="image-area"
    :class="tool.tool_class"
  >
    <div class="h-100" @click="getUserId(tool)">
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
      v-if="profile.id == tool.user_id || owner.isOwner == true || is_notary"
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
    <ParticipantName :userId="tool.user_id" />
  </Vue3DraggableResizable>
  <Vue3DraggableResizable
    v-else
    :initW="Number(tool.tool_width)"
    :initH="Number(tool.tool_height)"
    :minW="95"
    :minH="30"
    :x="Number(tool.tool_pos_left)"
    :y="Number(tool.tool_pos_top)"
    :parent="true"
    v-model:x="x"
    v-model:y="y"
    v-model:h="toolHeight"
    v-model:w="toolWidth"
    @drag-end="dragEnd($event, tool)"
    @resize-end="resizeEnd(tool, toolWidth, toolHeight)"
    :draggable="
      profile.id == tool.user_id || owner.isOwner == true || is_notary
    "
    :resizable="
      profile.id == tool.user_id || owner.isOwner == true || is_notary
    "
    :class="[
      tool.tool_name == 'Textarea' ? 'text-wrapper z-indexed' : 'image-area',
    ]"
    :lockAspectRatio="['Seal', 'Stamp'].includes(tool.tool_name) ? true : false"
    :handles="['tl', 'tr', 'bl', 'br']"
    class-name-active="active-class"
    class-name-dragging="dragging-class"
    class-name-handle="handle-class"
    class-name-resizing="resizing-class"
  >
    <input
      v-if="tool.tool_name == 'Textarea'"
      type="text"
      v-model="tool.append_print.value"
      class="textareaTool w-100 h-100"
      @blur="textInput($event.target, tool)"
      placeholder="Input text here"
      :disabled="tool.user_id != profile.id ? true : false"
      style="border: none; outline: none; font-weight: 500"
    />

    <template v-else>
      <div
        class="grid"
        v-if="isToolLoading.id == tool.id && isToolLoading.active"
      >
        <span class="spinner-border" role="status"></span>
      </div>
      <img
        v-else
        crossOrigin="Anonymous"
        :src="b64"
        @contextmenu.prevent="false"
        class="w-100 h-100"
        :style="[
          ['Draw', 'Upload', 'Type'].includes(tool.append_print.category)
            ? 'object-fit: scale-down'
            : '',
        ]"
      />
    </template>

    <template
      v-if="profile.id == tool.user_id || owner.isOwner == true || is_notary"
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
    <ParticipantName :userId="tool.user_id" />
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
const props = defineProps({
  tool: Object,
  owner: Object,
  disabledTools: Boolean,
});

const { profile, isToolLoading, is_notary } = useGetters({
  profile: "auth/profile",
  isToolLoading: "document/isToolLoading",
  is_notary: "auth/is_notary",
});

const { editTools } = useActions({
  editTools: "document/editTools",
});

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
      return toaster("Sorry, you cannot upload this image");
  }

  if (params.tool_name == "Seal") sealModal.value = true;
  if (params.tool_name == "Stamp") stampModal.value = true;
  if (params.tool_name == "Initial") initialModal.value = true;
  if (params.tool_name == "Signature") affixModal.value = true;
  if (params.tool_name == "Photo") uploadImage.value = true;

  documentId.value = params.document_upload_id;
  toolId.value = params.id;
};

const textInput = (e, params) => {
  const data = {
    append_print_id: params.append_print.id,
    document_upload_id: params.document_upload_id,
    value: e.value,
    type: "Text",
    category: "Type",
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

onMounted(() => {
  if (props.tool.append_print != null) {
    toBase64(props.tool.append_print.file, (dataUrl) => {
      if (dataUrl != "") {
        b64.value = dataUrl;
      }
    });
  }
});
</script>

<style scoped>
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
</style>
