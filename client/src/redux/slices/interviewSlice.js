import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { interviewAPI } from '../../services/api';

export const startInterview = createAsyncThunk('interview/start', async (data, { rejectWithValue }) => {
  try { const { data: res } = await interviewAPI.start(data); return res; }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Failed to start interview'); }
});

export const submitAnswer = createAsyncThunk('interview/submitAnswer', async ({ id, answerData }, { rejectWithValue }) => {
  try { const { data } = await interviewAPI.submitAnswer(id, answerData); return data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Failed to submit answer'); }
});

export const endInterview = createAsyncThunk('interview/end', async (id, { rejectWithValue }) => {
  try { const { data } = await interviewAPI.end(id); return data; }
  catch (error) { return rejectWithValue(error.response?.data?.message || 'Failed to end interview'); }
});

export const fetchUserInterviews = createAsyncThunk('interview/fetchAll', async (page, { rejectWithValue }) => {
  try { const { data } = await interviewAPI.getUserInterviews(page); return data; }
  catch (error) { return rejectWithValue(error.response?.data?.message); }
});

const interviewSlice = createSlice({
  name: 'interview',
  initialState: { current: null, interviews: [], pagination: null, loading: false, error: null, currentQuestion: 0, answers: [] },
  reducers: {
    setCurrentQuestion: (state, action) => { state.currentQuestion = action.payload; },
    addAnswer: (state, action) => { state.answers.push(action.payload); },
    clearInterview: (state) => { state.current = null; state.currentQuestion = 0; state.answers = []; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startInterview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(startInterview.fulfilled, (state, action) => { state.loading = false; state.current = action.payload.interview; state.currentQuestion = 0; state.answers = []; })
      .addCase(startInterview.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(endInterview.fulfilled, (state, action) => { state.current = action.payload.interview; })
      .addCase(fetchUserInterviews.fulfilled, (state, action) => { state.interviews = action.payload.interviews; state.pagination = action.payload.pagination; });
  },
});

export const { setCurrentQuestion, addAnswer, clearInterview, clearError } = interviewSlice.actions;
export default interviewSlice.reducer;
