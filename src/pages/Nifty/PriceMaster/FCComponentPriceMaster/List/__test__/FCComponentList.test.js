import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import FCComponentPriceMasterList from "../index";

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

describe("FC Component Price Master List", () => {
  let result;
  let labels;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<FCComponentPriceMasterList />);
    result = renderer1.getRenderOutput();
    labels = result.props.children[1].props;
  });

  it("should render FC Component Price Master list component", () => {
    expect(result).toBeTruthy();
  });
  it("should not include grid title to be Empty", () => {
    const title = labels.gridTitle;
    expect(title).toBe("");
  });
  it("should include grid first column label to be FC Group Name", () => {
    const firstColumnLabel = labels.configurationForGrid[0].label;
    expect(firstColumnLabel).toBe("fcComponentPriceMaster.fc_group_name");
  });
  it("should include grid third column label to be Fulfillment Geo", () => {
    const thirdColumnLabel = labels.configurationForGrid[2].label;
    expect(thirdColumnLabel).toBe("fcComponentPriceMaster.fulfillment_geo");
  });
  it("should include grid Fifth column label to be Currency", () => {
    const fifthColumnLabel = labels.configurationForGrid[5].label;
    expect(fifthColumnLabel).toBe("currency");
  });
  it("should have filled grid length to be 0", () => {
    const filledGrid = labels.actionButtonsForGrid;
    expect(filledGrid.length).toBe(0);
  });
  afterEach(() => {
    cleanup();
  });
});
