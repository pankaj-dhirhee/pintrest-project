function send_responce (res, status_code, status, message){
  const response_object = {
    status,
    message
  }
  res.status(status_code).json(response_object);
};

module.exports = send_responce;