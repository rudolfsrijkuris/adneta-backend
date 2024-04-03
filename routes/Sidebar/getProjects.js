import express from "express";
import jwt from "jsonwebtoken";
import Project from "../ImageUpload/projectModel.js";

const router = express.Router();

// Backend API route to get user's projects
router.get("/getProjects", async (req, res) => {
    const authHeader = req.headers.authorization; // Get the JWT token from the request headers
    const tokenParts = authHeader.split(' ');
  
    if (tokenParts.length === 2 && tokenParts[0] === 'Bearer') {
      const jwtToken = tokenParts[1];
      try {
        const decodedToken = jwt.verify(jwtToken, 'ADNETA-CRAZY-RANDOM-TOKEN'); // Verify and decode the token
        const userId = decodedToken._id; // Retrieve the user ID
  
        // Use the userId to query projects from MongoDB
        const projects = await Project.find({ userId });
  
        return res.status(200).json(projects);
      } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).send('Unauthorized: Invalid token');
      }
    } else {
      return res.status(401).send('Unauthorized: Invalid token format');
    }
});

export default router;