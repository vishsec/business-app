import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: false,
    loading: false,
};

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        signInStart : state => {
            state.loading = true;
        },
        signInSuccess : (state, action) => {
            state.currentUser = action.payload;
            // its the data fetched from the database
            state.loading = false;
            state.error = null;
        },
        signInFailure : (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        updateUserStart : (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.error = action.payload,
            state.loading = false;
        },
        deleteUserStart: (state) => {
            state.loading = true;
        },
        deleteUserSuccess:(state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        deleteUserFailure:(state, action) => {
            state.error = action.payload;
            state.loading = null;
        },
    },
});

export const { 
    signInStart,
     signInSuccess,
      signInFailure,
       updateUserStart,
        updateUserSuccess,
         updateUserFailure,
          deleteUserStart,
           deleteUserSuccess,
            deleteUserFailure, } = userSlice.actions;

export default userSlice.reducer;
///////////////////////////////////////////////////////////////////////////////////// -- initial setup to use redux