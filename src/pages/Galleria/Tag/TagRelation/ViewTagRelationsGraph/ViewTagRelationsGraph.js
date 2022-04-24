/* eslint-disable react/destructuring-assignment */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslate, useRedirect } from "react-admin";
import { Grid, Typography, Button, Card, Box, CardHeader, CardContent, makeStyles, Chip } from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useCustomQueryWithStore } from "../../../../../utils/CustomHooks";
import LoaderComponent from "../../../../../components/LoaderComponent";
import Breadcrumbs from "../../../../../components/Breadcrumbs";

const useStyles = makeStyles({
  cardTitle: {
    backgroundColor: "#EEEFF1",
    marginBottom: "20px",
  },
  fromArrayChip: {
    margin: "5px",
    backgroundColor: "#FFC888",
    overflow: "hidden",
    maxWidth: "500px",
  },
  toArrayChip: {
    margin: "5px",
    backgroundColor: "#FFE9D0",
    overflow: "hidden",
    maxWidth: "500px",
  },
  multiLineEllipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px",
  },
  textAlignCenter: { textAlign: "center" },
});

/**
 * Component to render the Graph View of Tag Relation
 *
 * @param {*} props all the props required by the Tag Relation  - Graph View
 * @returns {React.ReactElement} returns the Graph View Page of Tag Relation
 */
const ViewTagRelationsGraph = (props) => {
  const { match } = props;
  const { id: tagId } = match.params;
  const classes = useStyles();
  const { toArrayChip, fromArrayChip, cardTitle, textAlignCenter } = classes;
  const translate = useTranslate();
  const redirect = useRedirect();
  const [tagArray, updateArray] = useState([]);
  const [responseLength, setResponseLength] = useState(0);

  const redirectURL = `${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/show/relations`;
  const breadcrumbs = [
    {
      displayName: translate("tag_management"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags`,
    },
    { displayName: tagId, navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/show` },
    {
      displayName: translate("tag_relations_and_associations"),
      navigateTo: `/${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/show/relations`,
    },
    { displayName: translate("view_tag_relation") },
  ];
  /**
   *@function getGraphArray function to add data to fromArray and toArray
   *@param {*} element param contains the details of element
   *@param {object} item object is used to push the latest data to respective array
   */
  const getGraphArray = (element, item) => {
    const fromTagId = element.edges[0].fromTag.id;
    const tagData = element.vertices[1];
    if (fromTagId === tagId) {
      item.toArray.push(tagData);
    } else {
      item.fromArray.push(tagData);
    }
  };

  /**
   *@function createRelationsGraph function to generate the Graph Array
   *@param {Array} relationsArray Array response from backend
   *@returns {Array} tempArray with graph mappings
   */
  const createRelationsGraph = (relationsArray) => {
    const tempArray = JSON.parse(JSON.stringify(tagArray));
    relationsArray.forEach((element) => {
      const iIndex = tempArray.findIndex((item) => item.relationType.name === element.edges[0].tagRelationType.name);
      if (iIndex === -1) {
        const relationObj = {
          fromArray: [],
          toArray: [],
          selectedTag: element.vertices[0].tagName,
          relationType: element.edges[0].tagRelationType,
        };
        getGraphArray(element, relationObj);
        tempArray.push(relationObj);
      } else {
        getGraphArray(element, tempArray[iIndex]);
      }
    });
    return tempArray;
  };

  /**
   * @function handleSetDataSuccess This function will setData
   * @param {object} res is passed to the function
   */
  const handleSetDataSuccess = (res) => {
    setResponseLength(res.data.total);
    const graphArray = createRelationsGraph(res?.data?.data);
    updateArray(graphArray);
  };

  const resource = `${window.REACT_APP_GALLERIA_SERVICE}/tags/${tagId}/graph`;
  const payloadData = {
    pagination: {
      page: 1,
      perPage: 100,
    },
    sort: {
      order: "ASC",
      field: "sequence",
    },
    id: tagId,
  };
  const { loading } = useCustomQueryWithStore("getData", resource, handleSetDataSuccess, {
    payload: payloadData,
  });

  /**
   *@function createRelationsGraph function to display tag chip
   *@param {Array} item param to get teh data from respective array
   *@param {*} background param used for className
   *@returns {React.ReactElement} containing tags data as chip
   */
  const createTagChip = (item, background) => {
    return (
      <Grid container>
        {item.map(({ id, tagName }) => {
          return <Chip title={tagName} key={id} label={tagName} className={background} />;
        })}
      </Grid>
    );
  };

  /**
   * @function cancelTagHandler function called on click of cancel button of Create Relation Page
   * @param {*} event event called on click of cancel
   */
  const cancelTagHandler = (event) => {
    event.preventDefault();
    redirect(`/${redirectURL}`);
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      {loading ? (
        <LoaderComponent />
      ) : (
        <>
          <Grid container justify="space-between" alignItems="center">
            <Typography variant="h4">{translate("view_tag_relation")}</Typography>
            <Button variant="outlined" data-at-id="close" onClick={cancelTagHandler}>
              {translate("close")}
            </Button>
          </Grid>
          {responseLength >= 1 ? (
            <>
              {tagArray.map((element) => {
                const { relationType, fromArray, toArray, selectedTag } = element;
                return (
                  <Box key={relationType.id} mr={2} mt={4} mb={2}>
                    <Card variant="outlined">
                      <CardHeader
                        className={cardTitle}
                        title={relationType.name}
                        titleTypographyProps={{ variant: "body2", align: "center" }}
                      />
                      <CardContent>
                        <Grid container justify="space-between">
                          <Grid item xs={5}>
                            {createTagChip(fromArray, fromArrayChip)}
                          </Grid>
                          <Grid item xs={2}>
                            <Box display="flex" justifyContent="center" alignItems="center" height="40px">
                              <ChevronRightIcon />
                              <Typography className={classes.multiLineEllipsis} title={selectedTag} variant="subtitle2">
                                {selectedTag}
                              </Typography>
                              <ChevronRightIcon />
                            </Box>
                          </Grid>
                          <Grid item xs={5}>
                            {createTagChip(toArray, toArrayChip)}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                );
              })}
            </>
          ) : (
            <div className={textAlignCenter}>
              <Typography variant="h5">{translate("no_results_found")}</Typography>
            </div>
          )}
        </>
      )}
    </>
  );
};

ViewTagRelationsGraph.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};
ViewTagRelationsGraph.defaultProps = {
  match: {},
};

export default ViewTagRelationsGraph;
