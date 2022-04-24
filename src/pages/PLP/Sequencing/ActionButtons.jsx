import React from "react";
import PropTypes from "prop-types";
import { Button, useTranslate } from "react-admin";
import FindProduct from "./FindProduct";
import MoveCourierBottom from "./MoveCourierBottom";
import useStyles from "./sequencingStyles";
/**
 * This component will display the buttons
 *
 * @param {object} props contains data related to Action buttons
 * @returns {React.ReactElement} Action Item  Component.
 */
const ActionButtons = (props) => {
  const { showSuppressed, changedSequence, id, showPopup } = props;
  const classes = useStyles();
  const translate = useTranslate();
  const buttonLabelMessage = !showSuppressed
    ? translate("product_sequence.button_show_products")
    : translate("product_sequence.button_hide_products");

  const suppressedMessage = !showSuppressed
    ? translate("product_sequence.show_title_products")
    : translate("product_sequence.hide_title_product");

  const isUpdateDisable = changedSequence.length === 0;
  return (
    <>
      <FindProduct id={id} />
      <Button
        variant="outlined"
        data-at-id="addbtn"
        label={buttonLabelMessage}
        onClick={() => showPopup(suppressedMessage, "suppressed")}
      />
      <MoveCourierBottom id={id} />
      <Button
        variant="contained"
        data-at-id="updatebtn"
        className={classes.sequenceUpdate}
        disabled={isUpdateDisable}
        label={translate("update")}
        onClick={() => showPopup(translate("update_message"), "update")}
      />
    </>
  );
};

ActionButtons.propTypes = {
  changedSequence: PropTypes.arrayOf(PropTypes.object).isRequired,
  showSuppressed: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  showPopup: PropTypes.func.isRequired,
};

export default ActionButtons;
