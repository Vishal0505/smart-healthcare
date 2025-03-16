import axios from "axios";

const API_URL = "http://localhost:5000/api/patients";

export const fetchVitals = async () => {
  try {
    const response = await axios.get(`${API_URL}/vitals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vitals:", error);
    return [];
  }
};
