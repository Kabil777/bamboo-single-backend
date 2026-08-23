import { configureStore } from "@reduxjs/toolkit";
import CreateCoverDetailsBlogDocs from "./reducers/CreateCoverDetialsBlogDocs";
import userReducer from "./reducers/AuthReducers";
import blogCoverReducer from "./reducers/BlogCoverReducer";
import featuredBlogReducer from "./reducers/FeaturedBlogReducer";
import blogPageReducer from "./reducers/BlogPageReducer";
import docsHomeReducer from "./reducers/DocsCoverReducer";
import docsReducer from "./reducers/DocsReducer";
import DocsSlice from "./reducers/DocsEditor";
import getProfileReducer from "./reducers/Profile/profile.read";
import setProfileReducer from "./reducers/Profile/profile.edit";

const store = configureStore({
    reducer: {
        createCoverDetailsBlogDocs: CreateCoverDetailsBlogDocs,
        userReducer: userReducer,
        blogReducer: blogCoverReducer,
        featuredBlogReducer: featuredBlogReducer,
        blogPageReducer: blogPageReducer,
        docsHomeReducer: docsHomeReducer,
        docsReducer: docsReducer,
        DocsSlice: DocsSlice,
        setProfileReducers: setProfileReducer,
        getProfileReducers: getProfileReducer,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
