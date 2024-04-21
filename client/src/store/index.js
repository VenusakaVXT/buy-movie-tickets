import { configureStore, createSlice } from "@reduxjs/toolkit"

const customerSlice = createSlice({
    name: "customer",
    initialState: { isLoggedIn: false },
    reducers: {
        login(state) {
            state.isLoggedIn = true
        },
        logout(state) {
            state.isLoggedIn = false
        }
    }
})

const managerSlice = createSlice({
    name: "manager",
    initialState: { isLoggedIn: false },
    reducers: {
        login(state) {
            state.isLoggedIn = true
        },
        logout(state) {
            state.isLoggedIn = false
        }
    }
})


export const customerActions = customerSlice.actions
export const managerActions = managerSlice.actions

export const store = configureStore({
    reducer: {
        customer: customerSlice.reducer,
        manager: managerSlice.reducer
    }
})