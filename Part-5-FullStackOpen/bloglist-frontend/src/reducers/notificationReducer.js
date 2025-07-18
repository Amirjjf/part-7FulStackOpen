import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return "";
    },
  },
});

let timeoutId = null;

export const setNotificationAsync = (message, duration) => {
  return (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    dispatch(setNotification(message));
    timeoutId = setTimeout(() => {
      dispatch(clearNotification());
      timeoutId = null;
    }, duration * 1000);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;