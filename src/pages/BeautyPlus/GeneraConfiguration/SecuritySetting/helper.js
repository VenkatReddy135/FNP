import { SECURITY_SETTING_LIMITS } from "../../../../config/GlobalConfig";

/**
 * generates return object
 *
 * @param {string} message error message
 * @param {string} value dynamic number
 * @returns {object} object with message & error values
 */
const generateErrorBody = (message, value = "") => {
  return { message, value };
};

/**
 * validates all fields of security settings
 *
 * @param {object} editData security settings form data
 * @returns {boolean} depending on condition
 */
const validator = (editData) => {
  const {
    lockOutTime,
    loginOTPExpirationTimeFrame,
    maximumAllowedPasswordRecoveryAttemptsPerHour,
    maximumLoginAttemptsBeforeLockout,
    maximumPasswordLength,
    minimumPasswordLength,
    passwordLifetime,
    passwordRecoveryLinkExpiration,
    numberOfCharacterClassesForPassword,
  } = SECURITY_SETTING_LIMITS;

  if (!editData?.lockOutTime || editData?.lockOutTime > lockOutTime) {
    return generateErrorBody("lockOutTimeError", lockOutTime);
  }
  if (!editData?.loginOTPExpirationTimeFrame || editData?.loginOTPExpirationTimeFrame < loginOTPExpirationTimeFrame) {
    return generateErrorBody("loginOTPExpirationTimeFrameError", loginOTPExpirationTimeFrame);
  }
  if (
    !editData?.maximumLoginAttemptsBeforeLockout ||
    editData?.maximumLoginAttemptsBeforeLockout < maximumLoginAttemptsBeforeLockout
  ) {
    return generateErrorBody("maximumLoginAttemptsBeforeLockoutError", maximumLoginAttemptsBeforeLockout);
  }
  if (
    !editData?.maximumAllowedPasswordRecoveryAttemptsPerHour ||
    editData?.maximumAllowedPasswordRecoveryAttemptsPerHour < maximumAllowedPasswordRecoveryAttemptsPerHour
  ) {
    return generateErrorBody(
      "maximumAllowedPasswordRecoveryAttemptsPerHourError",
      maximumAllowedPasswordRecoveryAttemptsPerHour,
    );
  }
  if (!editData?.maximumPasswordLength || editData?.maximumPasswordLength > maximumPasswordLength) {
    return generateErrorBody("maximumPasswordLength", maximumPasswordLength);
  }
  if (!editData?.minimumPasswordLength || editData?.minimumPasswordLength < minimumPasswordLength) {
    return generateErrorBody("minimumPasswordLength", minimumPasswordLength);
  }
  if (editData?.minimumPasswordLength > editData?.maximumPasswordLength) {
    return generateErrorBody("minimumPasswordShouldBeLessThanMaximumPassword");
  }
  if (editData?.numberOfCharacterClassesForPassword?.length < numberOfCharacterClassesForPassword) {
    return generateErrorBody("numberOfCharacterClassesRequired");
  }
  if (!editData?.passwordLifetime || editData?.passwordLifetime < passwordLifetime) {
    return generateErrorBody("passwordLifetimeError", passwordLifetime);
  }
  if (
    !editData?.passwordRecoveryLinkExpiration ||
    editData?.passwordRecoveryLinkExpiration < passwordRecoveryLinkExpiration
  ) {
    return generateErrorBody("passwordRecoveryLinkExpirationError", passwordRecoveryLinkExpiration);
  }
  return false;
};

export default validator;
