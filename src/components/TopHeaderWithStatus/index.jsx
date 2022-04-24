import PropTypes from "prop-types";
import React from "react";
import { Grid, Typography, makeStyles, Divider } from "@material-ui/core";
import WorkFlowStatus from "../WorkFlowStatus/index";
import SwitchComp from "../switch/index";
import GridActions from "../GridActionButtons";
/**
 * makeStyles hook of material-ui to apply style for status component
 *
 * @function
 * @name useStyles
 */
const useStyles = makeStyles({
  dividerStyle: {
    margin: "7px 10px",
    color: "#E5E5E5",
    height: "20px",
  },
  actionBtn: {
    top: "55px",
    position: "absolute",
    right: "0px",
  },
  containerHeader: {
    position: "relative",
  },
});
/**
 * Component for top header displaying category id as  title, workflow and isEnabled status.Also it will show action buttons
 *
 * @param {*} props all the props required for workflow icon
 * @returns {React.ReactElement} returns a React component for workflow status.
 */
const TopHeaderWithStatus = (props) => {
  const classes = useStyles();
  const {
    id,
    actionButtonsForGrid,
    showHeaderStatus,
    showButtons,
    enableValTH,
    workFlowStateTH,
    setEnableFuncTH,
    isEditable,
  } = props;
  return (
    <>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        className={classes.containerHeader}
      >
        {showHeaderStatus ? (
          <Grid container item md={9} direction="row" justify="flex-start" alignItems="center">
            <Typography variant="h5" color="inherit">
              {id}
            </Typography>
            <Divider className={classes.dividerStyle} orientation="vertical" flexItem />
            <WorkFlowStatus record={workFlowStateTH} />
            <SwitchComp record={enableValTH} onChange={setEnableFuncTH} disable={!isEditable} />
          </Grid>
        ) : (
          <br />
        )}
        {showButtons ? (
          <Grid container item lg={3} className={classes.actionBtn}>
            <GridActions actionButtonsForGrid={actionButtonsForGrid} />
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};

TopHeaderWithStatus.propTypes = {
  id: PropTypes.string.isRequired,
  enableValTH: PropTypes.bool,
  workFlowStateTH: PropTypes.string,
  showHeaderStatus: PropTypes.bool,
  showButtons: PropTypes.bool,
  actionButtonsForGrid: PropTypes.arrayOf(PropTypes.object),
  setEnableFuncTH: PropTypes.func,
  isEditable: PropTypes.bool,
};
TopHeaderWithStatus.defaultProps = {
  enableValTH: false,
  workFlowStateTH: "",
  showHeaderStatus: false,
  showButtons: false,
  actionButtonsForGrid: null,
  setEnableFuncTH: () => {},
  isEditable: false,
};

export default TopHeaderWithStatus;
