import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/AuthSlice.js'
import momentReducer from './features/MomentSlice.js'
import searchReducer from './features/searchSlice.js'
 
 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    moment: momentReducer,
    search: searchReducer,
  },
});

export default store;
