import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// import HTTP from '../../Api/HTTP';

const initialState = {
  data: {},
  status: 'idle'
};

export const getDiseaseLocation = createAsyncThunk('home/getDiseaseLocation', async () => {
  // const response = await HTTP.sendGetRestRequest('dataprocessing/get-disease-location-list');
  const response = await axios({
    url: 'http://192.168.3.64:5002/dataprocessing/get-disease-location-list',
    method: 'GET',
    responseType: 'json',
    headers: {
      // Authorization: this.authString,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
});

export const getPrediction = createAsyncThunk('home/getPrediction', async (data) => {
  // const response = await HTTP.sendGetRestRequest('dataprocessing/predict');
  const response = await axios({
    url: 'http://192.168.3.64:5002/dataprocessing/predict',
    method: 'POST',
    data,
    responseType: 'json',
    headers: {
      // Authorization: this.authString,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
});

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearhome: (state) => {
      state.data = {};
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDiseaseLocation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDiseaseLocation.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data.diseaselocation = action.payload;
      })
      .addCase(getDiseaseLocation.rejected, (state, action) => {
        state.status = 'idle';
        state.data.diseaselocation = {
          status: 'fail',
          message: `${action.error.name} : ${action.error.message}`
        };
      })
      .addCase(getPrediction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getPrediction.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data.prediction = action.payload;
      })
      .addCase(getPrediction.rejected, (state, action) => {
        state.status = 'idle';
        state.data.prediction = {
          status: 'fail',
          message: `${action.error.name} : ${action.error.message}`
        };
      });
  }
});

export const { clearhome } = homeSlice.actions;
export default homeSlice.reducer;
