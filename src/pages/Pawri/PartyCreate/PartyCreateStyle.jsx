import { makeStyles } from "@material-ui/core/styles";

const partyStyles = makeStyles(() => ({
  gridContainer: {
    marginBottom: "5px",
    width: "auto",
  },
  addOtherRolesButton: {
    fontSize: "18px",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.0)",
    },
  },
}));

export default partyStyles;
