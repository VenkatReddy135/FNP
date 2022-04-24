/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import EditFreeMessageCardUI from "./EditFreeMessageCardUI";

/**
 * @param {object} props all  required props are passed here
 * @function EditFreeMessageCard  to redirect FreeMessages Edit
 * @returns {React.ReactElement} FreeMessages Edit Page
 */
const EditFreeMessageCard = (props) => {
  const { match } = props;
  const {
    occasionData: { selectedOccasion },
  } = useSelector((state) => state.messagecard);

  return <EditFreeMessageCardUI selectedOccasion={selectedOccasion} match={match} />;
};
EditFreeMessageCard.propTypes = {
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default EditFreeMessageCard;
