import { supabase } from "@/lib/supabase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";
import { RootState } from ".";
import { toast } from "sonner";

export interface AuthState {
    session: null | Session,
    updatingSession: boolean,
}

const initialState: AuthState = {
    session: null,
    updatingSession: false,
}

export const updateSession = createAsyncThunk("user/update-session", async (_, { getState }) => {
    const { user: { session } } = getState() as RootState;
    if (session == null) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            throw error
        }

        if (!data.session) {
            throw new Error("user not logged in!");
        }
        return data.session;
    }
    else {
        const { data, error } = await supabase.auth.refreshSession();

        if (error) {
            throw error
        }
        if (!data.session) {
            throw new Error("user not logged in!");
        }
        return data.session
    }
})

const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSession(state, action: PayloadAction<Session | null>) {
            state.session = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateSession.pending, (state) => {
                state.updatingSession = true;
            })
            .addCase(updateSession.fulfilled, (state, data: PayloadAction<Session | null>) => {
                state.session = data.payload;
                state.updatingSession = false;
            })
            .addCase(updateSession.rejected, (state) => {
                state.session = null;
                const currentPath = window.location.pathname;
                if (currentPath.startsWith("/login") || currentPath.startsWith("/signup")) {
                    return
                }
                toast.error("Failed to get Session! Please Login again");
                state.updatingSession = false;
                window.location.href = `/login?redirect=${window.encodeURIComponent(window.location.href)}`
            })
    }
});

export const { setSession } = authSlice.actions;
export default authSlice.reducer;