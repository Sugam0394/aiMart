import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/AuthSlice.js'
import momentReducer from './features/MomentSlice.js'
import searchReducer from './features/searchSlice.js'
import exploreReducer from './exploreFeatures/exploreSlice.js'
import savedReducer from './features/SavedSlice.js'
 
 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    moment: momentReducer,
    search: searchReducer,
    explore: exploreReducer,
    saved: savedReducer
  },
});

export default store;
