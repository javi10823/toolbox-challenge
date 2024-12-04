import React from "react";
import { screen } from "@testing-library/react";
import { FilesTable } from "../components";
import { renderWithProviders } from "../utils/testUtils";

test("Loading state", async () => {
  renderWithProviders(<FilesTable />, {
    preloadedState: {
      file: { files: [], isLoadingFiles: true },
    },
  });
  expect(await screen.findByText("Loading...")).toBeInTheDocument();
  expect(screen.queryByText("File Name")).not.toBeInTheDocument();
});

test("Empty state", async () => {
  renderWithProviders(<FilesTable />, {
    preloadedState: {
      file: { files: [], isLoadingFiles: false },
    },
  });

  expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  expect(screen.getByText(/File Name/i)).toBeInTheDocument();
  expect(screen.queryAllByRole("row").length).toBe(1); // Only the header row should be present
});

test("Data state", async () => {
  const files = [
    {
      file: "file1.txt",
      lines: [{ text: "line1", number: 1, hex: "0x01" }],
    },
    {
      file: "file2.txt",
      lines: [
        { text: "line2", number: 2, hex: "0x02" },
        { text: "line2", number: 2, hex: "0x02" },
      ],
    },
    { file: "file3.txt", lines: [] },
  ];

  renderWithProviders(<FilesTable />, {
    preloadedState: {
      file: { files, isLoadingFiles: false },
    },
  });

  expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  expect(screen.getByText(/File Name/i)).toBeInTheDocument();
  expect(screen.getByText("file1.txt")).toBeInTheDocument();
  expect(screen.getAllByText("file2.txt").length).toBe(2);
  expect(screen.queryByText("file3.txt")).not.toBeInTheDocument();
  expect(screen.queryAllByRole("row").length).toBe(4); // Header row + data rows
});
