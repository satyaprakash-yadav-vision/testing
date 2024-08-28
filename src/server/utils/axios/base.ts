import axios from 'axios';
import { CONSTANT_CONFIG } from '../../../config/CONSTANT_CONFIG';
axios.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    return error.response;
  }
);

export default class AxiosBase {
  // getSchoolLicense(options: { token: string; orgId: string }) {
  //   const token = options.token;
  //   const orgId = options.orgId;
  //   return axios({
  //     method: 'get',
  //     url: `${CONSTANT_CONFIG.API_URL.SUBSCRIPTION}/school/platform-licenses?orgIds=${orgId}`,
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  // }
}
