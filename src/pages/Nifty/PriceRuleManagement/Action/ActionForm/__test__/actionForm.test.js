import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ActionForm from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  useMutation: () => [() => {}],
  FormWithRedirect: jest.fn(),
  SelectInput: jest.fn(),
  NumberInput: jest.fn(),
}));

describe("Action Form", () => {
  let result;

  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<ActionForm mode="create" />);
    result = renderer1.getRenderOutput();
  });

  it("should render action form UI component", () => {
    expect(result).toBeTruthy();
  });

  test("Variables should be defined", () => {
    const variables = result.props.children.props;
    expect(variables).toBeDefined();
  });

  afterEach(() => {
    cleanup();
  });
});
