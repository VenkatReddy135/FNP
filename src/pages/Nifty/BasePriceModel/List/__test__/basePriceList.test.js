import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import List from "../index";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useHistory: () => {},
}));

///These Test Cases are using  inbuild Testing Library
describe("Base Price List test cases", () => {
  let result;
  let labels;
  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<List />);
    result = shallowRenderer.getRenderOutput();
    labels = result.props.children[1].props;
  });

  it("should render base Price list component", () => {
    expect(result).toBeTruthy();
  });

  it("should include grid title to be Base Price Model", () => {
    const title = labels.gridTitle;
    expect(title).toBe("basePriceModel.base_price_model");
  });

  it("should include searchPlaceHolder to be Search", () => {
    const search = labels.searchLabel;
    expect(search).toBe("basePriceModel.base_price_search");
  });

  it("should have filled grid length to be 1", () => {
    const filledGrid = labels.actionButtonsForGrid;
    expect(filledGrid.length).toBe(1);
  });

  it("should have empty grid length to be 1", () => {
    const emptyGridButton = labels.actionButtonsForEmptyGrid;
    expect(emptyGridButton.length).toBe(1);
  });

  afterEach(() => {
    cleanup();
  });
});
