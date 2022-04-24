import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CustomerDeliveryChargesList from "../index";

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
    renderer1.render(<CustomerDeliveryChargesList />);
    result = renderer1.getRenderOutput();
    labels = result.props.children[2].props;
  });

  it("should render Customer Delivery Charges list component", () => {
    expect(result).toBeTruthy();
  });
  it("should not include grid title to be Empty", () => {
    const title = labels.gridTitle;
    expect(title).toBe("");
  });
  it("should include grid first column label to be Configuration Code", () => {
    const firstColumnLabel = labels.configurationForGrid[0].label;
    expect(firstColumnLabel).toBe("customerDeliveryCharges.configuration_code");
  });
  it("should include grid third column label to be Geo", () => {
    const thirdColumnLabel = labels.configurationForGrid[2].label;
    expect(thirdColumnLabel).toBe("geo");
  });
  it("should include grid fifth column label to be Shipping Method Name", () => {
    const fifthColumnLabel = labels.configurationForGrid[4].label;
    expect(fifthColumnLabel).toBe("customerDeliveryCharges.shipping_method_name");
  });
  it("should include grid seventh column label to be Product Type", () => {
    const seventhColumnLabel = labels.configurationForGrid[6].label;
    expect(seventhColumnLabel).toBe("customerDeliveryCharges.product_type");
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
