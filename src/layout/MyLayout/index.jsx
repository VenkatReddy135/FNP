/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Layout } from "react-admin";
import MyAppBar from "../appbar";
import Footer from "../Footer";
import MyNotification from "./Notification";
import ErrorBoundary from "./ErrorBoundary";

/**
 * Custom Layout Component
 *
 * @param {*} props all props
 * @returns {React.createElement} MyLayout.jsx
 * {@link https://marmelab.com/react-admin/Theming.html#using-a-custom-layout }
 */
const MyLayout = (props) => {
  return (
    <>
      <Layout {...props} appBar={MyAppBar} notification={MyNotification} error={ErrorBoundary} />
      <Footer />
    </>
  );
};

export default MyLayout;
