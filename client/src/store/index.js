import { configureStore, createSlice } from "@reduxjs/toolkit"

const customerSlice = createSlice({
    name: "customer",
    initialState: {
        isLoggedIn: false,
        id: null,
        name: "",
        bookings: [],
        ratingPoints: 0
    },
    reducers: {
        login(state, action) {
            state.isLoggedIn = true
            state.id = action.payload.id
            state.name = action.payload.name
            state.bookings = action.payload.bookings
            state.ratingPoints = action.payload.ratingPoints
            localStorage.removeItem("seatBookeds")
            localStorage.setItem("customerData", JSON.stringify(action.payload))
        },
        logout(state) {
            localStorage.removeItem("customerData")
            localStorage.removeItem("customerId")
            localStorage.removeItem("customerName")
            localStorage.removeItem("seatBookeds")
            localStorage.removeItem("ratingPointsDeducted")
            localStorage.removeItem("refunds")
            localStorage.removeItem("compensationPercent")
            sessionStorage.removeItem("tabState")
            sessionStorage.removeItem("activeTab")
            state.isLoggedIn = false
            state.id = null
            state.name = ""
            state.bookings = []
            state.ratingPoints = 0
        },
        updateName(state, action) {
            state.name = action.payload.name
        },
        addBooking(state, action) {
            state.bookings.push(action.payload)
        },
        setRatingPoints(state, action) {
            state.ratingPoints += action.payload
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