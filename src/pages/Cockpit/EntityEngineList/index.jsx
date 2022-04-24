/* eslint-disable react/jsx-props-no-spreading */
import { FormControl, Select, Grid } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import React, { useEffect, useState } from "react";
import { useQueryWithStore, useTranslate } from "react-admin";
import { useHistory } from "react-router-dom";
import ImportButton from "../../../components/import/ImportButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import SimpleGrid from "../../../components/SimpleGrid";

/**
 * Component for Entity List contains a simple grid with Entity Group Names and Entity Names for Cockpit module
 *
 * @param {object} props all the props needed for Entity Group List
 * @returns {React.ReactElement} returns an Entity Group List component
 */
const EntityEngineList = (props) => {
  const [entityGroupName, setEntityGroupName] = useState("");
  const [entityGroups, setEntityGroups] = useState([]);
  const translate = useTranslate();
  const history = useHistory();

  const [breadcrumbsList] = useState([
    {
      displayName: translate("entityEngineGridTitle"),
    },
  ]);

  const configurationForExpandMenu = [
    {
      label: translate("export"),
      value: "export",
    },
  ];

  const configurationForEntityEngineMasterGrid = [
    {
      source: "entityName",
      type: "UrlComponent",
      label: translate("entityName"),
      basePathValue: "cockpit",
      customPathSource: "v1/entitygroups/entities/query/select",
      customQuerySource: { dbType: "dbType", entityId: "id" },
    },
    { source: "entityGroupName", type: "TextField", label: translate("entityGroupName"), sortable: false },
  ];
  const actionButtonsForEntityEngineMasterGrid = [];
  const EntityEngineGridTitle = translate("entityEngineGridTitle");
  const EntityEngineSearchLabel = translate("searchLabel");

  const { data: entityGroupNamesData } = useQueryWithStore({
    type: "getData",
    resource: `${window.REACT_APP_COCKPIT_SERVICE}entitygroupnames`,
  });

  useEffect(() => {
    if (entityGroupNamesData) {
      const entityGroupNames = entityGroupNamesData?.data?.map((item) => ({ entityGroupName: item }));
      setEntityGroups([...entityGroupNames]);
      setEntityGroupName(entityGroupNames[0].entityGroupName);
    }
  }, [entityGroupNamesData]);

  /**
   * Function to call the action for updating selected entity group
   *
   * @name handleChange
   * @param {object} event dom event object
   */
  const handleChange = (event) => {
    const { target } = event;
    setEntityGroupName(target.value);
  };

  /**
   * Function to call the action for redirecting to Import Component.
   *
   * @name onImportHandle
   */
  const onImportHandle = () => {
    history.push({
      pathname: "import",
    });
  };

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbsList} />
      <Grid container direction="row" justify="space-between" alignItems="center">
        <FormControl required>
          <Select value={entityGroupName} onChange={handleChange} defaultValue="">
            {entityGroups.map(({ entityGroupName: egName }) => (
              <MenuItem key={egName} value={egName} defaultValue="">
                {egName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ImportButton
          onClick={onImportHandle}
          configurationForExpandMenu={configurationForExpandMenu}
          resource={window.REACT_APP_COCKPIT_SERVICE}
        />
      </Grid>

      <SimpleGrid
        {...props}
        configurationForGrid={configurationForEntityEngineMasterGrid}
        actionButtonsForGrid={actionButtonsForEntityEngineMasterGrid}
        gridTitle={EntityEngineGridTitle}
        searchLabel={EntityEngineSearchLabel}
        sortField={{ field: "entityGroupName", order: "asc" }}
        filter={{ entityGroupName }}
        syncWithLocation={false}
        resource={`${window.REACT_APP_COCKPIT_SERVICE}entitygroups`}
      />
    </>
  );
};

export default EntityEngineList;
