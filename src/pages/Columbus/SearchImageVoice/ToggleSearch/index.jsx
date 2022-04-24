import React, { useState, useEffect } from "react";
import { useTranslate, useQueryWithStore, useMutation, useNotify } from "react-admin";
import PropTypes from "prop-types";
import { Grid, Typography, Switch } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { has } from "lodash";
import LoaderComponent from "../../../../components/LoaderComponent";
import { color, TIMEOUT } from "../../../../config/GlobalConfig";

/**
 * Image Voice Search component to enable disable the search value
 *
 *  @param {object} props contains data related to ImageVoiceSearch from
 * @returns {React.ReactElement} Its returns the true false value image and voice search.
 */
const ImageVoiceSearch = (props) => {
  const { domainId, attributeName } = props;
  const translate = useTranslate();
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const { black } = color;
  const [mutate] = useMutation();
  const notify = useNotify();

  /**
   * makeStyles hook of material-ui to apply style for Grid Filters component
   *
   * @function
   * @name useStyles
   */
  const useStyles = makeStyles({
    mainContainer: {
      minHeight: "75vh",
    },
    h6: {
      fontWeight: 400,
      fontSize: 18,
      color: black,
    },
    thumb: {
      marginTop: 12,
    },
    subtitle2: {
      fontSize: 14,
      color: black,
    },
  });
  const classes = useStyles();

  useQueryWithStore(
    {
      type: "getOne",
      resource: `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/configattributes`,
      payload: { domainId, attributeName },
    },
    {
      enabled: domainId.toLowerCase() !== "",
      onSuccess: (res) => {
        if (res.status === "success" && res.data) {
          setLoading(false);
          if (has(res.data, "value")) {
            setToggle(res.data.value === "true");
          }
        } else {
          setLoading(false);
          notify(res.message ? res.message : translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
        }
      },
      onFailure: () => {
        setLoading(false);
        notify(translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
      },
    },
  );

  useEffect(() => {
    setLoading(true);
  }, [domainId]);

  /**
   * To update image/voice search for selected domain
   *
   * @name updateFieldsByDomainAPI
   * @param {string} enableValue to update the enable disable value of image and voice search
   */
  const updateFieldsByDomainAPI = (enableValue) => {
    setLoading(true);
    mutate(
      {
        type: "put",
        resource: `${window.REACT_APP_COLUMBUS_SERVICE}/configurations/configattributes`,
        payload: {
          id: {
            attributeName,
            domainId,
          },
          data: {
            value: enableValue,
          },
        },
      },
      {
        onSuccess: (res) => {
          if (res.status === "success") {
            setLoading(false);
            setToggle(enableValue);
            notify(translate("indexable_attribute.update_success_message"), "info", TIMEOUT);
          } else {
            setLoading(false);
            notify(res.message ? res.message : translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
          }
        },
        onFailure: () => {
          setLoading(false);
          notify(translate("indexable_attribute.update_fail_message"), "error", TIMEOUT);
        },
      },
    );
  };

  /**
   * To update image/voice search toggle value
   *
   * @name handleChange
   * @param {string} event to save changed value
   */
  const handleChange = (event) => {
    updateFieldsByDomainAPI(event.target.checked);
    setToggle(event.target.value);
  };

  /**
   * Function to handle toggle message on the basis of attribute name
   *
   * @name toggleMessage
   * @returns {string} toggle enable disable message
   */
  const toggleMessage = () => {
    if (attributeName === "imagesearch") {
      return toggle === true
        ? translate("image_voice_search.image_off_msg")
        : translate("image_voice_search.image_on_msg");
    }

    if (attributeName === "voicesearch") {
      return toggle === true
        ? translate("image_voice_search.voice_off_msg")
        : translate("image_voice_search.voice_on_msg");
    }
    return null;
  };

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <Grid
          className={classes.mainContainer}
          container
          spacing={1}
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h6" classes={{ h6: classes.h6 }}>
              {attributeName === "imagesearch"
                ? translate("image_voice_search.image_title")
                : translate("image_voice_search.voice_title")}
            </Typography>
          </Grid>
          <Grid item>
            <Switch
              checked={toggle}
              color="default"
              onChange={handleChange}
              name="toggleImage"
              classes={{
                thumb: classes.thumb,
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6" className={classes.subtitle2}>
              {toggleMessage()}
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  );
};

ImageVoiceSearch.propTypes = {
  domainId: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
};

export default ImageVoiceSearch;
