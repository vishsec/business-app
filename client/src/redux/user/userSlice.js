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
        }
    }
});

export const { signInStart, signInSuccess, signInFailure} = userSlice.actions;

export default userSlice.reducer;
///////////////////////////////////////////////////////////////////////////////////// -- initial setup to use redux