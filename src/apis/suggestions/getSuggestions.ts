import axios from "axios";

export const getFieldSuggestions = async (fieldType: string, query: string = "") => {
  const response = await axios.get("/api/suggestions", {
    params: { fieldType, query },
  });
  console.log(response);
  return response.data;
};
