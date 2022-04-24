import React from "react";
import { render } from "@testing-library/react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { TestContext } from "ra-test";
import PublisherList from "../index";
import theme from "../../../../../assets/theme/theme";

describe("Publisher List Unit test cases", () => {
  test("Renders publisher list", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <PublisherList basePath="/" id="123" resource="publishers" location="" match="" />
        </TestContext>
      </ThemeProvider>,
      div,
    );
  });

  test("Check for grid title", () => {
    const { getAllByText } = render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <PublisherList basePath="/" id="123" resource="publishers" location="" match="" />
        </TestContext>
      </ThemeProvider>,
    );

    expect(getAllByText("publisher_manager")[0]).toBeInTheDocument();
  });
});
