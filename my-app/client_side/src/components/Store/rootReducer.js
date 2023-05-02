import { configureStore } from '@reduxjs/toolkit'
import  counterReducer  from './contextStore'

export const store = configureStore({
  reducer: {
    Store: counterReducer,
  },
})