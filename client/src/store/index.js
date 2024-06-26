import { configureStore, createSlice } from "@reduxjs/toolkit"

const customerSlice = createSlice({
    name: "customer",
    initialState: { isLoggedIn: false },
    reducers: {
        login(state) {
            state.isLoggedIn = true
            localStorage.removeItem("seatBookeds")
        },
        logout(state) {
            localStorage.removeItem("customerId")
            localStorage.removeItem("customerName")
            localStorage.removeItem("screeningId")
            localStorage.removeItem("seatBookeds")
            localStorage.removeItem("seatLength")
            localStorage.removeItem("refunds")
            localStorage.removeItem("compensationPercent")
            sessionStorage.removeItem("tabState")
            sessionStorage.removeItem("activeTab")
            state.isLoggedIn = false
        }
    }
})

const managerSlice = createSlice({
    name: "manager",
    initialState: { isLoggedIn: false, id: null },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true
            state.id = action.payload.id
            sessionStorage.removeItem("tabState")
            sessionStorage.removeItem("activeTab")
            localStorage.removeItem("seatBookeds")
        },
        logout(state) {
            localStorage.removeItem("token")
            localStorage.removeItem("managerId")
            localStorage.removeItem("managerEmail")
            localStorage.removeItem("cinemaId")
            localStorage.removeItem("seatBookeds")
            sessionStorage.removeItem("tabState")
            sessionStorage.removeItem("activeTab")
            state.isLoggedIn = false
            state.id = null
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