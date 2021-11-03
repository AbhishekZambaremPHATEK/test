import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { fetchCount } from './loginAPI';
import HTTP from '../../Api/HTTP';
// import axios from 'axios';

let initialState = {
  data: {},
  status: 'idle'
};
if (localStorage.getItem('auth') !== null) {
  const authentication = JSON.parse(localStorage.getItem('auth'));
  if (authentication.exp * 1000 > Date.now()) {
    HTTP.setAuthorization(
      authentication.auth_token ? `Bearer ${authentication.auth_token}` : '',
      authentication.exp ? authentication.exp : null
    );
    initialState = {
      data: {
        login: authentication
      },
      status: 'idle'
    };
  }
} else if (sessionStorage.getItem('auth') !== null) {
  const authentication = JSON.parse(sessionStorage.getItem('auth'));
  if (authentication.exp * 1000 > Date.now()) {
    HTTP.setAuthorization(
      authentication.auth_token ? `Bearer ${authentication.auth_token}` : '',
      authentication.exp ? authentication.exp : null
    );
    initialState = {
      data: {
        login: authentication
      },
      status: 'idle'
    };
  }
}

export const login = createAsyncThunk('authentication/login', async (data) => {
  const response = await HTTP.sendPostRestRequest('auth/login', data);
  response.data.remember = data.remember;
  return response.data;
});

export const register = createAsyncThunk('authentication/register', async (data) => {
  const response = await HTTP.sendPostRestRequest('auth/register', data);
  return response.data;
});

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearlogin: (state) => {
      localStorage.clear();
      sessionStorage.clear();
      state.data = {};
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data.login = action.payload;
        if (action.payload.remember) localStorage.setItem('auth', JSON.stringify(action.payload));
        else sessionStorage.setItem('auth', JSON.stringify(action.payload));
        HTTP.setAuthorization(
          action.payload.auth_token ? `Bearer ${action.payload.auth_token}` : '',
          action.payload.exp ? action.payload.exp : null
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle';
        state.data.login = {
          status: 'fail',
          message: `${action.error.name} : ${action.error.message}`
        };
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'idle';
        state.data.login = action.payload;
        sessionStorage.setItem('auth', JSON.stringify(action.payload));
        HTTP.setAuthorization(
          action.payload.auth_token ? `Bearer ${action.payload.auth_token}` : '',
          action.payload.exp ? action.payload.exp : null
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'idle';
        state.data.login = {
          status: 'fail',
          message: `${action.error.name} : ${action.error.message}`
        };
      });
  }
});

export const { clearlogin } = authenticationSlice.actions;
export default authenticationSlice.reducer;
