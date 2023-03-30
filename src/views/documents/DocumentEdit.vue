<template>
  <!-- for mobile  -->
  <div
    v-if="role != 'Viewer'"
    class="card rounded-0 mb-0 p-1 d-lg-none d-sm-block d-md-block custom-position"
  >
    <ul
      class="nav d-flex justify-content-between align-items-center"
      v-show="hasRole"
    >
      <!-- signature tool  -->
      <li class="nav-item d-none">
        <div class="btn-group">
          <button
            class="extra__button waves-effect waves-float btn-secondary me-1"
            @click="plusBtn"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button
            class="extra__button waves-effect waves-float btn-secondary"
            @click="minusBtn"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="css-i6dzq1"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
        </div>
      </li>
      <!-- more buttons dropdown  -->
      <li class="nav-item">
        <div class="btn-group">
          <button
            type="button"
            class="extra__button waves-effect waves-float waves-light"
            data-bs-toggle="dropdown"
            aria-expanded="true"
          >
            <VerticalEllipsis />
          </button>
          <div
            class="dropdown-menu dropdown-menu-end"
            data-popper-placement="bottom-start"
          >
            <!-- <div class="dropdown-divider"></div> -->
            <template v-if="userDocument.is_the_owner_of_document === true">
              <a
                class="dropdown-item btn d-flex align-items-center"
                role="button"
                @click="addParticipantModal = true"
              >
                <Icon icon="akar-icons:plus" class="me-1" />
                Add participants
              </a>
            </template>

            <a
              class="dropdown-item btn d-flex align-items-center"
              role="button"
              @click="editSignerModal = true"
            >
              <Icon icon="ep:view" class="me-1" />
              View all signers
            </a>
            <a
              class="dropdown-item btn d-flex align-items-center"
              role="button"
              @click="exportHTMLToPDF"
            >
              <Icon icon="bx:download" class="me-1" />
              Download
            </a>

            <div class="dropdown-divider"></div>

            <a
              @click="affixModal = true"
              class="dropdown-item"
              role="button"
              id="viewSignature"
              >My Signature</a
            >

            <template v-if="plan == 'Business' || is_notary">
              <a class="dropdown-item" role="button" @click="sealModal = true"
                >My Seal</a
              >
              <a class="dropdown-item" role="button" @click="stampModal = true"
                >My Stamp</a
              >
            </template>
          </div>
        </div>
      </li>
      <!-- other buttons  -->
      <li class="nav-item border-0">
        <button class="btn btn-sm btn-primary" @click="doneModal = true">
          <template v-if="userDocument.is_the_owner_of_document === true">
            Finish
          </template>
          <template v-else> Submit </template>
        </button>

        <button
          class="btn btn-sm btn-primary ms-1"
          @click="emailModal = true"
          v-if="userDocument.is_the_owner_of_document === true"
        >
          Share
        </button>
      </li>
    </ul>
  </div>

  <!-- for web   -->
  <nav
    class="header-navbar navbar navbar-expand-lg floating-nav navbar-shadow container-xxl"
    style="z-index: 102"
  >
    <div class="navbar-container d-flex content">
      <div class="bookmark-wrapper d-flex align-items-center">
        <li v-if="is_notary" class="nav-item d-none d-sm-block mx-1">
          <!-- <ScreenRecording /> -->
          <!-- <SessionRecorder /> -->
        </li>
        <ul class="nav navbar-nav d-xl-none">
          <li class="nav-item d-none">
            <a class="nav-link menu-toggle" href="#"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-menu ficon"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line></svg
            ></a>
          </li>
        </ul>
        <template v-if="role != 'Viewer'">
          <ul class="nav navbar-nav bookmark-icons" v-show="hasRole">
            <li class="nav-item d-none d-sm-block">
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-primary btn-sm waves-effect waves-float waves-light"
                >
                  <SettingIcon />
                  Signature tools
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm dropdown-toggle dropdown-toggle-split waves-effect waves-float waves-light"
                  data-bs-toggle="dropdown"
                  aria-expanded="true"
                >
                  <span class="visually-hidden"></span>
                </button>
                <div
                  class="dropdown-menu dropdown-menu-end"
                  data-popper-placement="bottom-start"
                >
                  <a
                    @click="affixModal = true"
                    class="dropdown-item"
                    href="#"
                    id="viewSignature"
                    >My Signature</a
                  >
                  <template v-if="plan == 'Business' || is_notary">
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" @click="sealModal = true"
                      >My Seal</a
                    >
                    <a class="dropdown-item" href="#" @click="stampModal = true"
                      >My Stamp</a
                    >
                  </template>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </div>
      <ul class="nav navbar-nav align-items-center ms-auto">
        <!-- <li class="nav-item d-none d-sm-block">
          <a class="nav-link nav-link-style">
            <button
              class="btn btn-sm btn-outline-primary waves-effect"
              @click="exportHTMLToPDF"
              :disabled="isDownload"
            >
              <template v-if="isDownload">
                <span class="spinner-border spinner-border-sm"></span>
                Downloading
              </template>
              <template v-else>Download</template>
            </button>
          </a>
        </li> -->

        <template v-if="is_notary">
          <li class="nav-item" style="position: relative; z-index: 202">
            <a class="nav-link nav-link-style">
              <button
                class="btn btn-sm btn-primary waves-effect"
                @click="openEndSessionModal = true"
              >
                Cancel Session
              </button>
            </a>
          </li>
          <li class="nav-item" style="position: relative; z-index: 202">
            <a class="nav-link nav-link-style">
              <button
                class="btn btn-sm btn-primary waves-effect"
                @click="openCompleteSessionModal = true"
              >
                Complete Session
              </button>
            </a>
          </li>
        </template>
        <template v-if="!is_notary">
          <li v-if="!display_button" class="nav-item d-none d-sm-block mx-1">
            <button
              @click="openLeaveSessionModal = true"
              class="btn btn-sm btn-primary"
            >
              Leave Session
            </button>
          </li>
          <li v-if="display_button" class="nav-item d-none d-sm-block mx-1">
            <button
              @click="userEndSessionModal = true"
              class="btn btn-sm btn-primary"
            >
              End Session
            </button>
          </li>
        </template>
        <!-- <li
          class="nav-item d-none d-sm-block"
          v-if="
            userDocument.is_the_owner_of_document === true || role != 'Viewer'
          "
        >
          <a class="nav-link nav-link-style">
            <button
              class="
                btn btn-sm btn-primary
                waves-effect waves-float waves-light
              "
              @click="emailModal = true"
              style="margin-right: 5px"
            >
              Send
            </button>
          </a>
        </li> -->
      </ul>
    </div>
  </nav>

  <div
    class="content-area-wrapper container-xxl p-0 mt-5 overflow-x-scroll border-0"
    style="position: static !important"
  >
    <AsideLeft :chunkFileId="pageId" />
    <MainContent @docId="getDocId" @open="open" :auditTrail="auditTrail" />
    <AsideRight :isOpen="editSignerModal" @close="editSignerModal = false" />
  </div>

  <div class="fixed-bottom bg-white shadow-lg custom-sm">
    <AsideBottom
      :chunkFileId="pageId"
      :isOpen="addParticipantModal"
      @close="addParticipantModal = false"
    />
  </div>

  <ModalComp :show="emailModal" :footer="false" @close="emailModal = false">
    <template #header>
      <h5 class="modal-title">Invite participant</h5>
    </template>

    <template #body>
      <p class="text-center">
        The following people will be invited to this document
      </p>
      <MailToParticipant @close="emailModal = false" :isLoading="loading" />
    </template>
  </ModalComp>

  <ModalComp :show="openNotificationModal" :size="'modal-md'" :closeBtn="false">
    <template #header>
      <div class="text-center">
        <h2 class="fw-bold">Your document has been sent</h2>
        <h6>
          Your feedback is very important to us. It gives us the opportunity to
          serve you better.
        </h6>
      </div>
    </template>

    <template #body>
      <div class="text-center">
        <h4 class="mb-1 mt-2">How was your experience?</h4>

        <div class="mb-2 mx-auto custom-width">
          <StarRating
            :star-size="30"
            :increment="0.5"
            active-color="#ffc107"
            :show-rating="false"
            v-model:rating="rating"
          />

          <div
            class="d-flex justify-content-between align-items-center"
            style="width: 235px"
          >
            <p class="text-secondary">Bad</p>
            <p class="text-secondary">Excellent</p>
          </div>
        </div>

        <h6>Do you have any thought you'd like to share?</h6>
      </div>

      <textarea
        class="form-control mb-1"
        rows="4"
        v-model="feedback"
      ></textarea>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="sendRatedFeedback">
        Send
      </button>
    </template>
  </ModalComp>

  <ModalComp
    :show="affixModal"
    :footer="false"
    :size="'modal-sm'"
    @close="affixModal = false"
  >
    <template #header>
      <h4 class="modal-title">My Signatures</h4>
    </template>

    <template #body>
      <div class="row">
        <div class="col-md-4 ms-auto">
          <button
            @click="updateModal"
            class="float-end btn btn-outline-secondary btn-sm waves-effect"
            id="updateSignature"
          >
            <EditIcon />
            Update
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <SignaturePrint @selectedSignature="savePrint" />
    </template>
  </ModalComp>

  <ModalComp
    :show="updateSignatureModal"
    :footer="false"
    @close="updateSignatureModal = false"
  >
    <template #header>
      <h4 class="modal-title">Update your signature</h4>
    </template>

    <template #body>
      <LeftTabWrapper>
        <LeftTabList title="Draw">
          <SignaturePad @close="updateSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Select">
          <SignatureSelectFull @close="updateSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Initial">
          <SignatureSelectInitial @close="updateSignatureModal = false" />
        </LeftTabList>

        <LeftTabList title="Upload">
          <div class="row">
            <div class="col-md-12 mx-auto position-relative">
              <SignatureUpload @close="updateSignatureModal = false" />
            </div>
          </div>
        </LeftTabList>
      </LeftTabWrapper>
      <div class="row">
        <div class="col-md-10 ms-auto mt-2">
          <p class="fw-normal">
            By clicking create, I agree that all signatures, marks or initials
            created here are as valid as my hand written signature to the extent
            allowed by law.
          </p>
        </div>
      </div>
    </template>
  </ModalComp>

  <ModalComp
    :show="sealModal"
    :footer="false"
    :size="'modal-md'"
    @close="sealModal = false"
  >
    <template #header>
      <h4 class="modal-title">My Seal</h4>
    </template>

    <template #body>
      <div class="row">
        <div class="col-md-4 ms-auto">
          <button
            @click="updateSeal"
            class="float-end btn btn-outline-secondary btn-sm waves-effect"
          >
            <SealIcon />
            Manage
          </button>
        </div>
      </div>

      <div class="divider"></div>
      <NotarySealList v-if="is_notary" />
      <SealList v-if="!is_notary" />
    </template>
  </ModalComp>

  <ModalComp
    :show="stampModal"
    :footer="false"
    :size="'modal-md'"
    @close="stampModal = false"
  >
    <template #header>
      <h4 class="modal-title">My Stamp</h4>
    </template>

    <template #body>
      <div class="row">
        <div class="col-md-4 ms-auto">
          <button
            @click="updateStamp"
            class="float-end btn btn-outline-secondary btn-sm waves-effect"
          >
            <svg
              width="21"
              height="12"
              xmlns="http://www.w3.org/2000/svg"
              class="ml-auto tool-svg"
              data-v-01cdeba4=""
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M21 0H0v12h21V0Zm-.913 1H.913v10h19.174V1Z"
                data-v-01cdeba4=""
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M17.348 3H3.652v6h13.696V3Zm-.913 1H4.565v4h11.87V4Z"
                data-v-01cdeba4=""
              ></path>
            </svg>
            Manage
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <StampList />
    </template>
  </ModalComp>

  <ModalComp
    :show="createStampModal"
    :footer="false"
    :size="'modal-md'"
    @close="createStampModal = false"
  >
    <template #header>
      <h4 class="modal-title">Manage a stamp</h4>
    </template>

    <template #body>
      <StampCreate v-if="!is_notary" @close="createStampModal = false" />
      <NotaryStampCreate v-if="is_notary" @close="createStampModal = false" />
    </template>
  </ModalComp>

  <ModalComp
    :show="createSealModal"
    :footer="false"
    :size="'modal-lg'"
    @close="createSealModal = false"
  >
    <template #header>
      <h4 class="modal-title">Manage a seal</h4>
    </template>

    <template #body>
      <SealDigitalCreate v-if="!is_notary" @close="createSealModal = false" />
      <NotarySealDigitalCreate
        v-if="is_notary"
        @close="createSealModal = false"
      />
    </template>
  </ModalComp>

  <ModalComp :show="doneModal" :size="'modal-sm'" @close="doneModal = false">
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <p class="text-center">
        <i>Please confirm that you are done signing.</i>
      </p>
    </template>

    <template #footer>
      <button
        class="btn btn-sm btn-primary"
        @click="confirmEdit"
        :disabled="isDoneLoading"
      >
        <span
          v-show="isDoneLoading"
          class="spinner-border spinner-border-sm"
        ></span>
        <template v-if="!isDoneLoading">Confirm</template>
        <template v-else> Processing...</template>
      </button>
    </template>
  </ModalComp>

  <ModalComp
    :show="cancelModal"
    :size="'modal-sm'"
    @close="cancelModal = false"
  >
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Alert
      </h4>
    </template>

    <template #body>
      <h3 class="text-center">Are you sure?</h3>
      <p class="text-center"><i>Changes will not be saved!</i></p>
    </template>

    <template #footer>
      <button class="btn btn-sm btn-primary" @click="deletePermanently">
        <span v-show="loading" class="spinner-border spinner-border-sm"></span>
        Proceed
      </button>
    </template>
  </ModalComp>

  <ModalComp
    :show="notaryModal"
    :footer="false"
    :size="'modal-lg'"
    @close="notaryModal = false"
  >
    <template #header>
      <h4 class="modal-title">Important Information</h4>
    </template>

    <template #body>
      <div class="d-flex justify-content-end align-items-center">
        <p
          title="Coming Soon"
          class="coming-soon border border-warning text-warning"
        >
          Coming Soon
        </p>
      </div>
      <p class="card-text">
        For now, please download this document, go to your dashboard and click
        on
        <strong>Request a Notary.</strong>
      </p>
      <a
        :href="redirectToUserDashboard + '/redirecting?qt=' + token"
        class="btn btn-sm btn-outline-primary waves-effect"
        >Go to dashboard</a
      >
    </template>
  </ModalComp>

  <ModalComp
    :show="confirmGuest"
    :size="'modal-sm'"
    :footer="false"
    @close="closeGuest"
  >
    <template #header>
      <h4 class="modal-title text-warning mb-0">
        <Icon icon="icomoon-free:notification" style="margin-bottom: 3px" />
        Information
      </h4>
    </template>

    <template #body>
      <p class="text-capitalize">Hi {{ profile.first_name }},</p>
      <p>
        Would you like to create an account? <br />
        Simply enter a password to access this document any time
      </p>

      <UserResetPassword @save="closeGuest" />
    </template>
  </ModalComp>

  <!-- notary complete session -->
  <ModalComp
    :show="openCompleteSessionModal"
    :size="'modal-sm'"
    @close="openCompleteSessionModal = false"
  >
    <template #header>
      <h4 class="modal-title text-success mb-0">
        <Icon
          icon="mdi:alert-circle-check-outline"
          style="margin-bottom: 3px"
        />
        Complete Session
      </h4>
    </template>

    <template #body>
      <div class="mt-2">
        <h4 class="fw-bolder ff-poppins">
          Are you sure you wish to complete this session?
        </h4>

        <div class="text-center my-2">
          <template v-if="isDownload">
            <div class="text-dark">
              <h6 class="fw-bolder ff-poppins">Processing document</h6>
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </template>
          <template v-if="isDoneLoading">
            <div class="text-dark">
              <h6 class="fw-bolder ff-poppins">Encrypting document</h6>
              <div class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </template>
          <!-- <template v-if="!loadingCompleted || !isDoneLoading">
            <h6 class="fw-bolder ff-poppins">Done</h6>
          </template> -->
        </div>

        <button
          @click="notaryCompleteSession"
          class="btn w-100 mt-2 btn-primary"
          :disabled="isDownload"
        >
          <span
            v-if="isDownload"
            class="spinner-border spinner-border-sm me-1"
            role="status"
            aria-hidden="true"
          ></span
          >Complete Session
        </button>
      </div>
    </template>
  </ModalComp>

  <!-- end session (notary) -->
  <ModalComp
    :show="openEndSessionModal"
    :size="'modal-md'"
    @close="openEndSessionModal = false"
  >
    <template #header>
      <h4 class="modal-title text-danger mb-0">
        <Icon icon="eva:alert-triangle-outline" style="margin-bottom: 3px" />
        Cancel Session
      </h4>
      <!-- <h4 class="modal-title text-primary fw-bolder">Cancel Session</h4> -->
    </template>

    <template #body>
      <EndSessionComponent @close="openEndSessionModal = false" />
    </template>
  </ModalComp>

  <!-- leave session (user) -->
  <ModalComp
    :show="openLeaveSessionModal"
    :size="'modal-sm'"
    @close="openLeaveSessionModal = false"
  >
    <template #header>
      <h4 class="modal-title text-warning mb-0">
        <Icon
          icon="mdi:alert-circle-check-outline"
          style="margin-bottom: 3px"
        />
        Leave Session
      </h4>
    </template>

    <template #body>
      <p>Are you sure you want to leave the session?</p>
      <button
        :disabled="leave_loading"
        @click="leave__session"
        class="btn btn-primary w-100"
      >
        <span
          v-if="leave_loading"
          class="spinner-border spinner-border-sm me-1"
          role="status"
          aria-hidden="true"
        ></span>
        Leave Session
      </button>
    </template>
  </ModalComp>

  <!--  end session (user) -->
  <ModalComp :show="userEndSessionModal" :size="'modal-md'" :closeBtn="false">
    <template #header>
      <div class="text-center px-2" style="margin: 5px 0">
        <h4 class="fw-bold">Notary Feedback</h4>
      </div>
    </template>

    <template #body>
      <Feedback />
    </template>
  </ModalComp>

  <!--  display end session for users and participants -->
  <ModalComp :show="showEndSessionModal" :size="'modal-md'" :closeBtn="false">
    <template #header> <h5></h5> </template>

    <template #body>
      <div v-if="!displayFeedback" class="text-center my-2 px-3">
        <img
          src="../../assets/images/logo2.png"
          alt="ToNote Logo"
          class="my-1"
          width="140"
          height="140"
        />
        <h3 class="fw-bolder text-primary">Session Ended</h3>
        <p>
          Your session has ended, kindly click the button below to leave the
          session
        </p>
        <button @click="displayFeedback = true" class="btn btn-primary mt-1">
          Leave Session
        </button>
      </div>
      <div v-else data-aos="zoom-in">
        <Feedback />
      </div>
    </template>
  </ModalComp>
</template>

<script setup>
import { events } from "@/utils/constants";
import { Icon } from "@iconify/vue";
import EditIcon from "@/icons/EditIcon.vue";
import SettingIcon from "@/icons/SettingIcon.vue";
import VerticalEllipsis from "@/icons/VerticalEllipsis.vue";
import SealIcon from "@/icons/SealIcon.vue";
import StarRating from "vue-star-rating";

import ModalComp from "@/components/ModalComp.vue";
import UserResetPassword from "@/components/Auth/UserResetPassword.vue";
import AsideLeft from "@/components/Document/Edit/Left/AsideLeft.vue";
import AsideRight from "@/components/Document/Edit/Right/AsideRight.vue";
import MainContent from "@/components/Document/Edit/Main/MainContent.vue";

import AsideBottom from "@/components/Document/Edit/Mobile/AsideBottom.vue";

import MailToParticipant from "@/components/Document/Edit/MailToParticipant.vue";

import LeftTabWrapper from "@/components/Tab/TabLeftNav/LeftTabWrapper.vue";
import LeftTabList from "@/components/Tab/TabLeftNav/LeftTabList.vue";

import SignaturePrint from "@/components/Signature/SignaturePrint.vue";
import SignaturePad from "@/components/Signature/SignaturePad.vue";

import SignatureSelectFull from "@/components/Signature/SignatureSelectFull.vue";
import SignatureUpload from "@/components/Signature/SignatureUpload.vue";
import SignatureSelectInitial from "@/components/Signature/SignatureSelectInitial.vue";

import SealDigitalCreate from "@/components/Notary/Seal/SealDigitalCreate.vue";
import SealList from "@/components/Notary/Seal/SealList.vue";
import NotarySealList from "@/components/Notary/Seal/NotarySealList.vue";
import NotarySealDigitalCreate from "@/components/Notary/Seal/NotarySealDigitalCreate.vue";

import StampList from "@/components/Notary/Stamp/StampList.vue";
import StampCreate from "@/components/Notary/Stamp/StampCreate.vue";
import NotaryStampCreate from "@/components/Notary/Stamp/NotaryStampCreate.vue";

// import ScreenRecording from "@/components/Session/ScreenRecording.vue";
// import SessionRecorder from "@/components/Session/SessionRecorder.vue";
import Feedback from "@/components/Session/FeedBack.vue";

import EndSessionComponent from "@/components/Session/EndSessionComponent.vue";

import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";

import { ref, onMounted, watch, onUpdated, onUnmounted } from "vue";

import { useGetters, useActions } from "vuex-composition-helpers/dist";
import { useRouter } from "vue-router";
// import { useToast } from "vue-toast-notification";
import { dashboard } from "@/store/dashboard";
// import Api from "@/api/Api";

import "jquery/dist/jquery.min";
import $ from "jquery";
import socket from "@/utils/event-bus";
import store from "@/store";

// const toast = useToast();
const route = useRouter();

const {
  token,
  profile,
  teams,
  userDocument,
  isOpenModal,
  // canCancel,
  confirmGuest,
  isDoneLoading,
  is_notary,
  virtual_session_details,
  // complete_loading,
  // leave_loading,
} = useGetters({
  token: "auth/token",
  profile: "auth/profile",
  teams: "team/teams",
  userDocument: "document/userDocument",
  isOpenModal: "document/isOpenModal",
  // canCancel: "document/canCancel",
  confirmGuest: "document/confirmGuest",
  isDoneLoading: "document/isDoneLoading",
  is_notary: "auth/is_notary",
  virtual_session_details: "schedule/virtual_session_details",
  // complete_loading: "notary/complete_loading",
  // leave_loading: "notary/leave_loading",
});

const {
  doneEditing,
  sendFeedback,
  removeNotification,
  isGuest,
  removeDocument,
  removeRecentUpload,
  getUserPrints,
  // eslint-disable-next-line no-unused-vars
  CompleteNotarySession,
  getDocumentAuditTrails,
} = useActions({
  doneEditing: "document/doneEditing",
  sendFeedback: "document/sendFeedback",
  removeNotification: "document/removeNotification",
  isGuest: "document/isGuest",
  removeDocument: "document/removeDocument",
  removeRecentUpload:
    "documen                                                                                              t/removeRecentUpload",
  getUserPrints: "print/getUserPrints",
  CompleteNotarySession: "notary/CompleteNotarySession",
  getDocumentAuditTrails: "document/getDocumentAuditTrails",
});

const auditTrail = ref(false);
const displayFeedback = ref(false);
const showEndSessionModal = ref(false);
const display_button = ref(false);
const userEndSessionModal = ref(false);
const openLeaveSessionModal = ref(false);
const openCompleteSessionModal = ref(false);
const openEndSessionModal = ref(false);
const redirectToWebsite = ref("");
const redirectToUserDashboard = ref("");
const addParticipantModal = ref(false);
const editSignerModal = ref(false);
// const openNotificationModal = ref(isOpenModal.value);
const openNotificationModal = ref(false);
const isOpen = ref(false);
const notaryModal = ref(false);
const pageId = ref("");
const doneModal = ref(false);
const cancelModal = ref(false);
const doneDataUrl = ref([]);
const emailModal = ref(false);
const affixModal = ref(false);
const updateSignatureModal = ref(false);
const sealModal = ref(false);
const createSealModal = ref(false);
const createStampModal = ref(false);
const stampModal = ref(false);
const loading = ref(false);
const plan = ref(null);
const hasRole = ref(false);
const role = ref(null);
const uri = ref("");
const feedback = ref("");
const rating = ref(0);
const isDownload = ref(false);
let notary_ava_interval = ref("");

const currIEZoom = ref(100);

const plusBtn = () => {
  let step = 20;
  currIEZoom.value += step;
  $(".zum").css("zoom", " " + currIEZoom.value + "%");
};

const minusBtn = () => {
  let step = 20;
  currIEZoom.value -= step;
  $(".zum").css("zoom", " " + currIEZoom.value + "%");
};

watch(
  () => [isOpenModal.value, isDoneLoading.value],
  ([isOpen, isDone], [isOldOpen, isOldDone]) => {
    if (isOpen != isOldOpen) openNotificationModal.value = isOpen;
    if (isDone != isOldDone) doneModal.value = isDone;
  }
);
const leave__session = () => {
  window.location.href = "/notary";
};

const notaryCompleteSession = () => {
  isDownload.value = true;
  getDocumentAuditTrails(userDocument.value.id).then(() => {
    auditTrail.value = true;
    CompleteNotarySession({
      id: virtual_session_details.value?.id,
      status: "Completed",
      cancel_reason: "This session has been completed successfully",
      comment: "This session has been completed successfully",
    }).then(() => {
      socket.emit(events.NOTARY_COMPLETE_SESSION);
      exportHTMLToPDF("done").then(() => (isDownload.value = false));
      // route.push({ path: "/session-complete" });
      // window.location.href = "/session-complete";
    });
  });
};

const closeGuest = () => {
  isGuest(false);
  window.location.href = process.env.VUE_APP_URL_WEBSITE;
};
const open = (params) => (isOpen.value = params);

// const cancel = () => (cancelModal.value = true);

const deletePermanently = () => {
  removeDocument({
    documents: [{ document_id: uri.value, permanent_delete: true }],
  });
  route.push({ name: "Dashboard" });
};

const getDocId = (params) => (pageId.value = params);

const updateModal = () => {
  affixModal.value = false;
  updateSignatureModal.value = true;
};

const updateSeal = () => {
  sealModal.value = false;
  createSealModal.value = true;
};

const updateStamp = () => {
  stampModal.value = false;
  createStampModal.value = true;
};

const exportHTMLToPDF = async (params) => {
  const pages = document.getElementsByClassName("downloader");
  const opt = {
    margin: [0, 0, -2, 0],
    filename: userDocument.value.title + ".pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { dpi: 192, letterRendering: true },
    jsPDF: {
      unit: "in",
      format: "letter",
      orientation: "portrait",
      compressPDF: true,
    },
  };

  const doc = new jsPDF(opt.jsPDF);
  const pageSize = jsPDF.getPageSize(opt.jsPDF);

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    if (params != "done") {
      const pageImage = await html2pdf().set(opt).from(page).outputImg();
      if (i != 0) doc.addPage();
      doc.addImage(
        pageImage.src,
        "jpeg",
        opt.margin[0],
        opt.margin[0],
        pageSize.width,
        pageSize.height
      );
    } else {
      await html2pdf()
        .set(opt)
        .from(page)
        .outputPdf()
        .then(function (pdf) {
          doneDataUrl.value.push("data:application/pdf;base64," + btoa(pdf));
        });
    }
  }

  if (params == "done") {
    if (pages.length === doneDataUrl.value.length) isDoneEdit();
    return;
  }

  const pdf = doc.save(opt.filename);
  // if (pdf) isDownload.value = false;
  return pdf;
};

const isDoneEdit = () => {
  let dataObj = {
    document_id: uri.value,
    files: doneDataUrl.value,
  };
  doneEditing(dataObj);
};

const confirmEdit = () => {
  if (!userDocument.value.is_the_owner_of_document) {
    exportHTMLToPDF("done");
  } else {
    window.location.href =
      redirectToUserDashboard.value + "/redirecting?qt=" + token.value;
  }
};

const sendRatedFeedback = () => {
  const feedObj = {
    review_id: uri.value,
    review_type: "Document",
    comment: feedback.value,
    rating: rating.value.toString(),
  };

  sendFeedback(feedObj);
  removeNotification(false);

  setTimeout(() => {
    window.location.href =
      redirectToUserDashboard.value + "/redirecting?qt=" + token.value;
  }, 3000);
};

onUpdated(() => {
  if (userDocument.value?.participants_count > 0) {
    userDocument.value?.participants.map((participant) => {
      if (participant?.user?.id == profile.value?.id)
        role.value = participant.role;
    });
  }
});

onMounted(() => {
  redirectToUserDashboard.value = process.env.VUE_APP_URL_AUTH_LIVE;
  redirectToWebsite.value = process.env.VUE_APP_URL_WEBSITE;
  uri.value = route.currentRoute.value.params.document_id;

  if (token.value == null) return;
  if (token.value != "" || token.value != null) {
    hasRole.value = true;
    dashboard.value.setToken(token.value);
    getUserPrints(token.value);

    if (teams.value.length > 0) {
      plan.value = teams.value[0].subscription.plan.name;
    }
  }
  socket.auth = {
    username: `${profile.value.first_name}-${profile.value.last_name}`,
    sessionRoom: `${virtual_session_details.value.id}`,
    token: token.value,
  };
  socket.connect();

  socket.on(events.NOTARY_SEND_TOOLS, (data) => {
    store.commit("document/SET_LOADER", true);
    setTimeout(() => {
      store.commit("document/SET_RESOURCE_TOOLS", JSON.parse(data));
      store.commit("document/SET_LOADER", false);
    }, 0);
  });

  socket.on(events.NOTARY_DELETE_TOOLS, (data) => {
    store.commit("document/SET_LOADER", true);
    setTimeout(() => {
      store.commit("document/SET_RESOURCE_TOOLS", JSON.parse(data));
      store.commit("document/SET_LOADER", false);
    }, 0);
  });

  socket.on(events.NOTARY_EDIT_TOOLS, (data) => {
    console.log(JSON.parse(data));
    setTimeout(() => {
      store.commit("document/SET_EDIT_RESOURCE_TOOL", JSON.parse(data));
    }, 10);
  });

  socket.on(events.NOTARY_COMPLETE_SESSION, () => {
    display_button.value = true;
    showEndSessionModal.value = true;
  });

  socket.on(events.NOTARY_CANCEL_SESSION, () => {
    window.location.href = "/document";
  });

  if (is_notary.value) {
    const data = {
      id: profile.value.id,
      name: `${profile.value.first_name} ${profile.value.last_name}`,
    };

    notary_ava_interval.value = setInterval(() => {
      socket.emit(events.NOTARY_AVAILABLE, JSON.stringify(data));
    }, 0);

    //300000 milliseconds (5mins)
    // setTimeout(() => {
    //   clearInterval(notary_ava_interval.value);
    // }, 5000);
  }

  setTimeout(() => {
    if (window.Tawk_API) window.Tawk_API.hideWidget();
  }, 2000);
});

onUnmounted(() => {
  clearInterval(notary_ava_interval.value);
  removeRecentUpload();
});
</script>

<style scoped>
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 5px;
}

.lds-ellipsis div {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #766458;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}

@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(24px, 0);
  }
}

.overflow-x-scroll {
  overflow-x: scroll !important;
}

.top-100 {
  top: 115% !important;
}

.custom-position {
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  height: 60px;
  z-index: 101;
}

.extra__button {
  padding: 1rem 0.5rem;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #dbe7ff;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
}

.header-navbar.floating-nav {
  top: 75px;
}

.dropdown-toggle::after,
.dropup .dropdown-toggle::after {
  vertical-align: 0 !important;
  height: 7px !important;
}

.btn-outline-primary:hover:not(.disabled):not(:disabled) {
  background-color: #003bb3;
  color: #fff;
}

.hover-remove.dropdown-item:focus,
.hover-remove.dropdown-item:hover {
  color: #000;
  background-color: #fff;
}

.dropdown-menu .hover-remove.dropdown-item {
  cursor: default;
}

.is-center {
  transform: translate3d(-45px, 34px, 0px) !important;
}

.custom-sm {
  display: none;
}

.coming-soon {
  display: inline-block;
  padding: 2px 5px;
  border-radius: 5px;
  font-size: 10px;
  font-weight: 700;
}

::-webkit-scrollbar {
  width: 2px;
  height: 2px;
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

.custom-width {
  width: 50%;
}

@media screen and (min-width: 320px) {
  .custom-width {
    width: 75%;
  }
}

@media screen and (min-width: 1200px) {
  .custom-width {
    width: 50%;
  }
}

@media screen and (max-width: 991.5px) {
  .header-navbar {
    display: none !important;
  }

  .custom-sm {
    display: block;
  }

  .custom-width {
    width: 50%;
  }

  .content-area-wrapper {
    margin-top: 1em !important;
    margin-bottom: 7rem !important;
  }
}
</style>
