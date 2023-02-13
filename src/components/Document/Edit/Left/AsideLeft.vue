<template>
  <div class="sidebar-left">
    <div class="sidebar">
      <div class="email-app-sidebar">
        <div class="email-app-menu">
          <div
            class="sidebar-menu-list sidebar-nav sticky shadow"
            style="width: 260px"
          >
            <div class="list-group list-group-messages">
              <div class="list-group-item border-bottom">
                <label class="form-label">Current Participant</label>
                <p class="text-capitalize">
                  {{ profile?.first_name }} {{ profile?.last_name }}
                  <span class="badge bg-warning">{{
                    role == "Notary" ? "Commissioner for Oaths" : role
                  }}</span>
                </p>
              </div>

              <template v-if="is_notary">
                <!-- <AddSelfToSignatories /> -->

                <!-- <div class="list-group-item border-bottom">
                  <div class="d-grid col-lg-12 col-md-12 mb-1 mb-lg-0">
                    <button
                      type="button"
                      class="
                        btn btn-primary
                        waves-effect waves-float waves-light
                        custom
                      "
                      @click="addParticipantModal = true"
                    >
                      <PlusIcon />
                      <span> Add participants</span>
                    </button>
                  </div>
                </div> -->
                <div
                  v-if="notary_session_details?.compliance_required"
                  class="list-group-item border-bottom"
                >
                  <p class="text-danger">
                    Complete the compliance questionnaire before proceeding with
                    the session.
                  </p>
                  <button
                    @click="openComplianceModal = true"
                    class="btn btn-danger w-100"
                  >
                    Click here
                  </button>
                </div>

                <div class="list-group-item border-bottom">
                  <span class="align-middle text-primary"> Edit Tools</span>
                </div>

                <div class="list-group-item border-bottom">
                  <label class="form-label">Select a signer</label>
                  <select
                    :disabled="notary_session_details?.compliance_required"
                    class="form-select select2 custom-select"
                    :class="{ 'custom-select-active': signerEmail != '' }"
                    @change="selectSigner"
                    v-model="signerEmail"
                    :style="{
                      outline:
                        '3px solid ' +
                        (toolKit.color?.owner && toolKit.userEmail != ''
                          ? '#28C76F !important'
                          : toolKit.userEmail != ''
                          ? toolKit.color?.code + '!important'
                          : '#333 !important'),
                    }"
                  >
                    <option value="">Select Signer</option>
                    <option
                      v-for="(signer, index) in filteredParticipant"
                      :key="index"
                      :data-email="signer?.user?.email"
                      :value="signer?.user?.email"
                    >
                      {{ signer?.user?.first_name }}
                      {{ signer?.user?.last_name }}
                    </option>
                  </select>
                </div>
              </template>

              <div v-show="!hasRole" class="text-center mt-5">
                <span class="spinner-border spinner-border-sm"></span>
                Loading...
              </div>
              <div
                v-if="
                  hasRole &&
                  is_notary &&
                  !notary_session_details?.compliance_required
                "
              >
                <ToolKits :tool="toolKit" @bindTool="addMouseMoveListener" />
              </div>
              <div
                class="list-group-item"
                v-if="userDocument.is_the_owner_of_document === true"
              >
                <p v-if="extraSeals.length > 1">
                  <b>Additional Charges: </b>
                  <span>&#8358;</span
                  >{{
                    (extraSeals.length - 1) *
                    Number(userDocument.extra_seals_per_unit)
                  }}
                </p>
              </div>
              <!-- <div v-if="!is_notary">
                <div v-show="hasRole" class="list-group-item">
                  <h6>You are to bear witness to this document.</h6>
                  <p>Thank you!</p>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="tool-box textTool" id="textTool">
    <input
      aria-invalid="false"
      type="text"
      class="v-textareaTool w-100"
      value=""
    />
  </div>

  <div class="tool-box tool-style signTool" id="signTool">
    <div class="element">Sign<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style initialTool" id="initialTool">
    <div class="element">Initial<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style stampTool" id="stampTool">
    <div class="element">Stamp<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style sealTool" id="sealTool">
    <div class="element">Seal<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box dateTool" id="dateTool">
    <div class="element">Date<i data-feather="arrow-down-right"></i></div>
  </div>

  <div class="tool-box tool-style photoTool" id="photoTool">
    <div class="element">Image<i data-feather="arrow-down-right"></i></div>
  </div>

  <ModalComp
    :show="addParticipantModal"
    :footer="false"
    @close="addParticipantModal = false"
  >
    <template #header>
      <h5 class="modal-title">Add participants</h5>
    </template>

    <template #body>
      <AddSigner @close="addParticipantModal = false" />
    </template>
  </ModalComp>

  <ModalComp
    :show="openComplianceModal"
    :footer="false"
    @close="openComplianceModal = false"
    data-aos="zoom-in"
    :size="'modal-lg'"
  >
    <template #header>
      <h5 class="modal-title"></h5>
    </template>

    <template #body>
      <ComplianceQuestionnaire @close="openComplianceModal = false" />
    </template>
  </ModalComp>
</template>

<script setup>
// import PlusIcon from "@/icons/PlusIcon.vue";
import ModalComp from "@/components/ModalComp.vue";
import AddSigner from "@/components/Document/Edit/Left/AddSigner.vue";

import { ref, onMounted, defineProps, watch, onUpdated, computed } from "vue";
import { useGetters, useActions } from "vuex-composition-helpers/dist";

import "jquery/dist/jquery.min";
import $ from "jquery";

import ToolKits from "@/components/Document/Edit/Tools/ToolKits.vue";
// import AddSelfToSignatories from "./AddSelfToSignatories.vue";
import ComplianceQuestionnaire from "@/components/Compliance/ComplianceQuestionnaire.vue";

const {
  profile,
  userDocument,
  is_notary,
  notary_session_details,
  workingTools,
} = useGetters({
  profile: "auth/profile",
  userDocument: "document/userDocument",
  is_notary: "auth/is_notary",
  notary_session_details: "schedule/virtual_session_details",
  workingTools: "document/workingTools",
});
const extraSeals = computed(() => {
  return workingTools.value.filter(
    (seal) =>
      seal.tool_name == "Seal" &&
      seal.user_id == notary_session_details.value.notary_id
  );
});
const { resourceTools } = useActions({
  resourceTools: "document/resourceTools",
});

/* ------- // *** Props from views\documents\DocumentEdit.vue (PARENT) ------ */
const props = defineProps({ chunkFileId: String });
const watchFileId = ref("");

watch(
  () => [userDocument.value, props.chunkFileId],
  ([newUserDoc, newChunkF]) => {
    if (newChunkF) {
      watchFileId.value = newChunkF;
    }

    if (newUserDoc) {
      filteredParticipant.value = newUserDoc.participants.filter(
        (r) => r.role != "Viewer"
      );
      toolKit.value = {
        active: is_notary.value
          ? // active: userDocument.value.is_the_owner_of_document
            activated.value
          : !activated.value,
        userEmail: profile.value.email,
        userId: profile.value.id,
        color: is_notary.value ? code.value : { code: initCode.value },
        // color: userDocument.value.is_the_owner_of_document ? '#28C76F' : init,
      };
    }
  },
  { deep: true }
);

// watch(
//   () => [userDocument.value, props.chunkFileId],
//   ([newUserDoc, newChunkF]) => {
//     if (newChunkF) {
//       watchFileId.value = newChunkF;
//     }

//     if (newUserDoc) {
//       filteredParticipant.value = newUserDoc.participants.filter(
//         (r) => r.role != "Viewer"
//       );
//     }
//   },

//   { deep: true }
// );

const openComplianceModal = ref(false);
const addParticipantModal = ref(false);
const filteredParticipant = ref("");
const hasRole = ref(false);
const role = ref("");
const signerEmail = ref("");
const participantId = ref("");
const tempStorage = ref(null);
const tool_class = ref("");
const tool_id = ref("");
const toolKit = ref({});
const tempData = ref(false);
let user_from_doc = ref({
  role: "",
});

const participantFirstName = ref("");
const code = ref(null);
const colorCode = ref([
  "#fff100",
  "#ff8c00",
  "#e81123",
  "#ec008c",
  "#68217a",
  "#00188f",
  "#00bcf2",
  "#00b294",
  "#009e49",
  "#bad80a",
]);

const activated = ref(false);
const selectSigner = (e) => {
  activated.value = e.target.value != "" ? true : false;
  const participantArray = filteredParticipant.value;

  participantArray.map((params, index) => {
    if (params.user.email == signerEmail.value) {
      participantId.value = params.user.id;
      participantFirstName.value = params.user.first_name;
      code.value = {
        owner: params.ownerDocument,
        name: params.user.first_name,
        code: colorCode.value[index] ?? "#003BB3",
      };
    }
  });

  toolKit.value = {
    active: activated.value,
    userEmail: signerEmail.value,
    userId: participantId.value,
    color: code.value ?? { code: "#003BB3" },
  };
};

// const selectSigner = (e) => {
//   const participantArray = filteredParticipant.value;

//   participantArray.map((params) => {
//     if (params.user.email == signerEmail.value) {
//       participantId.value = params.user.id;
//     }
//   });

//   toolKit.value = {
//     active: e.target.value != "" ? true : false,
//     userEmail: signerEmail.value,
//     userId: participantId.value,
//   };
// };

const addMouseMoveListener = (params) => {
  tempData.value = true;
  let count = 1;
  tempStorage.value = params;
  $(document).bind("mousemove", function (e) {
    count = count + 1;
    tool_id.value = count;
    $("." + params.toolId).attr("id", count);
    $("." + params.toolId).css({
      display: "block",
      left: e.pageX + 2,
      top: e.pageY - 1,
    });
  });
};

$(document).on("click", "#mainWrapper", function (e) {
  if (tempStorage.value == null) return;
  $("#" + tool_id.value).css("display", "none");
  removeMouseMoveListener();

  let posX = $(this).offset().left;
  // let posY = $(this).offset().top;
  let x = e.pageX - posX + 2;
  // let y = e.pageY - posY - 5;
  let y = e.offsetY - 5;

  const toolName = tempStorage.value.tool_name;
  if (toolName == "Sign" || toolName == "Initial") {
    tool_class.value = "tool-box main-element";
  } else if (toolName == "Textarea" || toolName == "Date") {
    tool_class.value = "main-element";
  } else if (toolName == "Photo") {
    tool_class.value = "main-element";
  } else {
    tool_class.value = "tool-box main-element";
  }

  let saveTools = {
    document_upload_id: watchFileId.value,
    user_id: participantId.value == "" ? profile.value.id : participantId.value,
    tool_name: toolName,
    tool_class: tool_class.value,
    tool_width: toolName == "Textarea" ? "120" : "100",
    tool_height: toolName == "Textarea" ? "25" : "40",
    tool_pos_top: y.toString(),
    tool_pos_left: x.toString(),
    category: toolName == "Textarea" ? "Type" : "",
    type: toolName == "Textarea" ? "Text" : "",
    value: "",
  };

  if (tempData.value === true) {
    resourceTools(saveTools);
    tempData.value = false;
  }
});

function removeMouseMoveListener() {
  $(document).unbind("mousemove");
}

onUpdated(() => {
  if (userDocument.value?.participants_count > 0) {
    userDocument.value?.participants.map((participant) => {
      if (participant?.user?.id == profile.value?.id)
        role.value = participant.role;
    });
  }
});

const initCode = ref(null);
const docOwner = ref(false);

onMounted(() => {
  const user = notary_session_details.value?.schedule.participants.filter(
    (user) => {
      return user.user_id == profile.value?.id;
    }
  );
  user_from_doc.value = user[0];

  if (is_notary.value && notary_session_details.value.compliance_required) {
    setTimeout(() => {
      openComplianceModal.value = true;
    }, 5000);
  }

  userDocument.value?.participants?.map((params, index) => {
    if (params.user.email == profile.value.email)
      initCode.value = colorCode.value[index];
  });

  // console.log(userDocument.value);
  setTimeout(() => {
    hasRole.value = true;
    // docOwner.value = userDocument.value.is_the_owner_of_document;
    docOwner.value = is_notary.value;
    toolKit.value = {
      active: docOwner.value ? activated.value : !activated.value,
      userEmail: docOwner.value ? "" : profile.value.email,
      userId: profile.value.id,
      color: code.value ?? {
        code: is_notary.value ? "#28C76F" : initCode.value,
      },
    };
  }, 2000);

  setTimeout(() => {
    hasRole.value = true;
  }, 1000);

  setTimeout(() => {
    // hasRole.value = true;
    // toolKit.value = {
    //   active: role.value ? true : false,
    //   userEmail: profile.value.email,
    //   userId: profile.value.id,
    // };
  }, 2000);
});
</script>

<style scoped>
.custom-select {
  color: #6e6b7b;
  font-weight: 500;
  border: 1px solid #333;
  outline: 2px solid #333;
}

.custom-select-active {
  border: 1px solid #003bb3;
  outline: 2px solid #003bb3;
}

.email-app-sidebar {
  background: transparent !important;
}

.sidebar-nav.sticky {
  position: fixed !important;
  top: 165px;
  bottom: 0;
  background-color: #fff;
}

.btn.custom {
  padding: 0.786rem 0.5rem !important;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
