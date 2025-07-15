const { test, expect, beforeEach, describe } = require("@playwright/test");

const BASE_URL = "http://localhost:3003"; // ✅ Backend URL

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // ✅ Empty the database
    await request.post(`${BASE_URL}/api/testing/reset`);

    // ✅ Create a user in the backend
    await request.post(`${BASE_URL}/api/users`, {
      data: {
        username: "testuser",
        name: "Test User",
        password: "password123",
      },
    });

    // ✅ Go to the frontend
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const loginHeader = await page.locator("h2", {
      hasText: "Log in to application",
    });
    await expect(loginHeader).toBeVisible();

    const usernameInput = await page.locator('input[name="Username"]');
    await expect(usernameInput).toBeVisible();

    const passwordInput = await page.locator('input[name="Password"]');
    await expect(passwordInput).toBeVisible();

    const loginButton = await page.locator("button", { hasText: "Login" });
    await expect(loginButton).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "password123");
      await page.click('button[name="Login"]');

      // ✅ Verify successful login
      const successMessage = await page.locator("text=Test User logged in");
      await expect(successMessage).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "wrongpassword");
      await page.click('button[name="Login"]');

      // ✅ Verify error message
      const errorMessage = await page.locator(
        "text=Wrong username or password"
      );
      await expect(errorMessage).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      // ✅ Log in the user
      await page.fill('input[name="Username"]', "testuser");
      await page.fill('input[name="Password"]', "password123");
      await page.click('button[name="Login"]');

      const successMessage = await page.locator("text=Test User logged in");
      await expect(successMessage).toBeVisible();
    });

    test("a new blog can be created", async ({ page }) => {
      // Wait for and click the create button
      const createButton = page.getByRole("button", {
        name: "Create New Blog",
      });
      await expect(createButton).toBeVisible();
      await createButton.click();

      // Fill in the blog form
      await page.getByLabel("Title:").fill("New Blog Title");
      await page.getByLabel("Author:").fill("New Blog Author");
      await page.getByLabel("URL:").fill("http://newblog.com");

      // Submit the form
      await page.getByRole("button", { name: "Create" }).click();

      // Wait for the blog to appear in the list
      const blogEntry = page.locator(".blog", { hasText: "New Blog Title" });
      await expect(blogEntry).toBeVisible();

      // Verify the blog details
      const blogSummary = blogEntry.locator(".blog-summary");
      await expect(blogSummary).toContainText("New Blog Title");
      await expect(blogSummary).toContainText("New Blog Author");

      // Optional: Verify the view button exists
      await expect(
        blogSummary.getByRole("button", { name: "View" })
      ).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      // ✅ Ensure blog exists before liking
      const createButton = page.getByRole("button", {
        name: "Create New Blog",
      });
      await expect(createButton).toBeVisible();
      await createButton.click();

      // Fill in the blog form
      await page.getByLabel("Title:").fill("New Blog Title");
      await page.getByLabel("Author:").fill("New Blog Author");
      await page.getByLabel("URL:").fill("http://newblog.com");

      // Submit the form
      await page.getByRole("button", { name: "Create" }).click();

      // Wait for the blog to appear
      const blogEntry = page.locator(".blog", { hasText: "New Blog Title" });
      await expect(blogEntry).toBeVisible();

      // ✅ Now proceed with liking the blog
      const viewButton = blogEntry.getByRole("button", { name: "View" });
      await viewButton.click();

      // Find the likes section before clicking Like
      const likesElement = blogEntry.locator(".blog-likes");
      const initialLikes = await likesElement.textContent();

      // Click the Like button
      const likeButton = blogEntry.getByRole("button", { name: "Like" });
      await likeButton.click();

      // Wait for like count to update
      await expect(likesElement).not.toHaveText(initialLikes);
    });

    test("a user cannot see the delete button for a blog they did not create", async ({
      page,
      request,
    }) => {
      // ✅ Ensure a blog exists before the test
      const createButton = page.getByRole("button", {
        name: "Create New Blog",
      });
      await expect(createButton).toBeVisible();
      await createButton.click();

      // Fill in the blog form
      await page.getByLabel("Title:").fill("New Blog Title");
      await page.getByLabel("Author:").fill("New Blog Author");
      await page.getByLabel("URL:").fill("http://newblog.com");

      // Submit the form
      await page.getByRole("button", { name: "Create" }).click();

      // Wait for the blog to appear
      const blogEntry = page.locator(".blog", { hasText: "New Blog Title" });
      await expect(blogEntry).toBeVisible();

      // ✅ Create a second user
      await request.post(`${BASE_URL}/api/users`, {
        data: {
          username: "otheruser",
          name: "Other User",
          password: "password456",
        },
      });

      // ✅ Log out from `testuser`
      await page.getByRole("button", { name: "Logout" }).click();

      // ✅ Log in as `otheruser`
      await page.fill('input[name="Username"]', "otheruser");
      await page.fill('input[name="Password"]', "password456");
      await page.click('button[name="Login"]');

      // ✅ Expand blog details
      await expect(blogEntry).toBeVisible(); // Ensure the blog exists before expanding
      await blogEntry.getByRole("button", { name: "View" }).click();

      // ✅ Ensure the delete button is NOT visible for `otheruser`
      await expect(
        blogEntry.getByRole("button", { name: "Delete" })
      ).not.toBeVisible();
    });

    test("delete the already created blog", async ({ page }) => {
      // ✅ Ensure a blog exists before attempting deletion
      const createButton = page.getByRole("button", {
        name: "Create New Blog",
      });
      await expect(createButton).toBeVisible();
      await createButton.click();

      // Fill in the blog form
      await page.getByLabel("Title:").fill("New Blog Title");
      await page.getByLabel("Author:").fill("New Blog Author");
      await page.getByLabel("URL:").fill("http://newblog.com");

      // Submit the form
      await page.getByRole("button", { name: "Create" }).click();

      // Wait for the blog to appear in the list
      const blogEntry = page.locator(".blog", { hasText: "New Blog Title" });
      await expect(blogEntry).toBeVisible();

      // ✅ Expand blog details
      const viewButton = blogEntry.getByRole("button", { name: "View" });
      await viewButton.click();

      // ✅ Intercept and accept window.confirm
      page.on("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Are you sure you want to delete");
        await dialog.accept();
      });

      // ✅ Click the delete button
      const deleteButton = blogEntry.getByRole("button", { name: "Delete" });
      await deleteButton.click();

      // ✅ Ensure the blog is removed
      await expect(blogEntry).not.toBeVisible();
    });

    test("blogs are ordered by likes, most likes first", async ({ page }) => {
      // ✅ Ensure blogs are created before attempting to sort them
      const createdBlogs = [
        { title: "Blog A", author: "Author A", url: "http://bloga.com" },
        { title: "Blog B", author: "Author B", url: "http://blogb.com" },
        { title: "Blog C", author: "Author C", url: "http://blogc.com" },
      ];

      // **Step 1: Create Blogs**
      for (const blog of createdBlogs) {
        await page.getByRole("button", { name: "Create New Blog" }).click();
        await page.getByLabel("Title:").fill(blog.title);
        await page.getByLabel("Author:").fill(blog.author);
        await page.getByLabel("URL:").fill(blog.url);
        await page.getByRole("button", { name: "Create" }).click();
        await expect(
          page.locator(".blog", { hasText: blog.title })
        ).toBeVisible();
      }

      // **Step 2: Like Blog C twice**
      const blogC = page.locator(".blog", { hasText: "Blog C" });
      await blogC.getByRole("button", { name: "View" }).click();
      const likeButtonC = blogC.getByRole("button", { name: "Like" });
      await likeButtonC.click();
      await page.waitForTimeout(500);
      await likeButtonC.click();
      await page.waitForTimeout(500);
      await expect(blogC.locator(".blog-likes")).toContainText(/Likes:\s*2/);

      // **Step 3: Like Blog B once**
      const blogB = page.locator(".blog", { hasText: "Blog B" });
      await blogB.getByRole("button", { name: "View" }).click();
      const likeButtonB = blogB.getByRole("button", { name: "Like" });
      await likeButtonB.click();
      await page.waitForTimeout(500);
      await expect(blogB.locator(".blog-likes")).toContainText(/Likes:\s*1/);

      // **Step 4: Refresh Page to Ensure Sorting**
      await page.reload();
      await page.waitForTimeout(1000); // Allow sorting

      // **Step 5: Select Blogs in Order**
      const sortedBlogs = await page.locator(".blog").allTextContents();
      console.log("Sorted Blogs:", sortedBlogs); // Debugging log

      // **Step 6: Validate Expected Order (Descending Likes)**
      expect(sortedBlogs[0]).toContain("Blog C"); // Most likes
      expect(sortedBlogs[1]).toContain("Blog B"); // Medium likes
      expect(sortedBlogs[2]).toContain("Blog A"); // Least likes
    });
  });
});
