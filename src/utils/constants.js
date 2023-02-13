export const type = Object.freeze({
  // template type constant
  Template: "Template",
  Upload: "Upload",
  Custom: "Custom",
  // schedule type constant
  Immediate: "Immediate",
  Schedule: "Schedule",
});

export const events = Object.freeze({
  JOIN_ROOM_MESSAGE: "JOIN_ROOM_MESSAGE",
  NOTARY_AVAILABLE: "NOTARY_AVAILABLE",
  NOTARY_SEND_TOOLS: "NOTARY_SEND_TOOLS",
  NOTARY_EDIT_TOOLS: "NOTARY_EDIT_TOOLS",
  NOTARY_DELETE_TOOLS: "NOTARY_DELETE_TOOLS",
  NOTARY_COMPLETE_SESSION: "NOTARY_COMPLETE_SESSION",
  NOTARY_CANCEL_SESSION: "NOTARY_CANCEL_SESSION",
  REMOVE: "REMOVE",
});
