export const responses = {
  sendFailure: (res, data, code = 400) => {
    res.status = code;
    res.success = false;
    res.message = data.message;
    delete data.message;
    res.detail = data.data;
    return res;
  },

  sendError: (res, data, code = 500) => {
    res.status = code;
    res.grpcCode = data.grpcCode;
    res.success = false;
    res.detail = data;
    res.message = data.message;
    return res;
  },

  sendSuccess: (res, data) => {
    res.status = 200;
    res.success = true;
    res.message = data.message;
    delete data.message;
    res.detail = data.data;
    return res;
  },

  sendCreated: (res, data) => {
    res.status = 201;
    res.success = true;
    res.detail = data;
    res.message = data.message;
    return res;
  },

  sendSuccessNoContent: (res, data) => {
    res.status = 204;
    res.success = true;
    res.detail = data;
    res.message = data?.message;
    return res;
  }
};
