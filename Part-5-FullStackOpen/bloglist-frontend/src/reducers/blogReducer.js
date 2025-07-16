import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
    name: "blogs",
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload;
        },
        appendBlog(state, action) {
            state.push(action.payload);
        },
        updateBlog(state, action) {
            const id = action.payload.id;
            return state.map(blog => 
                blog.id !== id ? blog : action.payload
            );
        },
        removeBlog(state, action) {
            const id = action.payload;
            return state.filter(blog => blog.id !== id);
        },
    },
});

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions;

// Async action creators (thunks)
export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll();
        dispatch(setBlogs(blogs));
    };
};

export const createBlog = (content) => {
    return async dispatch => {
        const newBlog = await blogService.create(content);
        dispatch(appendBlog(newBlog));
        return newBlog;
    };
};

export const likeBlog = (blog) => {
    return async dispatch => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id || blog.user,
        };
        const returnedBlog = await blogService.update(blog.id, updatedBlog);
        dispatch(updateBlog(returnedBlog));
        return returnedBlog;
    };
};

export const deleteBlog = (id) => {
    return async dispatch => {
        await blogService.remove(id);
        dispatch(removeBlog(id));
    };
};

export const addCommentToBlog = (id, comment) => {
    return async dispatch => {
        const updatedBlog = await blogService.addComment(id, comment);
        dispatch(updateBlog(updatedBlog));
        return updatedBlog;
    };
};

export default blogSlice.reducer;