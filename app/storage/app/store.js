import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './features/timelectures.js'
export const store = configureStore({
  reducer: {
    data: dataReducer
},
})