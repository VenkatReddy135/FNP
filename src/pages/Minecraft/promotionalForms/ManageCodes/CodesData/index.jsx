import { Grid, IconButton } from "@material-ui/core";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import VerticalAlignBottomOutlinedIcon from "@material-ui/icons/VerticalAlignBottomOutlined";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import { useMutation, useNotify, useTranslate } from "react-admin";
import DateTimeInput from "../../../../../components/CustomDateTimeV2";
import CustomTextInput from "../../../../../components/TextInput";
import { onFailure, onSuccess } from "../../../../../utils/CustomHooks";
import useRenderInput from "../../../PromotionHelper/useRenderInput";
import useStyles from "../../../style";

/**
 * @function CodesData Component used to show input field for coupon codes.
 * @param {object} props object which is required dependencies for CodesData Component.
 * @param {boolean} props.edit to choose whether to show editable field or not.
 * @param {Array} props.data have all the information about the coupon codes.
 * @param {object} props.formValues have the master forms values.
 * @param {function(number):void} props.updateCodes handle the updation of current coupon codes.
 * @param {function(number):void} props.deleteCodes handle the deletion of current coupon codes.
 * @returns {React.ReactElement} react-admin resource.
 */
const CodesData = (props) => {
  const { edit, data: codes, type, formValues, updateCodes, deleteCodes } = props;

  const classes = useStyles();

  const translate = useTranslate();
  const notify = useNotify();
  const [mutate] = useMutation();

  const [renderFromDateInput, fromDateRemount] = useRenderInput();
  const [renderThruDateInput, thruDateRemount] = useRenderInput();

  const [selectedIndex, setSelectedIndex] = useState(null);

  /**
   * @function handleExportCodesSuccess handle success of export code.
   * @param {object} response success response data.
   */
  const handleExportCodesSuccess = useCallback(
    (response) => {
      notify(response.data.message || translate("code_exported_successful"));
    },
    [notify, translate],
  );

  /**
   * @function handleExportCodesFailure handle failure of export code.
   * @param {object} response error response data.
   */
  const handleExportCodesFailure = useCallback(
    (response) => {
      notify(response.errorMessage || translate("code_exported_failed"));
    },
    [notify, translate],
  );

  /**
   * @function exportCodes capture the response for exporting coupons data.
   */
  const exportCodes = useCallback(
    (batchId) => {
      mutate(
        {
          type: "getOne",
          resource: `minecraft/v1/coupons/export/${batchId}?exportFileFormat=csv`,
          payload: {},
        },
        {
          onSuccess: (response) => {
            onSuccess({ response, notify, translate, handleSuccess: handleExportCodesSuccess });
          },
          onFailure: (error) => {
            onFailure({ error, notify, translate, handleFailure: handleExportCodesFailure });
          },
        },
      );
    },
    [notify, mutate, translate, handleExportCodesSuccess, handleExportCodesFailure],
  );

  /**
   * @function handleChange handle the updation of codes fields.
   * @param {event} event contains the value of field to be updates.
   * @param {object} value all required values.
   * @param {string} value.fieldName name of field to be update.
   * @param {string} value.index index of current code object.
   * @param {string} value.itemId id of current code object.
   */
  const handleChange = (event, { fieldName, index, itemId }) => {
    const id = itemId ?? index;
    updateCodes(event, { fieldName, id });
  };

  /**
   * @function showFromDate handle rendering of from date.
   * @param {number} index  current index of code data.
   * @returns {boolean} returns true for current selected index.
   */
  const showFromDate = (index) => {
    return renderFromDateInput || selectedIndex !== index;
  };

  /**
   * @function showEndDate handle rendering of thru date.
   * @param {number} index  current index of code data.
   * @returns {boolean} returns true for current selected index.
   */
  const showEndDate = (index) => {
    return renderThruDateInput || selectedIndex !== index;
  };

  /**
   * @function handleChangeFromDate handle changes requried for from date update.
   * @param {object} e event.
   * @param {number} index current index.
   * @param {object} item current code data.
   */
  const handleChangeFromDate = (e, index, item) => {
    setSelectedIndex(index);
    if (!formValues[type][index].fromDate) fromDateRemount();
    if (
      formValues[type][index].thruDate &&
      new Date(e.target.value) > new Date(formValues[type][index].thruDate.split("T")[0])
    ) {
      handleChange(e, { fieldName: "resetThruDate", index, itemId: item.id });
      thruDateRemount();
    } else handleChange(e, { fieldName: "fromDate", index, itemId: item.id });
  };

  /**
   * @function handleChangeThruDate handle changes requried for from date update.
   * @param {object} e event.
   * @param {number} index current index.
   * @param {object} item current code data.
   */
  const handleChangeThruDate = (e, index, item) => {
    setSelectedIndex(index);
    if (!formValues[type][index].thruDate) {
      thruDateRemount();
    }
    handleChange(e, { fieldName: "thruDate", index, itemId: item.id });
  };

  return (
    <>
      {codes.map((item, index) => (
        <Grid container item md={12} direction="row" className={classes.gridGap} key={item.id} data-testid="codes">
          <Grid item md={4} className={classes.maxWidthWrap}>
            <CustomTextInput
              source={`${type}[${index}].code`}
              label={translate("code")}
              autoComplete="off"
              variant="standard"
              value={item.code}
              edit={item.batchId ? false : edit}
              onChange={(e) => {
                handleChange(e, { fieldName: "code", index, itemId: item.id });
              }}
            />
          </Grid>
          <Grid item md={4} className={classes.maxWidthWrap}>
            {showFromDate(index) && (
              <DateTimeInput
                source={`${type}[${index}].fromDate`}
                label={translate("promotion_start_date")}
                disabled={!edit}
                value={item.fromDate}
                onChange={(e) => handleChangeFromDate(e, index, item)}
                minDate={new Date(formValues?.fromDate?.split("T")[0]).toISOString().split("T")[0]}
                maxDate={new Date(formValues?.thruDate?.split("T")[0]).toISOString().split("T")[0]}
              />
            )}
          </Grid>
          <Grid item md={4} className={classes.maxWidthWrap}>
            {showEndDate(index) && (
              <DateTimeInput
                source={`${type}[${index}].thruDate`}
                label={translate("promotion_end_date")}
                disabled={!edit}
                value={item.thruDate}
                onChange={(e) => handleChangeThruDate(e, index, item)}
                minDate={
                  formValues[type][index].fromDate
                    ? new Date(formValues[type][index].fromDate.split("T")[0]).toISOString().split("T")[0]
                    : new Date(formValues.fromDate.split("T")[0]).toISOString().split("T")[0]
                }
                maxDate={new Date(formValues.thruDate.split("T")[0]).toISOString().split("T")[0]}
              />
            )}
          </Grid>
          <Grid item className={classes.atachAtEnd}>
            {edit ? (
              <IconButton style={{ strokeWidth: "1", display: "block" }} onClick={() => deleteCodes(index)}>
                <DeleteOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton style={{ strokeWidth: "1", marginTop: "-14px" }}>
                <VerticalAlignBottomOutlinedIcon onClick={() => exportCodes(item.batchId)} />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};

CodesData.propTypes = {
  edit: PropTypes.bool,
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
  type: PropTypes.string.isRequired,
  formValues: PropTypes.objectOf(PropTypes.any).isRequired,
  updateCodes: PropTypes.func.isRequired,
  deleteCodes: PropTypes.func.isRequired,
};

CodesData.defaultProps = {
  edit: true,
};
export default CodesData;
