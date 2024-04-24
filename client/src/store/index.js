import { configureStore, createSlice } from "@reduxjs/toolkit"

const customerSlice = createSlice({
    name: "customer",
    initialState: { isLoggedIn: false },
    reducers: {
        login(state) {
            state.isLoggedIn = true
        },
        logout(state) {
            localStorage.removeItem("customerId")
            localStorage.removeItem("customerName")
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
            localStorage.removeItem("token")
            localStorage.removeItem("managerId")
            localStorage.removeItem("managerEmail")
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