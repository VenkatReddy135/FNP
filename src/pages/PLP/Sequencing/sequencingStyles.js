import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  productItem: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
    width: "100%",
    fontSize: "16px",
    fontWeight: "500",
    lineHeight: "19px",
    letterSpacing: "0.01em",
    position: "relative",
  },
  productItemOverlay: {
    "&::after": {
      content: "''",
      position: "absolute",
      bottom: 0,
      background: "rgb(0 0 0 / 30%)",
      width: "100%",
      height: "100%",
    },
  },
  productInfoAlign: {
    padding: "15px",
  },
  imgBlock: {
    width: "100%",
  },
  productCode: {
    position: "absolute",
    right: "0px",
    top: "0px",
    left: "0px",
    background: "#000000",
    opacity: "0.6",
    color: "#ffffff",
    margin: "0px",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  colorGreen: {
    color: "#009D43",
  },
  orderShow: {
    position: "absolute",
    right: "5px",
    bottom: "5px",
  },
  orderNumber: {
    position: "absolute",
    right: "10px",
    bottom: "8px",
    fontSize: "32px",
    fontWeight: "500",
  },
  productNameDiv: {
    minHeight: "72px",
    marginBottom: "10px",
    zIndex: "2",
    position: "relative",
  },
  productNameWrap: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    wordWrap: "break-word",
    display: "-webkit-box",
    "-webkitLineClamp": "1",
    "-webkit-box-orient": "vertical",
  },
  colorRed: {
    color: "#FF0000",
  },
  findDialogWidth: {
    width: "840px",
    maxWidth: "840px",
  },
  btnFind: {
    width: "100%",
    marginTop: "10px",
  },
  formInputClass: {
    width: 70,
    margin: "0 5px 5px 0",
    position: "relative",
    zIndex: "2",
  },
  inputPadding: {
    padding: "5px 0px 5px 5px",
    textAlign: "center",
  },
  textUppercase: {
    textTransform: "capitalize",
  },
  productItemGrid: {
    maxWidth: "100%",
  },
  rowSequence: {
    display: "flex",
    alignItems: "center",
    minHeight: "525px",
    [`@media(min-width: 768px)`]: {
      minHeight: "580px",
    },
  },
  itemSequence: {
    padding: "10px",
  },
  listSequence: {
    height: "100%",
    margin: 0,
    padding: 0,
  },
  autoSizer: {
    overflow: "inherit",
    height: "100%",
    width: "0px",
  },
  sequenceUpdate: {
    float: "right",
  },
  toolbarHeight: {
    minHeight: 0,
  },
  moveProductSection: {
    textAlign: "center",
    display: "block",
  },
  sequenceBox: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default useStyles;
