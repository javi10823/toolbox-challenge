import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../utils/testUtils";
import App from "../App";

test("Render All Components", async () => {
  renderWithProviders(<App />, {
    preloadedState: {
      file: { files: [], isLoadingFiles: false },
    },
  });

  expect(screen.getByText("React Test App")).toBeInTheDocument();
  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  expect(screen.getByText("File Name")).toBeInTheDocument();
});
