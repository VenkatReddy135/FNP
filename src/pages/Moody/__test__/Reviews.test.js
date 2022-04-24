/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Reviews from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useMutation: () => [() => {}],
  useTranslate: () => (label) => label,
}));

describe("Moody Unit test cases", () => {
  const initialState = {
    TagDropdownData: {
      domainData: {
        domain: "",
      },
    },
  };

  const mockStore = configureStore();
  const store = mockStore(initialState);

  /**
   * @name MockedReviewsComponent to render Reviews component
   * @returns {React.Component} return component
   */
  const MockedReviewsComponent = () => {
    return (
      <Provider store={store}>
        <Reviews />
      </Provider>
    );
  };

  beforeEach(() => {
    render(<MockedReviewsComponent />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Reviews component", () => {
    expect(screen.getByTestId("reviewsComponent")).toBeTruthy();
  });

  it("reviews header should exist", () => {
    expect(screen.getByText("reviews")).toBeInTheDocument();
  });

  it("reviews header from Typography", () => {
    expect(screen.getByText("reviews")).toContainHTML("h5");
  });

  it("domain dropdown should exist", () => {
    expect(screen.getByText("Domain")).toBeInTheDocument();
  });

  it("Search bar should not exist", () => {
    expect(screen.queryByText("sub_order_id")).not.toBeInTheDocument();
  });
});
