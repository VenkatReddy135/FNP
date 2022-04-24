# StyledMenu

StyledMenu is a function to apply material-ui style on Menu material-ui component

## Props

StyledMenu needs the following props -

1. open :

- Its a boolean value passed depending upon current value of anchor element
- It is a boolean field e.g.,
  open={Boolean(anchorEl)}

2. anchorEl :

- It is the current value of the element from dropdown
- It is a object type field e.g.,
- <button tabindex="0" type="button" data-at-id="quicklink"><svg class="MuiSvgIcon-root-479 makeStyles-iconStyle-510" focusable="false"></svg></span></button>

3. onClose :

- This prop calls the close handler used for closing the menu element
- it is a function type e.g.,

  const handleClose = () => {
  setAnchorEl(null);
  };

4. id :

- This is the id attribute passed to the Menu component
- its a string type e.g.,
  id="customized-menu"
