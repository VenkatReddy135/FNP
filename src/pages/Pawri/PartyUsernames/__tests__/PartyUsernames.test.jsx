import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@material-ui/core/styles";
import { TestContext } from "ra-test";
import PartyUsernames from "../index";
import theme from "../../../../assets/theme/theme";
const defaultEditProps = {
  basePath: "/",
  id: "123",
  resource: "foo",
  location: {},
  match: {},
};

describe("PartyUsernames List Unit test cases", () => {
  it("component renders without crashing", () => {
    render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <PartyUsernames {...defaultEditProps} />
        </TestContext>
      </ThemeProvider>,
    );
  });

  it("New Username Button ", () => {
    const { getByLabelText } = render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <PartyUsernames {...defaultEditProps} />
        </TestContext>
      </ThemeProvider>,
    );

    expect(getByLabelText("new_username")).toBeInTheDocument();
  });

  it("New Username Button to be clicked ", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <TestContext>
          <PartyUsernames {...defaultEditProps} />
        </TestContext>
      </ThemeProvider>,
    );

    fireEvent.click(container.querySelector("button"));
  });
});
