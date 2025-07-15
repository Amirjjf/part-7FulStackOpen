/* eslint-env jest */
import { expect } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BlogForm from "../components/BlogForm";

describe("<BlogForm />", () => {
  test("calls onSubmit with correct details when a new blog is created", () => {
    const mockCreateBlog = jest.fn();

    render(<BlogForm createBlog={mockCreateBlog} />);

    // Use placeholder to get form fields
    const titleInput = screen.getByPlaceholderText("Title");
    const authorInput = screen.getByPlaceholderText("Author");
    const urlInput = screen.getByPlaceholderText("URL");
    const submitButton = screen.getByText("Create");

    fireEvent.change(titleInput, { target: { value: "Testing with React" } });
    fireEvent.change(authorInput, { target: { value: "Test Author" } });
    fireEvent.change(urlInput, { target: { value: "http://testurl.com" } });
    fireEvent.click(submitButton);

    // Ensure createBlog was called once
    expect(mockCreateBlog).toHaveBeenCalledTimes(1);

    // Ensure createBlog was called with the correct data
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: "Testing with React",
      author: "Test Author",
      url: "http://testurl.com",
    });
  });
});
