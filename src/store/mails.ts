import { DisplayMail } from "@/lib/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export interface MailsState {
    displayMails: DisplayMail[]
    loadingDisplayMails: boolean
}

const initialState: MailsState = {
    displayMails: [],
    loadingDisplayMails: false
}

export const getDisplayMails = createAsyncThunk("mails/get-display-mails", async (_, { getState }) => {
    const { user: { session } } = getState() as RootState;
    if (!session) {
        return
    }
    const { data, error } = await supabase.from("kabootar_emails").select("id,from,to,sent_at,subject").eq('user_id', session.user.id);
    if (error) {
        throw error
    }
    return data as DisplayMail[]
})

const mailsSlice = createSlice({
    name: "mails",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getDisplayMails.pending, (state) => {
                state.loadingDisplayMails = true;
            })
            .addCase(getDisplayMails.rejected, (state) => {
                state.displayMails = [];
                state.loadingDisplayMails = false;
                toast.error("Error while loading emails");
            })
            .addCase(getDisplayMails.fulfilled, (state, action: PayloadAction<DisplayMail[] | undefined>) => {
                if (!action.payload) {
                    state.displayMails = [];
                    state.loadingDisplayMails = false;
                    toast.error("Failed to load emails!");
                    return;
                }
                state.displayMails = action.payload;
                state.loadingDisplayMails = false;
            })
    }
})

export const { } = mailsSlice.actions;
export default mailsSlice.reducer