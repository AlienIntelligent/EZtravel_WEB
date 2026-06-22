import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AIChatMessage } from '../shared/types';

export interface AIState {
    historyFilter: { page: number };
    chatHistory: AIChatMessage[];
}

const initialState: AIState = {
    historyFilter: { page: 1 },
    chatHistory: [
        { role: 'assistant', content: 'Xin chào! Tôi là Trợ lý AI của ezTravel. Tôi có thể giúp gì cho chuyến đi của bạn?' }
    ],
};

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        setHistoryFilter(state, action: PayloadAction<Partial<AIState['historyFilter']>>) {
            state.historyFilter = { ...state.historyFilter, ...action.payload };
        },
        addChatMessage(state, action: PayloadAction<AIChatMessage>) {
            state.chatHistory.push(action.payload);
        },
        clearChatHistory(state) {
            state.chatHistory = [
                { role: 'assistant', content: 'Xin chào! Tôi là Trợ lý AI của ezTravel. Tôi có thể giúp gì cho chuyến đi của bạn?' }
            ];
        }
    }
});

export const { setHistoryFilter, addChatMessage, clearChatHistory } = aiSlice.actions;

export default aiSlice.reducer;
