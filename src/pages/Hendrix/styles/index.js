import { makeStyles } from "@material-ui/core/styles";

/**
 * makeStyles hook of material-ui to apply common style for any components
 *
 *  @function useStyles
 */
const useStyles = makeStyles({
  pageSimpleForm: {
    display: "flex",
    alignItems: "center",
  },
  dropdownContainer: {
    width: "180px",
  },
  saveBtn: {
    margin: "0px 0px 25px 50px",
  },
  updateBtn: {
    position: "absolute",
    top: "90px",
    right: "30px",
  },
  container: {
    padding: "20px 10px 40px",
    display: "flex",
    alignItems: "center",
  },
  textField: {
    width: "400px",
  },
  textFields: {
    marginRight: "25px",
  },
  listBtn: {
    margin: "0px 0px 25px 50px",
  },
  templateDropdown: {
    width: "100%",
    minWidth: "350px",
  },
  select: {
    "& ul": {
      width: "330px",
      maxHeight: "150px",
    },
  },
  ruleContainer: {
    margin: "150px 0px 0px 100px",
  },
  headerActionButton: {
    position: "absolute",
    right: "20px",
  },
  actionBtn: {
    position: "relative",
    top: "90px",
  },
  actionBtndetail: {
    position: "relative",
    top: "90px",
    marginLeft: "50px",
  },
  calendarView: {
    height: "55px",
    alignItems: "center",
    marginBottom: "55px",
    marginLeft: "20px",
  },
  // New fc
  // split button
  splitButtonWrapper: {
    border: "1px solid #FF9212",
    borderRadius: "5px",
    color: "#FF9212",
    fontSize: "16px",
    fontWeight: "600",
    marginRight: "0px",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    "&:hover": {
      color: "#F68808",
      backgroundColor: "#FFFFFF",
      border: "1px solid #FF9212",
    },
  },
  splitButtonPaper: {
    width: "230px",
    height: "40px",
  },
  newFcdropdown: {
    marginRight: "25px",
  },
});

export default useStyles;
