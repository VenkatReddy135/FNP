/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useCallback } from "react";
import EditIcon from "@material-ui/icons/Edit";
import { SimpleForm, RadioButtonGroupInput, useTranslate, Toolbar, Button, SaveButton, required } from "react-admin";
import { Grid } from "@material-ui/core";
import PropTypes from "prop-types";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dropdown from "../../../../components/Dropdown";
import CustomNumberInput from "../../../../components/NumberInput";
import { useStyles } from "../../Website_Config_Style";
import CustomViewUI from "../../../../components/CustomViewUI/CustomViewUI";

/**
 * security setting view component
 *
 * @param {props} props all the props required by Simple Grid
 * @returns {React.ReactElement} returns a React component for Simple Grid
 */
const SecuritySettingView = ({
  securitySettingDetails,
  edit,
  setEdit,
  handleChangeCheckBox,
  classesForPasswordList,
  handleCancelButton,
  updateSecuritySettingFun,
}) => {
  const symbolsArr = ["e", "E", "+", "-"];
  const passwordClassesData = securitySettingDetails?.numberOfCharacterClassesForPassword;
  const [checkBoxes, setCheckBoxes] = useState(
    classesForPasswordList.map((val) => {
      return {
        label: val.label,
        value: val.value,
        checked: passwordClassesData?.includes(val.value) || false,
      };
    }),
  );

  const [selectAll, setSelectAll] = useState(passwordClassesData?.length === classesForPasswordList?.length || false);

  const classes = useStyles();
  const { cancelButton, submitButton, editIcon, editView, fullWidth, editLabelText, labelText, fromView } = classes;

  const translate = useTranslate();

  /**
   * @param {object} props props
   * @returns {React.Component} return component
   */
  const CustomToolbar = (props) => (
    <Toolbar {...props}>
      <Button
        type="button"
        label={translate("cancel")}
        variant="outlined"
        onClick={handleCancelButton}
        className={cancelButton}
      />
      <SaveButton label={translate("update")} icon={<></>} className={submitButton} />
    </Toolbar>
  );

  /**
   * handle on keypressdown Event
   *
   * @param {object} e Event object
   * @returns {Function} return function to add validation
   */
  const handleKeydownEvent = useCallback((e) => symbolsArr.includes(e.key) && e.preventDefault(), []);

  /**
   * handle on CheckboxEvent
   *
   * @param {number} val index of the checkbox
   */
  const handleCheckboxEvent = (val = null) => {
    const tempArr = checkBoxes;
    if (val !== null) {
      tempArr[val] = { ...tempArr[val], checked: !tempArr[val].checked };
    }
    const listForUpdate = tempArr.filter((item) => item.checked);
    if (listForUpdate.length === classesForPasswordList.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    setCheckBoxes([...tempArr]);
    handleChangeCheckBox([...listForUpdate]);
  };

  /**
   * handle all checkbox
   *
   */
  const handleAll = () => {
    const isAll = !selectAll;
    const tempArr = checkBoxes.map((item) => {
      return { ...item, checked: isAll };
    });
    setSelectAll(isAll);
    setCheckBoxes([...tempArr]);
    handleChangeCheckBox(tempArr.filter((item) => item.checked));
  };

  useEffect(() => {
    handleCheckboxEvent();
  }, []);

  return (
    <SimpleForm
      className={fromView}
      variant="standard"
      save={updateSecuritySettingFun}
      toolbar={edit ? <CustomToolbar /> : null}
    >
      {!edit && (
        <Grid className={editView}>
          <EditIcon className={editIcon} onClick={() => setEdit(!edit)} />
        </Grid>
      )}
      <Grid container spacing={5} className={fullWidth}>
        {edit ? (
          <Grid item xs={12} sm={4} md={4}>
            <RadioButtonGroupInput
              name="adminAccountSharing"
              defaultValue={securitySettingDetails?.adminAccountSharing}
              row
              label={translate("adminAccountSharing")}
              source="adminAccountSharing"
              validate={required()}
              choices={[
                { id: "Yes", name: "Yes" },
                { id: "No", name: "No" },
              ]}
            />
          </Grid>
        ) : (
          <CustomViewUI label={translate("adminAccountSharing")} value={securitySettingDetails?.adminAccountSharing} />
        )}
        {edit ? (
          <Dropdown
            label="passwordResetProtectionType"
            value={securitySettingDetails?.passwordResetProtectionType}
            validate={required()}
            data={[
              { id: translate("byEmailAddressOnly"), name: translate("byEmailAddressOnly") },
              { id: translate("byMobileNumberOnly"), name: translate("byMobileNumberOnly") },
              { id: translate("byEmailAddressAndMobileNumber"), name: translate("byEmailAddressAndMobileNumber") },
              { id: translate("byEmailAddressOrMobileNumber"), name: translate("byEmailAddressOrMobileNumber") },
            ]}
            edit={edit}
          />
        ) : (
          <CustomViewUI
            label={translate("passwordResetProtectionType")}
            value={securitySettingDetails?.passwordResetProtectionType}
          />
        )}

        {edit ? (
          <CustomNumberInput
            label="passwordRecoveryLinkExpiration"
            value={securitySettingDetails?.passwordRecoveryLinkExpiration}
            validate={required()}
            edit={edit}
            typeText="Minutes Only"
            onKeyDown={handleKeydownEvent}
          />
        ) : (
          <CustomViewUI
            label={translate("passwordRecoveryLinkExpiration")}
            value={`${securitySettingDetails?.passwordRecoveryLinkExpiration} - Minutes Only`}
          />
        )}
      </Grid>

      <Grid container spacing={5} className={fullWidth}>
        {edit ? (
          <CustomNumberInput
            label="maximumAllowedPasswordRecoveryAttemptsPerHour"
            value={securitySettingDetails?.maximumAllowedPasswordRecoveryAttemptsPerHour}
            edit={edit}
            validate={required()}
            typeText="Maximum Allowed"
            onKeyDown={handleKeydownEvent}
          />
        ) : (
          <CustomViewUI
            label={translate("maximumAllowedPasswordRecoveryAttemptsPerHour")}
            value={`${securitySettingDetails?.maximumAllowedPasswordRecoveryAttemptsPerHour} - Maximum Allowed`}
          />
        )}
        {edit ? (
          <CustomNumberInput
            label="lockOutTime"
            value={securitySettingDetails?.lockOutTime}
            edit={edit}
            validate={required()}
            typeText="Minutes Only"
            onKeyDown={handleKeydownEvent}
          />
        ) : (
          <CustomViewUI
            label={translate("lockOutTime")}
            value={`${securitySettingDetails?.lockOutTime} - Minutes Only`}
          />
        )}
        {edit ? (
          <CustomNumberInput
            label="maximumLoginAttemptsBeforeLockout"
            value={securitySettingDetails?.maximumLoginAttemptsBeforeLockout}
            edit={edit}
            validate={required()}
            typeText="Maximum Allowed"
            onKeyDown={handleKeydownEvent}
          />
        ) : (
          <CustomViewUI
            label={translate("maximumLoginAttemptsBeforeLockout")}
            value={`${securitySettingDetails?.maximumLoginAttemptsBeforeLockout} - Maximum Allowed`}
          />
        )}
      </Grid>

      <Grid container spacing={5} className={fullWidth}>
        {edit ? (
          <CustomNumberInput
            label="passwordLifetime"
            value={securitySettingDetails?.passwordLifetime}
            edit={edit}
            validate={required()}
            typeText="Days"
            onKeyDown={handleKeydownEvent}
          />
        ) : (
          <CustomViewUI
            label={translate("passwordLifetime")}
            value={`${securitySettingDetails?.passwordLifetime} - Days`}
          />
        )}
        {edit ? (
          <CustomNumberInput
            label="minimumPasswordLength"
            value={securitySettingDetails?.minimumPasswordLength}
            edit={edit}
            validate={required()}
            typeText="Characters"
          />
        ) : (
          <CustomViewUI
            label={translate("minimumPasswordLength")}
            value={`${securitySettingDetails?.minimumPasswordLength} - Characters`}
          />
        )}
        {edit ? (
          <CustomNumberInput
            label="maximumPasswordLength"
            value={securitySettingDetails?.maximumPasswordLength}
            validate={required()}
            edit={edit}
            typeText="Characters"
          />
        ) : (
          <CustomViewUI
            label={translate("maximumPasswordLength")}
            value={`${securitySettingDetails?.maximumPasswordLength} - Characters`}
          />
        )}
      </Grid>
      <Grid container spacing={5} className={fullWidth}>
        <Grid item xs={12} sm={12} md={12}>
          <Grid className={!edit ? labelText : editLabelText}>{translate("numberOfCharacterClassesForPassword")}</Grid>

          {!edit ? (
            <CustomViewUI
              value={
                passwordClassesData?.map(
                  (val, index) => `${translate(val)}${index < passwordClassesData.length - 1 ? "," : ""} `,
                ) || null
              }
            />
          ) : (
            <FormGroup row>
              <FormControlLabel
                key="all"
                control={<Checkbox key="all" name={translate("all")} onChange={handleAll} checked={selectAll} />}
                label={translate("all")}
              />
              {checkBoxes.map((item, index) => (
                <FormControlLabel
                  key={item}
                  control={
                    <Checkbox
                      key={item}
                      name={item.label}
                      onChange={() => {
                        handleCheckboxEvent(index);
                      }}
                      checked={item.checked}
                    />
                  }
                  label={item.label}
                />
              ))}
            </FormGroup>
          )}
        </Grid>
      </Grid>
      <Grid container spacing={5} className={fullWidth}>
        {edit ? (
          <CustomNumberInput
            label="loginOTPExpirationTimeFrame"
            value={securitySettingDetails?.loginOTPExpirationTimeFrame}
            edit={edit}
            validate={required()}
            typeText="Seconds"
          />
        ) : (
          <CustomViewUI
            label={translate("loginOTPExpirationTimeFrame")}
            value={`${securitySettingDetails?.loginOTPExpirationTimeFrame} - Seconds`}
          />
        )}
      </Grid>
    </SimpleForm>
  );
};

SecuritySettingView.propTypes = {
  edit: PropTypes.bool.isRequired,
  securitySettingDetails: PropTypes.objectOf(Object),
  setEdit: PropTypes.func.isRequired,
  handleChangeCheckBox: PropTypes.func.isRequired,
  classesForPasswordList: PropTypes.arrayOf(String),
  handleCancelButton: PropTypes.func.isRequired,
  updateSecuritySettingFun: PropTypes.func.isRequired,
};
SecuritySettingView.defaultProps = {
  securitySettingDetails: null,
  classesForPasswordList: [],
};

export default SecuritySettingView;
