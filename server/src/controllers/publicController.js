import Tool from '../models/toolModel.js'


 export const getPublicTools = async (req, res) => {
  try {
    const tools = await Tool.find({ status: "live" })
      .select(
        `
        name
        slug
        tagline
        logo
        pricingType
        outputType
        primaryCategory
        `
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load public tools",
    });
  }
};
