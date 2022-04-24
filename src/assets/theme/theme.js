import { createMuiTheme } from "@material-ui/core/styles";
import { defaultTheme } from "react-admin";

const theme = createMuiTheme({
  ...defaultTheme,
  typography: {
    subtitle1: {
      fontSize: "20px",
      color: "#222222",
      fontWeight: "550",
      marginTop: "20px",
      marginBottom: "20px",
    },
    caption: {
      fontSize: "13px",
      color: "#9B9B9B",
    },
    subtitle2: {
      fontSize: "16px",
      color: "#222222",
      fontWeight: "550",
      textOverflow: "ellipsis",
    },
    h5: {
      fontSize: "20px",
      color: "#222222",
      fontWeight: "550",
      textOverflow: "ellipsis",
      margin: "7px 14px 0 0",
    },
    h6: {
      fontSize: "16px",
      color: "#222222",
      fontWeight: "550",
      textOverflow: "ellipsis",
    },
    h4: {
      fontSize: "20px",
      color: "#222222",
      fontWeight: "550",
      marginTop: "6px",
      marginBottom: 0,
      marginRight: "15px",
    },
  },
  palette: {
    text: {
      fontSize: "16px",
    },
  },
  sidebar: {
    width: 0,
    closedWidth: 0,
    position: "absolute",
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          margin: 0,
          fontSize: "16px",
          lineHeight: "normal",
          letterSpacing: "normal",
          color: "rgb(0, 0, 0)",
          backgroundColor: "rgba(0, 0, 0, 0)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,Droid Sans, Helvetica Neue, sans-serif",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
      },
    },
    container: {
      marginBottom: "40px",
      width: "auto",
    },
    MuiPaper: {
      root: {
        backgroundColor: "#fafafa",
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: "#fafafa",
        "&:hover": {
          backgroundColor: "#fafafa",
        },
        "& .Mui-disabled": {
          backgroundColor: "#fafafa",
          color: "#000000",
        },
      },
    },
    MuiInputBase: {
      root: {
        "&$disabled ": {
          color: "#222222",
          fontWeight: 550,
          fontSize: "16px",
        },
      },
      inputMarginDense: {
        color: "#222222",
        fontSize: "16px",
        fontWeight: "550",
        paddingLeft: "10px",
        paddingTop: "8px",
      },
      input: {
        textOverflow: "ellipsis",
        "&::placeholder": {
          color: "#898989",
        },
      },
    },
    MuiDialog: {
      paperWidthSm: {
        maxWidth: "100%",
      },
    },
    MuiDialogActions: {
      root: {
        margin: "auto",
        marginBottom: "20px",
      },
    },
    MuiFormControl: {
      root: {
        backgroundColor: "#fafafa",
      },
      marginNormal: {
        marginTop: "7px",
      },
    },
    MuiButton: {
      root: {
        height: "40px",
        padding: "4px 16px",
      },
      containedPrimary: {
        borderRadius: "4px",
        marginRight: "15px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#FFFFFF",
        boxShadow: "none",
        backgroundColor: "#FF9212",
        whiteSpace: "nowrap",
        "&:hover": {
          color: "#FFFFFF",
          backgroundColor: "#F68808",
          boxShadow: "none",
        },
      },
      containedSizeSmall: {
        fontSize: "16px",
      },
      outlinedPrimary: {
        border: "1px solid #FF9212",
        borderRadius: "4px",
        color: "#FF9212",
        fontSize: "16px",
        fontWeight: "600",
        marginRight: "20px",
        whiteSpace: "nowrap",
        background: "#FFFFFF 0% 0% no-repeat padding-box",
        "&:hover": {
          color: "#F68808",
          backgroundColor: "#FFFFFF",
          border: "1px solid #FF9212",
        },
      },
      outlinedSizeSmall: {
        fontSize: "16px",
        width: "max-content",
      },
      outlined: {
        border: "1px solid #FF9212",
        borderRadius: "5px",
        color: "#FF9212",
        fontSize: "16px",
        fontWeight: "600",
        marginRight: "20px",
        background: "#FFFFFF 0% 0% no-repeat padding-box",
        "&:hover": {
          color: "#F68808",
          backgroundColor: "#FFFFFF",
          border: "1px solid #FF9212",
        },
      },
      contained: {
        borderRadius: "5px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#FFFFFF",
        boxShadow: "none",
        backgroundColor: "#FF9212",
        "&:hover": {
          color: "#FFFFFF",
          backgroundColor: "#F68808",
          boxShadow: "none",
        },
      },
      textPrimary: {
        color: "rgba(0, 0, 0, 0.87)",
        "&:hover": {
          backgroundColor: "#fafafa",
        },
      },
      textSizeSmall: {
        fontSize: "16px",
      },
      textSecondary: {
        color: "#FF9212",
      },
    },
    MuiGrid: {
      root: {
        maxWidth: "100%",
      },
    },
    MuiIconButton: {
      root: {
        color: "#555555",
      },
    },
    PrivateTabIndicator: {
      colorPrimary: {
        backgroundColor: "#009d43",
      },
    },
    Mui: {
      disabled: {
        color: "inherit",
      },
    },
    MuiSwitch: {
      switchBase: {
        padding: "1px 3px 9px 12px",
        height: "32px",
        width: "28px",
        "&$checked": {
          transform: "translateX(23px)",
          padding: "1px 3px 9px 3px",
        },
        "&$checked + $track": {
          backgroundColor: "#009D43",
          boxShadow: "none",
          opacity: 1,
        },
        "&$disabled + $track": {
          opacity: 1,
        },
        "&$disabled ": {
          color: "#FFFFFF",
        },
      },
      colorPrimary: {
        "&$checked + $track": {
          backgroundColor: "#009D43",
          boxShadow: "none",
          opacity: 1,
        },
        "&$disabled + $track": {
          backgroundColor: "#D3D3D3",
        },
        "&$disabled": {
          color: "#FFFFFF",
          transform: "translateX(6px)",
        },
        "&$checked": {
          color: "#FFFFFF",
          opacity: 1,
        },
      },
      thumb: {
        width: 12,
        height: 12,
        boxShadow: "none",
        marginTop: 12,
      },
      track: {
        width: 32,
        height: 14,
        backgroundColor: "#D3D3D3",
        opacity: 1,
      },
    },
    MuiListItemIcon: {
      root: {
        color: "inherit",
        verticalAlign: "top",
        justifyContent: "center",
      },
    },
    MuiListItem: {
      button: {
        "&:hover": {
          backgroundColor: "none",
        },
      },
    },
    MuiRadio: {
      colorPrimary: {
        "&$checked": {
          color: "#009D43",
        },
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        "&$checked": {
          color: "#009D43",
        },
      },
    },
    MuiButtonGroup: {
      groupedHorizontal: {
        color: "#FFFFFF",
        position: "relative",
        backgroundColor: "#FF9212",
        "&:hover": {
          color: "#FFFFFF",
          backgroundColor: "#FF9212",
        },
      },
    },
    MuiDataGrid: {
      root: {
        "& .MuiDataGrid-row": {
          maxHeight: "none !important",
        },
        "& .MuiDataGrid-renderingZone": {
          overflow: "hidden auto",
        },
        "& .MuiDataGrid-cell": {
          maxHeight: "none !important",
          display: "flex",
          alignItems: "center",
        },
      },
    },
    MuiTab: {
      root: {
        height: "48px",
        background: "#EDEDED 0% 0% no-repeat padding-box",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        color: "#555555",
        fontSize: "15px",
        fontWeight: "550",
        marginLeft: "5px",
        marginTop: "12px",
        "& .PrivateTabIndicator-root-90.PrivateTabIndicator-colorPrimary-91.MuiTabs-indicator": {
          backgroundColor: "#009D43",
        },
      },
    },
    MuiCardContent: {
      root: {
        padding: 0,
      },
    },
    MuiFormHelperText: {
      root: {
        "&$disabled": {
          display: "none",
        },
      },
    },
    MuiTable: {
      root: {
        display: "block",
        overflowX: "auto",
        width: "100%",
        "& .MuiFormHelperText-marginDense": {
          marginTop: "0px",
        },
        "& .MuiFormControl-marginDense": {
          marginBottom: "0px",
        },
        "& .MuiFilledInput-root": {
          backgroundColor: "#fafafa",
        },
        "& thead tr": {
          height: "70px",
          borderTop: "1px solid #f3f3f3",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "1px solid #eeeeee",
          "& th": {
            width: "100vw",
            textAlign: "left",
            letterSpacing: "0px",
            color: "#222222",
            fontSize: "15px",
            position: "static",
            "&:first-child": {
              backgroundColor: "white",
              width: "100vw",
              left: "0px",
              borderBottom: "1px solid #e0e0e0",
              color: "#222222",
              position: "sticky",
              "&::after": {
                content: " '' ",
                position: "absolute",
                top: "100%",
                zIndex: "9",
                height: "1px",
                width: "100%",
                left: "0",
                background: "#e0e0e0",
              }, // Adding same text color for first columns which is for other column headings
            },
          },
        },
        "& tbody tr": {
          height: "49px",
          borderBottom: "1px solid #eeeeee",
          background: "white",
          "&:hover": {
            backgroundColor: "#fff !important",
          },
          "& td": {
            borderBottom: "none",
            color: "#555555",
            fontSize: "14px",
            textAlign: "left",
            "&:first-child": {
              borderBottom: "1px solid #eeeeee",
              position: "sticky",
              backgroundColor: "white",
              width: "100vw",
              left: "0px",
              zIndex: "1",
              lineHeight: "1rem",
              "&::after": {
                content: " '' ",
                position: "absolute",
                top: "100%",
                zIndex: "9",
                height: "1px",
                width: "100%",
                background: "#eee",
              },
            },
            "& span": {
              display: "inline-block",
              maxWidth: "260px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "& .MuiTypography-body2": {
                color: "#555555",
              },
              "&.comment-tooltip": {
                width: "100px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
              "&.MuiSwitch-root": {
                width: "56px",
                display: "inline-flex",
                "& .MuiButtonBase-root": {
                  width: "11px",
                  height: "16px",
                  display: "inline-flex",
                  "& .MuiIconButton-label": {
                    width: "100%",
                    display: "flex",
                  },
                },
              },
            },
            "& .MuiTooltip-popper": {
              width: "391px",
              minHeight: "101px",
              background: "#555555",
              boxShadow: "0px 9px 27px #0000002E",
              borderRadius: "5px",
              opacity: "1",
              "& .MuiTooltip-tooltip": {
                width: "391px",
                minHeight: "101px",
                background: "#555555",
                margin: "0",
                padding: "0",
                maxWidth: "100%",
                "& .MuiTypography-body2": {
                  display: " block",
                  padding: "5px 20px 20px 20px",
                },
              },
            },
          },
        },
      },
    },
    MuiTableHead: {
      root: {
        height: "70px",
        borderTop: "1px solid #f3f3f3",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "1px solid #eeeeee",
      },
    },
    MuiTableSortLabel: {
      root: {
        width: "200px",
      },
    },
    MuiTableCell: {
      alignRight: {
        flexDirection: "initial",
      },
    },

    RaToolbar: {
      toolbar: {
        backgroundColor: "#fafafa",
      },
      desktopToolbar: {
        padding: 0,
      },
    },
    RaBulkActionsToolbar: {
      topToolbar: {
        bottom: "0px",
        padding: "0 !important",
      },
    },
    RaFormInput: {
      input: {
        marginBottom: "20px",
        width: "auto",
        color: "#000000",
        "& .MuiFormControl-fullWidth": {
          width: "40%",
        },
        "& .MuiFormControl-root": {
          width: "100%",
        },
        "& .RaFormInput-input-192": {
          width: "100%",
        },
        "& .MuiIconButton-label": {
          color: "#009d43",
        },
        "& .MuiSelect-filled.MuiSelect-filled": {
          backgroundColor: "#fafafa",
        },
        "& .MuiFormGroup-root": {
          flexDirection: "row",
        },
      },
    },
    RaLayout: {
      contentWithSidebar: {
        display: "flex",
        marginLeft: "20px",
        marginTop: "30px",
      },
      content: {
        paddingTop: "0",
        width: "calc(100% - 32px)",
        "& .MuiDivider-root": {
          marginTop: "20px",
        },
      },
      root: {
        minWidth: 0,
      },
    },
    RaFilterFormInput: {
      body: {
        flexDirection: "row-reverse",
      },
    },
    RaTopToolbar: {
      root: {
        bottom: "84px",
        order: 2,
        marginLeft: "auto",
      },
    },
    RaMenuItemLink: {
      root: {
        fontSize: "15px",
        color: "#555555",
        opacity: "1",
        padding: "12px",
      },
    },
    RaList: {
      content: {
        width: "100%",
        "& .MuiButton-outlined": {
          bottom: "30px",
          border: "none",
        },
      },
    },
    RaCreateButton: {
      floating: {
        bottom: "0",
        position: "relative",
      },
    },
    RaCreate: {
      card: {
        padding: "10px",
      },
    },
    RaPaginationActions: {
      actions: {
        "& .MuiButton-textPrimary": {
          color: "#FF9212",
        },
      },
      currentPageButton: {
        color: "#009D43",
      },
    },
    RaSimpleFormIterator: {
      form: {
        flex: 2,
        display: "flex",
      },
    },
    RaButton: {
      label: {
        paddingLeft: 0,
      },
    },
    MuiDrawer: {
      root: {
        display: "none",
      },
    },
    MuiStepIcon: {
      root: {
        width: "30px",
        height: "26px",
        "&$active": {
          color: "#009D43",
          fill: "#FFFFFF",
          "& $text": {
            fill: "#009D43",
          },
        },
        "&$completed": {
          color: "#009D43",
        },
      },
    },
    MuiStepper: {
      root: {
        "&$horizontal": {
          justifyContent: "center",
        },
      },
    },
    MuiChip: {
      root: {
        "&$outlined": {
          paddingLeft: "30px",
          paddingRight: "30px",
          border: "none",
        },
      },
    },
    MuiStepLabel: {
      iconContainer: {
        marginRight: "-40px",
      },
      active: {
        background: "#009D43",
        "& > div > span": {
          color: "#FFFFFF",
        },
      },
      label: {
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "16px",
        "&$completed": {
          borderColor: "#009D43",
          borderRadius: "16px",
          "& > div > span": {
            color: "#009D43",
          },
        },
      },
    },
    MuiSelect: {
      icon: {
        "&.Mui-disabled": {
          display: "none",
        },
      },
    },
    MuiSnackbar: {
      anchorOriginBottomCenter: {
        top: "70px",
        [`@media(min-width: 600px)`]: {
          bottom: "auto",
        },
      },
    },
    MuiSnackbarContent: {
      root: {
        justifyContent: "center",
      },
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: "#FFFFFF",
        height: "40px",
        border: "1px solid #FF9212",
        borderRadius: "5px",
      },
      barColorPrimary: {
        backgroundColor: "rgba(0, 0, 0, 0.12)",
      },
    },
    MuiAutocomplete: {
      popupIndicator: {
        display: "none",
      },
    },
    RaFilterButton: {
      root: {
        paddingRight: "15px",
      },
    },
  },
});

export default theme;
