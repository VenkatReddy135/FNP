import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import renderer from "react-test-renderer";
import TagRelationCreate from "../index";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useCreate: () => [() => {}],
  useQueryWithStore: () => {},
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useHistory: jest.fn(),
  required: () => true,
  SimpleForm: () => <></>,
}));

describe("Tag Relation Create test cases", () => {
  let result;
  const match = {
    params: {
      id: "anniversary",
    },
  };

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<TagRelationCreate match={match} />);
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Tag Relation Create component", () => {
    expect(result).toBeTruthy();
  });

  it("should have new tag relation label", () => {
    const label = result.props.children[0].props.children[0].props.children[0].props.children;
    expect(label).toBe("new_tag_relation");
  });

  it("should have create button", () => {
    const label = result.props.children[0].props.toolbar.props.saveButtonLabel;
    expect(label).toBe("create");
  });

  it("should match snapshot", () => {
    const tree = renderer.create(<TagRelationCreate match={match} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
