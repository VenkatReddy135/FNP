import PropTypes from "prop-types";
import React, { useRef } from "react";
import { Tooltip, Snackbar, Button } from "@material-ui/core";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  closeIcon: {
    width: "14px",
    height: "14px",
    marginTop: "15px",
    position: "absolute",
    right: "-15px",
    cursor: "pointer",
    color: "white",
    opacity: "0.3",
  },
  copyToClip: {
    width: "18px",
    height: "20px",
    marginLeft: "20px",
    marginTop: "20px",
    cursor: "pointer",
  },
});
/**
 * Component for Tooltip for every record in the grid
 *
 * @param {*} props all the props needed for Tooltip
 * @returns {React.ReactElement} returns a ToolTip component
 */
const TooltipTextField = (props) => {
  const classes = useStyles();
  const { record } = props;
  // eslint-disable-next-line prefer-const
  const [copyToSuccess, setCopySuccess] = React.useState(null);
  const textAreaRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  let tooltip = null;

  /**
   * Function to update the state for opening tooltip
   *
   * @function handleTooltipOpen
   */
  const handleTooltipOpen = () => {
    setOpen(true);
  };
  /**
   * Function to update the state for opening tooltip
   *
   * @function handleTooltipClose
   */
  const handleTooltipClose = () => {
    setOpen(false);
  };

  /**
   * Function to copy tooltip text.
   *
   * @function copyToClipboard
   * @returns {React.ReactElement} material-ui snackbar component
   */
  const copyToClipboard = () => {
    const textToCopy = textAreaRef.current.textContent;
    navigator.clipboard.writeText(textToCopy);
    setCopySuccess(copyToSuccess);

    return (
      <Snackbar open={open} onClose={handleTooltipClose} message={copyToSuccess} anchorOrigin={("top", "center")} />
    );
  };
  const commentLength = record.comment.length;
  const tooltTipTitle = (
    <>
      <AssignmentOutlinedIcon className={classes.copyToClip} onClick={copyToClipboard} />
      <Button onClick={handleTooltipClose} className={classes.closeIcon}>
        <CloseOutlinedIcon />
      </Button>
      <p ref={textAreaRef} className="MuiTypography-root MuiTypography-body2">
        {record.comment}
      </p>
    </>
  );
  if (commentLength >= 16) {
    tooltip = (
      <>
        <Tooltip
          PopperProps={{
            disablePortal: true,
          }}
          open={open}
          onOpen={handleTooltipOpen}
          onClose={handleTooltipClose}
          arrow
          interactive
          title={tooltTipTitle}
        >
          <span className="MuiTypography-root MuiTypography-body2 comment-tooltip">{record.comment}</span>
        </Tooltip>
      </>
    );
  } else if (commentLength < 16) {
    tooltip = <span className="MuiTypography-root MuiTypography-body2">{record.comment}</span>;
  } else return null;
  return tooltip;
};

TooltipTextField.propTypes = {
  record: PropTypes.objectOf(PropTypes.any),
};

TooltipTextField.defaultProps = {
  record: {},
};

export default TooltipTextField;
