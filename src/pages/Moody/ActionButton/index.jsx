import React, { useState } from "react";
import PropTypes from "prop-types";
import { Grid, Button } from "@material-ui/core";
import { useTranslate, useMutation, useNotify, useRefresh, useUnselectAll } from "react-admin";
import SimpleModal from "../../../components/CreateModal";
import CommonDialogContent from "../../../components/CommonDialogContent";
import { onSuccess, onFailure } from "../../../utils/CustomHooks";
import { TIMEOUT, reviewStatus } from "../../../config/GlobalConfig";

/**
 * Component for ActionButton, on click of these buttons, reviews are accepted or rejected
 *
 * @param {object} props all the props needed for Action Button component
 * @returns {React.ReactElement} returns Action Button component
 */
const ActionButton = (props) => {
  const { record, selectedIds } = props;
  const status = record?.approvalStatus;
  const translate = useTranslate();
  const [mutate, { loading }] = useMutation();
  const notify = useNotify();
  const refresh = useRefresh();
  const unselectAll = useUnselectAll();
  const [open, toggleModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { approved, rejected } = reviewStatus;

  /**
   * @function handleUpdateSuccess This function will handle Success on Update
   * @param {object} response object to get the response status
   */
  const handleUpdateSuccess = (response) => {
    refresh();
    notify(response?.data?.message, "info", TIMEOUT);
    unselectAll(`${window.REACT_APP_MOODY_SERVICE}moderation/reviews`);
  };

  /**
   * @function handleAction function called when reject button is clicked on Action column of grid.
   * @param {string}action string containing status to changed
   */
  const handleAction = (action) => {
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_MOODY_SERVICE}feedback/reviews`,
        payload: {
          data: {
            approvalStatus: action,
            reviewIds: selectedIds.length ? selectedIds : [record.id],
          },
        },
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess: handleUpdateSuccess });
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
        },
      },
    );
  };

  /**
   * @returns {React.Component} returns component
   */
  const DialogContent = () => {
    const len = selectedIds.length;
    if (len) {
      if (isApproved) {
        return (
          <CommonDialogContent
            message={`${translate("review_approval_confirmation")} ${len} ${translate("review_s")}?`}
          />
        );
      }
    }
    return (
      <CommonDialogContent message={`${translate("review_rejection_confirmation")} ${len} ${translate("review_s")}?`} />
    );
  };

  /**
   * @param {boolean} value for approve/reject buttons
   * @function reviewHandler function called when continue button is clicked on Action column of grid.
   * @returns {Function} function
   */
  const reviewHandler = (value) => {
    return value ? handleAction(approved) : handleAction(rejected);
  };

  /**
   * @function closeHandler function is called when cancel button is clicked on Confirmation popup.
   */
  const closeHandler = () => {
    toggleModal(false);
  };

  /**
   * @param {boolean} value for approve/reject buttons
   * @function reviewDecider function called when approve/reject button is clicked.
   * @returns {Function} function
   */
  const reviewDecider = (value) => {
    setIsApproved(value);
    return selectedIds.length ? toggleModal(true) : reviewHandler(value);
  };

  const isShow = Object.keys(reviewStatus).includes(status?.toLowerCase());

  return (
    <>
      {!isShow && (
        <Grid data-testid="action-button" container wrap="nowrap">
          <Button
            variant="outlined"
            onClick={() => {
              reviewDecider(false);
            }}
            disabled={selectedIds.length ? false : loading}
          >
            {translate("reject")}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              reviewDecider(true);
            }}
            disabled={selectedIds.length ? false : loading}
          >
            {translate("approve")}
          </Button>
        </Grid>
      )}
      <SimpleModal
        openModal={open}
        dialogContent={<DialogContent />}
        showButtons
        closeText={translate("cancel")}
        actionText={translate("continue")}
        handleClose={closeHandler}
        handleAction={() => {
          reviewHandler(isApproved);
        }}
      />
    </>
  );
};

ActionButton.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};
ActionButton.defaultProps = {
  record: {},
  selectedIds: [],
};

export default ActionButton;
