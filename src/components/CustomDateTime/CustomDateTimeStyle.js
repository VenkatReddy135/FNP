import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  timePicker: {
    minWidth: "75px",
  },
  pointer: {
    cursor: "text",
    "&::-webkit-calendar-picker-indicator": {
      cursor: "pointer",
    },
  },
}));

export default useStyles;
