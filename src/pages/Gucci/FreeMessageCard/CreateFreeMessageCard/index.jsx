/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { useSelector } from "react-redux";
import CreateFreeMessageCardUI from "./CreateFreeMessageCardUI";

/**
 * @function CreateFreeMessageCard  to redirect Free Messages Create
 * @returns {React.ReactElement} FreeMessages Create Page
 */
const CreateFreeMessageCard = () => {
  const {
    occasionData: { selectedOccasion },
  } = useSelector((state) => state.messagecard);

  return <CreateFreeMessageCardUI selectedOccasion={selectedOccasion} />;
};

export default CreateFreeMessageCard;
