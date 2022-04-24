import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ComponentPriceRuleManagerList from "../index";

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

describe("Component Price Rule Manager List", () => {
  let result;
  let labels;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<ComponentPriceRuleManagerList />);
    result = renderer1.getRenderOutput();
    labels = result.props.children[1].props;
  });

  it("should render Component Price Rule Manger list component", () => {
    expect(result).toBeTruthy();
  });
  it("should not include grid title to be Empty", () => {
    const title = labels.gridTitle;
    expect(title).toBe("");
  });
  it("should include grid first column label to be Rule Name", () => {
    const firstColumnLabel = labels.configurationForGrid[0].label;
    expect(firstColumnLabel).toBe("componentPriceRuleManager.rule_name");
  });
  it("should include grid third column label to be FC Group ID", () => {
    const thirdColumnLabel = labels.configurationForGrid[2].label;
    expect(thirdColumnLabel).toBe("componentPriceRuleManager.fc_group_id");
  });
  it("should include grid eighth column label to be Over Ride Type", () => {
    const fifthColumnLabel = labels.configurationForGrid[7].label;
    expect(fifthColumnLabel).toBe("componentPriceRuleManager.override_type");
  });
  it("should have filled grid length to be 0", () => {
    const filledGrid = labels.actionButtonsForGrid;
    expect(filledGrid.length).toBe(0);
  });
  afterEach(() => {
    cleanup();
  });
});
