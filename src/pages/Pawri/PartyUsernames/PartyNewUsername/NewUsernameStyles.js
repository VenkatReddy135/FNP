import { makeStyles } from "@material-ui/core/styles";

const partyStyles = makeStyles(() => ({
  alignment: {
    marginLeft: "2px",
  },
  password: {
    borderStyle: "solid",
    borderWidth: "1px",
    marginRight: "5px",
    visibility: "Visible",
    position: "absolute",
    zIndex: "1",
  },
  ruleActive: {
    marginLeft: "5%",
    color: "green",
  },
  ruleInactive: {
    marginLeft: "5%",
    color: "red",
  },
}));

export default partyStyles;
