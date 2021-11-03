import axios from 'axios';

class HTTP {
  constructor() {
    this.authString = '';
    this.exp = null;
    this.serverURL = 'http://192.168.3.64:5001/';
  }

  static handleError(reject) {
    return (err) => {
      if (err.response) {
        reject(err.response.data);
      }
    };
  }

  static handleSuccess(resolve) {
    return (result) => {
      // debugger;
      resolve(result.data);
    };
  }

  setAuthorization(authString, exp) {
    this.authString = authString;
    this.exp = exp;
  }

  isAuthoriz() {
    if (this.exp != null && this.exp * 1000 > Date.now()) return true;
    return false;
  }

  async sendGetRestRequest(url) {
    console.log('isAuthoriz : ', this.isAuthoriz());
    // if (this.isAuthoriz()) {
    const response = await axios({
      url: this.serverURL + url,
      method: 'GET',
      responseType: 'json',
      headers: {
        Authorization: this.authString,
        'Content-Type': 'application/json'
      }
    });

    return response;
    // }
    // return {
    //   status: 'failJWT'
    // };
  }

  async sendPostRestRequest(url, data) {
    const response = await axios({
      url: this.serverURL + url,
      data,
      method: 'POST',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;
  }
}

export default new HTTP();
