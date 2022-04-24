/* eslint-disable import/no-extraneous-dependencies */
import { Box, Button, Divider, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useLogout, useTranslate } from "react-admin";
import { useDispatch } from "react-redux";
import userInfo from "./mock-user-data";
import { setTagValue, getTagListSuccess } from "../../actions/domain";
import { setOccasionData } from "../../actions/freemessagecard";
/**
 *
 * useStyles function to apply material-ui style on Footer component
 *
 * @function useStyles
 */
const useStyles = makeStyles({
  boxClass: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  fullWidth: {
    width: "100%",
  },
  subTitles: {
    color: "#222222",
    fontSize: "14px",
    fontWeight: "550",
    letterSpacing: "0px",
  },
  subTitle1: {
    margin: "10px 15px 0px 15px",
  },
  subTitle2: {
    margin: "0px 15px 14px 15px",
  },
  caption: {
    color: "#555555",
    fontSize: "12px",
  },
  captionOrg: {
    margin: "12px 14px 0px 15px",
  },
  btnClass: {
    margin: "18px 67px 10px 74px",
    color: "#FF9212",
    borderColor: "#FF9212",
    width: "107px",
    height: "36px",
    display: "flex",
    fontSize: "12px",
    "&:hover": {
      color: "#F68808",
      backgroundColor: "#FFFFFF",
    },
  },
});
/**
 * @param {object} props props contains userprofile
 * @returns {React.createElement} QuickLinks
 */
const Logout = (props) => {
  const classes = useStyles();
  const { userProfile } = props;
  const translate = useTranslate();
  const logout = useLogout();
  const dispatch = useDispatch();

  /**
   *
   * @function handleLogout
   * Used to call the logout function
   */
  const handleLogout = () => {
    dispatch(setTagValue({ tagType: "domainData", value: "" }));
    dispatch(getTagListSuccess({ tagType: "domainData", list: [] }));
    dispatch(setTagValue({ tagType: "geoData", value: "" }));
    dispatch(getTagListSuccess({ tagType: "geoData", list: [] }));
    localStorage.setItem("selectedCategoryId", "");
    localStorage.setItem("selectedAssociationId", "");
    dispatch(setOccasionData({ selectedOccasion: {} }));
    logout();
  };
  return (
    <>
      <Box className={classes.boxClass}>
        <Typography variant="subtitle1" className={`${classes.subTitles} ${classes.subTitle1}`}>
          {userProfile?.username}
        </Typography>
        <Typography variant="caption" className={`${classes.caption} ${classes.captionOrg}`}>
          {translate("default_organization")}
        </Typography>
        <Typography variant="subtitle1" className={`${classes.subTitles} ${classes.subTitle2}`}>
          {userInfo.defaultOrganization}
        </Typography>
      </Box>
      <Divider className={classes.fullWidth} />
      <Button
        data-at-id="btnLogout"
        variant="outlined"
        className={classes.btnClass}
        size="small"
        onClick={handleLogout}
      >
        {translate("sign_out")}
      </Button>
    </>
  );
};

Logout.propTypes = {
  userProfile: PropTypes.objectOf(PropTypes.any),
};

Logout.defaultProps = {
  userProfile: {},
};

export default Logout;
