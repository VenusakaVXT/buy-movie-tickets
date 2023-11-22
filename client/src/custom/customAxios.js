import axios from "axios"
import { API_TIMEOUT } from "./customTimeout.js"

axios.defaults.adapter = (config) => {
    return new Promise((resolve, reject) => {
        axios.interceptors.request.use(
            (config) => {
                // Do something before request is sent
                return config
            },
            (error) => {
                // Handle request error
                reject(error)
            }
        )

        axios.interceptors.response.use(
            (response) => {
                // Do something with response data
                return response
            },
            (error) => {
                // Handle response error
                const { response } = error

                if (response) {
                    // The server responded with a status code
                    // you can handle it here
                    console.error("Server responded with", response.status, response.statusText)
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an XMLHttpRequest instance
                    console.error("Request failed", error.request)
                } else {
                    // Something else went wrong
                    console.error("Network Error", error.message)
                }

                return Promise.reject(error)
            }
        )

        return axios(config)
    })
}

axios.defaults.timeout = API_TIMEOUT

export default axios