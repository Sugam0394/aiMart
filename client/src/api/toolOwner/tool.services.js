import api from "../axios";
 

export const createTool = (toolData) => {
  return api.post("/createTool", toolData);
};


 // ya jaha se token wala axios hai
 export const getMyTools = () => {
   return api.get("/myTool"); 
  };

  export const fetchPublicTools = async () => {
  const res = await api.get("/public");
  return res.data.data;
};

 

// EDIT tool
export const updateTool = (id, data) => {
  return api.put(`/updateTool/${id}`, data);
};

// DELETE tool
export const deleteTool = (id) => {
  return api.delete(`/deleteTool/${id}`);
};


// section Rising Tools
export const getRisingTools = async () => {
  try {
    const res = await api.get("/risingTools"); // Instance mein agar baseURL hai toh '/api' ki zarurat nahi hogi
    return res.data.data || [];
  } catch (err) {
    console.error("Error fetching rising tools:", err);
    throw err;
  }
};

 

// section  Naya Recommended Tools logic
export const getRecommendedTools = async () => {
  try {
    const interests = JSON.parse(localStorage.getItem("user_interests") || "[]");
    const tagsParam = interests.length > 0 ? `?tags=${interests.join(",")}` : "";
    
    const res = await api.get(`/recommend${tagsParam}`);
    return {
      tools: res.data?.data || [],
      basedOnInterests: res.data?.basedOnInterests || false
    };
  } catch (err) {
    console.error("Error in recommended tools service:", err);
    throw err;
  }
};



export const toolApi = {
  // Smart Solver call using global instance
  getQuickSolution: (slug) => api.get(`/quick-solution?action=${slug}`),

  // Yahan baki calls bhi future mein add kar sakte ho
  // getAllTools: () => api.get('/tools'),
};
 

export const toolService = {
  // Use cases ki list (switcher ke liye)
  getAvailableUseCases: () => api.get('/use-cases'),

  // Specific use case ke tools
  getToolsByUseCase: (key) => api.get(`/use-case/${key}`),

 
 
};
 
 

 


 



