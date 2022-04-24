import React from "react";
import PropTypes from "prop-types";
import Editor from "react-simple-code-editor";
import { useTranslate } from "react-admin";
import { Grid } from "@material-ui/core";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { useStyles, AntTabs, AntTab } from "./EditorViewStyle";

/**
 * @param {*} root0 root props
 * @param {string} root0.title title props
 * @param {object} root0.data data props
 * @param {number} root0.selectedTab selectedTab props
 * @param {boolean} root0.disabled disabled props
 * @param {Function} root0.onChangeTab onChangeTap props
 * @param {Function} root0.onValueChange onValueChange props
 * @returns {*} return component
 */
const EditorView = ({ title, data, selectedTab, onChangeTab, onValueChange, disabled }) => {
  const classes = useStyles();
  const translate = useTranslate();
  return (
    <Grid>
      <Grid className={classes.titleText}>{title}</Grid>
      <AntTabs value={selectedTab} onChange={onChangeTab} aria-label="ant example">
        <AntTab label={translate("microdata")} />
        <AntTab label={translate("jsonLd")} />
      </AntTabs>
      <Grid className={classes.editorWrap}>
        <Grid className={classes.editorView}>
          <Editor
            disabled={disabled}
            onValueChange={onValueChange}
            padding={10}
            value={data}
            highlight={(code) => highlight(code, languages.js)}
            className={classes.editor}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

EditorView.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  selectedTab: PropTypes.number.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default EditorView;
