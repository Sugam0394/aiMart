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


 



