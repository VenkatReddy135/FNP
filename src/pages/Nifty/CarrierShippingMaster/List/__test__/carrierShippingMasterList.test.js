import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CarrierShippingMasterList from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  Button: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  Link: () => {},
  useHistory: () => ({
    push: jest.fn(),
    location: jest.fn(),
  }),
}));

describe("Carrier Shipping Price Master List", () => {
  let result;
  let labels;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<CarrierShippingMasterList />);
    result = renderer1.getRenderOutput();
    labels = result.props.children[2].props;
  });

  it("should render Carrier Shipping Price Master list component", () => {
    expect(result).toBeTruthy();
  });
  it("should not include grid title to be Empty", () => {
    const title = labels.gridTitle;
    expect(title).toBe("");
  });
  it("should include grid first column label to be Carrier Name", () => {
    const firstColumnLabel = labels.configurationForGrid[0].label;
    expect(firstColumnLabel).toBe("carrierShippingPriceMaster.carrier_name");
  });
  it("should include grid third column label to be Geo", () => {
    const thirdColumnLabel = labels.configurationForGrid[2].label;
    expect(thirdColumnLabel).toBe("geo");
  });
  it("should include grid Fifth column label to be Shipping Method Name", () => {
    const fifthColumnLabel = labels.configurationForGrid[5].label;
    expect(fifthColumnLabel).toBe("carrierShippingPriceMaster.shipping_method_name");
  });
  it("should include grid Seventh column label to be Currency", () => {
    const seventhColumnLabel = labels.configurationForGrid[7].label;
    expect(seventhColumnLabel).toBe("currency");
  });
  it("should have filled grid length to be 0", () => {
    const filledGrid = labels.actionButtonsForGrid;
    expect(filledGrid.length).toBe(0);
  });
  it("should have 0 buttons for empty grid", () => {
    const emptyGrid = labels.actionButtonsForEmptyGrid;
    expect(emptyGrid).toBe(null);
  });
  afterEach(() => {
    cleanup();
  });
});
