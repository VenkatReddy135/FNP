import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, useTranslate, useMutation, useRefresh, useNotify } from "react-admin";
import { DialogContent, Typography } from "@material-ui/core";
import SimpleModel from "../../../components/CreateModal";
import { TIMEOUT } from "../../../config/GlobalConfig";
import { onSuccess, onFailure } from "../../../utils/CustomHooks";

/**
 * This component Move Courier to Bottom of the Product
 *
 * @param {object} props resource configuration
 * @returns {React.ReactElement} Move Courier to Bottom Component
 */
const MoveCourierBottom = (props) => {
  const translate = useTranslate();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [disableYes, setDisableYes] = useState(false);
  const [mutate] = useMutation();
  const refresh = useRefresh();
  const notify = useNotify();
  const { id } = props;

  /**
   * @function showPopup To show pop up ofMove Courier to Bottom
   */
  const showPopup = () => {
    setOpenConfirmModal(true);
  };

  /**
   * @function closePopup To close pop up of Move Courier to Bottom
   */
  const closePopup = () => {
    setOpenConfirmModal(false);
  };

  /**
   * @function handleSuccess to handle success of the API
   * @param {object} res api res
   */
  const handleSuccess = (res) => {
    notify(res.data?.message, "info", TIMEOUT);
    refresh();
  };

  /**
   * Function To confirm the yes action button
   *
   * @name handleConfirmationYes
   */
  const handleConfirmationYes = () => {
    setDisableYes(true);
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/categories/products/movecourierbottom/${id}`,
        payload: {},
      },
      {
        onSuccess: (response) => {
          onSuccess({ response, notify, translate, handleSuccess });
          setDisableYes(false);
          closePopup();
        },
        onFailure: (error) => {
          onFailure({ error, notify, translate });
          setDisableYes(false);
          closePopup();
        },
      },
    );
  };

  /**
   * @function dialogContent
   * @returns {React.createElement} returning ui for Move Courier to Bottom product page
   * @param {string } message name of the action
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <Typography variant="h7">{message}</Typography>
      </DialogContent>
    );
  };

  return (
    <>
      <Button
        variant="outlined"
        data-at-id="addbtn"
        label={translate("move_cou.button_move_cou")}
        onClick={showPopup}
      />
      <SimpleModel
        dialogContent={dialogContent(translate("move_cou.move_cou_bottom"))}
        showButtons
        closeText={translate("no_button_label")}
        actionText={translate("yes_button_label")}
        openModal={openConfirmModal}
        handleClose={closePopup}
        handleAction={handleConfirmationYes}
        isDisable={disableYes}
      />
    </>
  );
};

MoveCourierBottom.propTypes = {
  id: PropTypes.string.isRequired,
};

export default MoveCourierBottom;
