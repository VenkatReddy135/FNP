import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import TagCreate from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
}));

describe("Tag Create", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<TagCreate />);
    result = renderer1.getRenderOutput();
  });

  test("test for children count", () => {
    expect(result.props.children).toHaveLength(4);
  });

  test("test for new tag page header", () => {
    expect(result.props.children[0].props.children.props.children[0].props.children).toEqual("create_new_tag");
  });

  it("should have text input", () => {
    const label = result.props.children[2].props.children.props.children.props["data-testid"];
    expect(label).toBe("text-inputs");
  });

  afterEach(() => {
    cleanup();
  });
});
