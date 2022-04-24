import ratingPG from "./ratingPG";
import newOrderPref from "./newOrderPref";
import allocationLogic from "./allocationLogic";
import allocationManager from "./allocationManager";
import carrierRating from "./carrierRating";
import fcCapacity from "./fcCapacity";
import manualAllocationPreference from "./manualAllocationPreference";
import manualAllocationPreferenceCarrier from "./manualAllocationPreferenceCarrier";

const enMessages = {
  ...ratingPG,
  ...newOrderPref,
  ...allocationLogic,
  ...allocationManager,
  ...carrierRating,
  ...fcCapacity,
  ...manualAllocationPreference,
  ...manualAllocationPreferenceCarrier,
};

export default enMessages;
