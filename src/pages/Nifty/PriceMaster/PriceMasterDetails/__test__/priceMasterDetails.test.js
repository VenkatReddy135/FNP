/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import PriceMasterDetails from "../index";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
}));

describe("Price Master Details tab page", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<PriceMasterDetails />);
    result = renderer1.getRenderOutput();
  });

  test("price master component should exist", () => {
    expect(result).toBeTruthy();
  });

  test("price master breadcrumbs should exist", () => {
    expect(result.props.children[0].props.breadcrumbs).toBeTruthy();
  });

  test("price master title should exist", () => {
    expect(result.props.children[1].props).toBeTruthy();
  });

  test("price master FC-Component Price Master tab should exist", () => {
    expect(result.props.children[2].props.tabArray[0].key).toEqual("FCComponentPriceMaster");
  });

  afterEach(() => {
    cleanup();
  });
});
