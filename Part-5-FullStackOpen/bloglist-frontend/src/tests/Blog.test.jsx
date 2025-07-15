/* eslint-env jest */
import { expect } from "vitest";
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "../components/Blog";

describe("<Blog />", () => {
  let component;

  const blog = {
    title: "The Joy of React",
    author: "Dan Abramov",
    url: "https://reactjs.org",
    likes: 10,
    user: { username: "dan", name: "Dan Abramov" },
  };

  const mockLikeBlog = jest.fn();
  const mockDeleteBlog = jest.fn();

  beforeEach(() => {
    component = render(
      <Blog
        blog={blog}
        likeBlog={mockLikeBlog}
        deleteBlog={mockDeleteBlog}
        user={{ username: "dan" }}
      />
    );
  });

  test("renders title and author, but not URL or likes by default", () => {
    const blogElement = component.container.querySelector(".blog");
    expect(blogElement).toHaveTextContent("The Joy of React");
    expect(blogElement).toHaveTextContent("Dan Abramov");

    const urlElement = component.container.querySelector(".blog-url");
    const likesElement = component.container.querySelector(".blog-likes");

    expect(urlElement).toBeNull();
    expect(likesElement).toBeNull();
  });

  test('renders URL and likes when the "View" button is clicked', () => {
    const button = screen.getByText("View");
    fireEvent.click(button);

    const urlElement = component.container.querySelector(".blog-url");
    const likesElement = component.container.querySelector(".blog-likes");

    expect(urlElement).toHaveTextContent("https://reactjs.org");
    expect(likesElement).toHaveTextContent("Likes: 10");
  });

  test('URL and likes are displayed when "View" button is clicked', () => {
    const button = screen.getByText("View");
    fireEvent.click(button);

    expect(screen.getByText("URL: https://reactjs.org")).toBeVisible();
    expect(screen.getByText("Likes: 10")).toBeVisible();
  });

  // New Test: Ensure "Like" button calls event handler twice when clicked twice
  test("calls the like button event handler twice when clicked twice", () => {
    const viewButton = screen.getByText("View");
    fireEvent.click(viewButton); // Open blog details

    const likeButton = screen.getByText("Like");
    fireEvent.click(likeButton); // First click
    fireEvent.click(likeButton); // Second click

    expect(mockLikeBlog).toHaveBeenCalledTimes(2);
  });
});
