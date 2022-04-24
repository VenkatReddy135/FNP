import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import BasePriceEdit from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
}));

jest.mock("react-router-dom", () => ({
  useParams: () => {
    return {
      match: {
        id: "U_00016",
      },
    };
  },
  useHistory: jest.fn(),
}));

describe("Base Price Edit", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<BasePriceEdit />);
    result = renderer1.getRenderOutput();
  });

  it("should render Base Price Edit UI component", () => {
    expect(result).toBeTruthy();
  });

  afterEach(() => {
    cleanup();
  });
});
