import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  submitButton: {
    backgroundColor: "#FF9211",
    color: "#ffffff",
    width: "auto",
  },
  cancelButton: {
    color: "#FF9211",
    width: "auto",
    borderColor: "#FF9211",
  },
  buttonView: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
  },
}));

export default useStyles;
