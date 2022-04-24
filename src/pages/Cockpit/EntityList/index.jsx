/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-props-no-spreading */
import { TextField, Button, Grid, DialogContent, DialogContentText, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryWithStore, useTranslate, useRedirect, useMutation, useNotify, useRefresh } from "react-admin";
import { useLocation, Link } from "react-router-dom";
import RemoveRedEyeOutlinedIcon from "@material-ui/icons/RemoveRedEyeOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import LoaderComponent from "../../../components/LoaderComponent";
import SimpleGrid from "../../../components/SimpleGrid";
import Breadcrumbs from "../../../components/Breadcrumbs";
import useStyles from "../../../assets/theme/common";
import EmptyComponent from "../../../components/EmptyComponent";
import configData from "../../../config/CockpitConfig";
import { TIMEOUT } from "../../../config/GlobalConfig";
import getDbTypeKey from "../CockpitHelper/helper";
import SimpleModel from "../../../components/CreateModal";
import AdvanceSearchLink from "../../../components/AdvanceSearchLink";
import modifyArray from "../../../utils/helperFunctions";

/**
 * Component for Cockpit Management List contains a simple grid with configurations for Cockpit
 *
 * @param {object} props all the props needed for Cockpit Management List
 * @param {string}props.resource This is resource name
 * @returns {React.ReactElement} returns a Cockpit Management List component
 */
const EntityList = (props) => {
  const { resource } = props;

  const [configurationForEntityMasterGrid, setConfigurationForEntityMasterGrid] = useState([]);
  const [entityColumnMetaData, setEntityColumnMetaData] = useState([]);
  const [openModal, toggleModal] = useState(false);
  const [entityRowId, setRowId] = useState("");

  const classes = useStyles();
  const translate = useTranslate();
  const redirect = useRedirect();
  const notify = useNotify();
  const refresh = useRefresh();

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const filterObj = {};
  const [entityGroupName, entityName] = (query.get("entityId") || "").split("|");
  const filterQuery = query.get("filter");

  const dbType = query.get("dbType");
  const actionButtonsForEntityMasterGrid = [];
  const cockpitSearchLabel = translate("searchLabel");
  const createValue = translate("createValue");
  const entityNameLabel = translate("entityName");
  const entityGroupNameLabel = translate("entityGroupName");

  useEffect(() => {
    if (!(entityGroupName && entityName)) {
      redirect(`/${configData.entityGroupsRoute}`);
    }
  }, [entityGroupName, entityName, redirect]);

  if (filterQuery) {
    filterObj.filter = JSON.parse(filterQuery).filter;
  }
  filterObj.entityGroupName = entityGroupName;
  filterObj.entityName = entityName;

  const [mutate] = useMutation();

  const deleteEntityHandler = useCallback(
    (rowId) =>
      mutate(
        {
          type: "create",
          resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/query`,
          payload: {
            data: {
              dataObj: {
                queryPart: {
                  condition: { [getDbTypeKey(dbType)]: rowId },
                  operation: configData.crudOperationType.delete,
                  parameters: [],
                },
              },
              params: {
                entityGroupName,
                entityName,
              },
            },
          },
        },
        {
          onSuccess: (response) => {
            if (response.data && response.status === "success") {
              notify(response?.data?.message || translate("delete_entity_success_message"), "success", TIMEOUT);
              toggleModal(false);
              refresh();
            } else if (
              response.data &&
              response.data.errors &&
              response.data.errors[0].errorCode &&
              response.data.errors[0].message
            ) {
              toggleModal(false);
              refresh();
              notify(
                response.data.errors[0].field
                  ? `${response.data.errors[0].field} ${response.data.errors[0].message}`
                  : `${response.data.errors[0].message}`,
              );
            }
          },
          onFailure: () => {
            notify(translate("somethingWrong"), "error", TIMEOUT);
          },
        },
      ),
    [entityGroupName, entityName, mutate, notify, redirect, resource, search, translate],
  );

  /**
   * @function dialogContent renders a Confirmation Dialog that opens on click of Create button
   * @param {string } message message to be displayed in the confirmation modal
   * @returns {React.createElement} returns Confirmation Dialog
   */
  const dialogContent = (message) => {
    return (
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
    );
  };

  /**
   * @function deleteHandler function called when handle Action of simple model is triggered.
   * @param {string} id gives the id on which action has to be performed.
   */
  const deleteHandler = (id) => {
    deleteEntityHandler(id);
  };

  /**
   * @function toggleHandler function called on click of delete icon of Kebab Menu
   * @param {string} rowId gives the id on which action has to be performed.
   */
  const toggleHandler = (rowId) => {
    setRowId(rowId);
    toggleModal(true);
  };

  const configurationForKebabMenu = [
    {
      type: "View",
      leftIcon: <RemoveRedEyeOutlinedIcon />,
      path: "",
      routeType: "/show",
      isEditable: false,
    },
    {
      type: "Edit",
      leftIcon: <EditOutlinedIcon />,
      path: "",
      routeType: "/edit",
      isEditable: true,
    },
    {
      type: "Delete",
      leftIcon: <DeleteOutlineOutlinedIcon />,
      path: "",
      routeType: "/delete",
      isEditable: false,
      onClick: toggleHandler,
    },
  ];

  const { loading } = useQueryWithStore(
    {
      type: "getData",
      payload: { entityName, entityGroupName },
      resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroups/entities/meta-data`,
    },
    {
      onSuccess: (res) => {
        if (res.data) {
          const metaData = res.data?.data?.map(({ fieldName }) => {
            return fieldName.toLowerCase() === getDbTypeKey(dbType)
              ? {
                  source: fieldName,
                  type: "KebabMenuWithLink",
                  configurationForKebabMenu,
                  label: fieldName,
                  tabPath: "/",
                  queryValue: search.slice(1),
                  isLink: true,
                }
              : {
                  source: fieldName,
                  type: "TextWithJson",
                  label: fieldName,
                };
          });
          setEntityColumnMetaData(res?.data);
          const sortedMetaData = modifyArray(metaData, getDbTypeKey(dbType), 0);
          setConfigurationForEntityMasterGrid([...sortedMetaData]);
        }
      },
      onFailure: () => {
        notify("something Wrong", "error", TIMEOUT);
      },
    },
  );

  /**
   * @function toggleClose function passed to property handleClose of SimpleModal.
   *
   */
  const toggleClose = () => {
    toggleModal(false);
  };

  const [breadcrumbsList] = useState([
    {
      displayName: translate("entityEngineGridTitle"),
      navigateTo: `/${window.REACT_APP_COCKPIT_SERVICE}entitygroups`,
    },
    {
      displayName: entityName,
    },
  ]);

  if (loading) {
    return <LoaderComponent />;
  }

  const AdvanceSearch = (
    <AdvanceSearchLink
      advanceSearchPagePath={`/${
        window.REACT_APP_COCKPIT_SERVICE
      }entitygroups/entities/advancesearch?entityId=${entityGroupName}|${entityName}&metadata=${JSON.stringify(
        entityColumnMetaData,
      )}&dbType=${dbType}`}
      advanceSearchLabel={translate("advance_search")}
    />
  );

  return (
    <>
      <Box marginBottom="10px">
        <Breadcrumbs breadcrumbs={breadcrumbsList} />
      </Box>
      <Grid container direction="row" justify="space-between" className={classes.gridStyle}>
        <Grid item>
          <TextField label={entityNameLabel} value={entityName} disabled />
          <TextField label={entityGroupNameLabel} className={classes.label} value={entityGroupName} disabled />
        </Grid>
        <Button
          variant="outlined"
          component={Link}
          to={{
            pathname: `/${resource}/create`,
            search: `${search}`,
          }}
        >
          {createValue}
        </Button>
      </Grid>
      {configurationForEntityMasterGrid.length > 0 && (
        <>
          <SimpleGrid
            {...props}
            configurationForGrid={configurationForEntityMasterGrid}
            actionButtonsForGrid={actionButtonsForEntityMasterGrid}
            gridTitle={entityName}
            searchLabel={cockpitSearchLabel}
            filter={{ ...filterObj }}
            empty={<EmptyComponent queryValue={search.slice(1)} />}
            syncWithLocation={false}
            additionalLink={AdvanceSearch}
            isSearchEnabled={false}
          />
          <SimpleModel
            dialogContent={dialogContent(translate("confirmation_delete_new_entity"))}
            showButtons
            closeText={translate("cancel")}
            actionText={translate("continue")}
            openModal={openModal}
            handleClose={toggleClose}
            handleAction={() => {
              deleteHandler(entityRowId);
            }}
          />
        </>
      )}
    </>
  );
};

EntityList.propTypes = {
  resource: PropTypes.string.isRequired,
};

export default EntityList;
