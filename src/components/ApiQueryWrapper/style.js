import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  wrapper: {
    "&>div": {
      padding: "0px!important",
      "&>div>div": {
        maxWidth: "90%",
        width: "100%",
      },
    },
  },
}));
export default useStyles;
