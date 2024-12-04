import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../utils/testUtils";
import { SearchInput } from "../components";

test("renders SearchInput with placeholder", () => {
  renderWithProviders(<SearchInput />);
  expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
});

test("displays suggestions based on input", () => {
  const suggestions = ["file_option1", "file_option2", "option3"];
  renderWithProviders(<SearchInput suggestions={suggestions} />);

  const input = screen.getByPlaceholderText("Search...");
  fireEvent.change(input, { target: { value: "fi" } });

  expect(screen.getByText("file_option1")).toBeInTheDocument();
  expect(screen.getByText("file_option2")).toBeInTheDocument();
  expect(screen.queryByText("option3")).not.toBeInTheDocument();
});

test("handles suggestion click", () => {
  const suggestions = ["file_option1", "file_option2", "option3"];

  const onSearch = jest.fn();
  renderWithProviders(
    <SearchInput suggestions={suggestions} onSearch={onSearch} />
  );

  const input = screen.getByPlaceholderText("Search...");
  fireEvent.change(input, { target: { value: "fi" } });
  fireEvent.click(screen.getByText("file_option1"));

  expect(input.value).toBe("file_option1");
  expect(onSearch).toHaveBeenCalledWith("file_option1");
});

test("handles form submit", () => {
  const onSearch = jest.fn();
  renderWithProviders(<SearchInput onSearch={onSearch} />);

  const input = screen.getByPlaceholderText("Search...");
  fireEvent.change(input, { target: { value: "file1" } });
  fireEvent.submit(screen.getByRole("textbox"));

  expect(onSearch).toHaveBeenCalledWith("file1");
});
