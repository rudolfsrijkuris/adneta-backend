import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dbConnect from "./dbConnect.js";
import ipWhitelistMiddleware from "./routes/ipWhitelistMiddleware.js";

// Routes
import instagramCaptionGenerator from "./routes/CaptionGenerator/instagramCaptionGenerator.js";
import facebookCaptionGenerator from "./routes/CaptionGenerator/facebookCaptionGenerator.js";
import logoGenerator from "./routes/ImageGenerator/logoGenerator.js";
import userLogin from "./routes/Authentication/userLogin.js";
import userRegistration from "./routes/Authentication/userRegistration.js";
import usernameGenerator from "./routes/UsernameGenerator/usernameGenerator.js";
import adIdeaGenerator from "./routes/AdIdeaGenerator/adIdeaGenerator.js";
import hashtagGenerator from "./routes/HashtagGenerator/hashtagGenerator.js";
import blogPostGenerator from "./routes/BlogPostGenerator/blogPostGenerator.js";
import imageUpload from "./routes/ImageUpload/imageUpload.js";
import getProjects from "./routes/Sidebar/getProjects.js";
import saveLogoToDB from "./routes/ImageGenerator/saveLogoToDB.js";

dbConnect();

const app = express();
const port = 3080;

app.use(bodyParser.json());
app.use(cors());

// Apply ip whitelist middleware globally
//app.use(ipWhitelistMiddleware);

// Routes
app.use(instagramCaptionGenerator);
app.use(facebookCaptionGenerator);
app.use(logoGenerator);
app.use(userLogin);
app.use(userRegistration);
app.use(usernameGenerator);
app.use(adIdeaGenerator);
app.use(hashtagGenerator);
app.use(blogPostGenerator);
app.use(imageUpload);
app.use(getProjects);
app.use(saveLogoToDB);

app.listen(port, () => {
    console.log(`Adneta listening at http://localhost:${port}`);
});
