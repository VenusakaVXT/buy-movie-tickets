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
            localStorage.removeItem("userEmail")
            localStorage.removeItem("userName")
            localStorage.removeItem("seatBookeds")
            localStorage.setItem("customerData", JSON.stringify(action.payload))
        },
        logout(state) {
            localStorage.clear()
            sessionStorage.clear()
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
        removeBooking(state, action) {
            state.bookings = state.bookings.filter(booking => booking._id !== action.payload)
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
            localStorage.removeItem("userEmail")
            localStorage.removeItem("userName")
        },
        logout(state) {
            localStorage.clear()
            sessionStorage.clear()
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