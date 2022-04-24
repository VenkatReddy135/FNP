import React from "react";
import { render } from "@testing-library/react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { TestContext } from "ra-test";
import CampaignPreview from "../index";
import theme from "../../../../../assets/theme/theme";

describe("Campaign Preview Unit test cases", () => {
  test("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <CampaignPreview basePath="/preview" id="123" resource="preview" location="" match="" />
        </TestContext>
      </ThemeProvider>,
      div,
    );
  });

  test("Screen Loader should present ", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <CampaignPreview basePath="/preview" id="123" resource="preview" location="" match="" />
        </TestContext>
      </ThemeProvider>,
    );
    expect(container.querySelector("circle")).toBeInTheDocument();
  });
});
