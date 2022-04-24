/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { SearchInput, Filter, SelectInput, TextInput } from "react-admin";

const componentsMap = {
  SearchInput,
  SelectInput,
  TextInput,
};

/**
 * Component for Custom Filters that will be displayed on Simple Grid based on config object passed through List
 *
 * @param {object} props all the props needed for Custom Filters component
 * @returns {React.ReactElement} returns a React component for Custom Filters for Simple Grid
 */
const CustomFilters = (props) => {
  const { filtersForGrid } = props;

  return (
    <Filter {...props}>
      {filtersForGrid?.map((field, index) => {
        const buttonIndex = `${field.type}_${index}`;
        const componentType = field.type;
        const Component = componentsMap[componentType];
        return <Component key={buttonIndex} {...field} />;
      })}
    </Filter>
  );
};

CustomFilters.propTypes = {
  filtersForGrid: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CustomFilters;
