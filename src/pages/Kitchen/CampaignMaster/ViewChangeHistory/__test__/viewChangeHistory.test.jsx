import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@material-ui/core/styles";
import { TestContext } from "ra-test";
import ViewChangeHistory from "../index";
import theme from "../../../../../assets/theme/theme";

describe("Change history List Unit test cases", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <ViewChangeHistory basePath="/" id="123" resource="history" location="" match="" />
        </TestContext>
      </ThemeProvider>,
      div,
    );
  });

  test("Check for grid title", () => {
    const { getAllByText } = render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <ViewChangeHistory basePath="/" id="123" resource="history" location="" match="" />
        </TestContext>
      </ThemeProvider>,
    );

    expect(getAllByText("view_history_title")[0]).toBeInTheDocument();
  });
});
