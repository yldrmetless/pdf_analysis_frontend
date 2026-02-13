import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import profileReducer from '../features/profile/profileSlice'
import documentsOverviewReducer from '../features/documentsOverview/documentsOverviewSlice'
import documentsReducer from '../features/documents/documentsSlice'
import documentsCreateReducer from '../features/documentsCreate/documentsCreateSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            auth: authReducer,
            profile: profileReducer,
            documentsOverview: documentsOverviewReducer,
            documents: documentsReducer,
            documentsCreate: documentsCreateReducer,
        },
    })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
