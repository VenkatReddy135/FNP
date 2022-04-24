import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ShippingConfiguration from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  FormWithRedirect: jest.fn(),
  FormDataConsumer: jest.fn(),
  TextInput: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useHistory: () => {
    return {
      location: {
        search: "?type=multiTier",
      },
    };
  },
  useParams: () => {
    return {
      id: 123,
    };
  },
}));

describe("Shipping Rate Type Configuration details", () => {
  let result;
  let page;
  let configForm;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<ShippingConfiguration />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = { form: {} };
    page = result.props;
    configForm = page.children[3].props.render({ handleSubmitWithRedirect, ...rest });
  });

  it("Should render configuration page breadcrumb", () => {
    expect(page.children[0].props.breadcrumbs).toBeTruthy();
  });

  it("Should render configuration page title", () => {
    expect(page.children[1].props.children[0].props.children.props.children).toEqual(
      "carrierShippingPriceMaster.multi_tier_configuration",
    );
  });

  it("Should render configuration page import action button", () => {
    expect(page.children[1].props.children[1].props.children.props.children).toEqual("import");
  });

  it("Should render configuration page form", () => {
    expect(configForm).toBeTruthy();
  });

  afterEach(() => {
    cleanup();
  });
});
