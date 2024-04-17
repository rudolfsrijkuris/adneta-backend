import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/saveLogoToDB", async (req, res) => {
    try {
        const { prompt, style } = req.body;

        const wordsToRemove = ["nude", "naked", "bare", "stripped", "with nothing on", "pussy", "pussies", "pussys", "boob", "boobs", "tit", "tits", "tities", "titie", "dick", "dicks", "penis", "peepee"];

        const pattern = new RegExp(wordsToRemove.join("|"), "gi");

        const filteredPrompt = prompt.replace(pattern, "");

        console.log(filteredPrompt)

        const jsonData = {
            filteredPrompt,
            negative_prompt: "",
            style_selections: [
              // "Fooocus V2",
              // "Fooocus Cinematic",
              // "SAI Fantasy Art",
              // "SAI Cinematic",
              // "Futuristic Futuristic",
              // "Futuristic Vaporwave"
              style
            ],
            performance_selection: "Extreme Speed",
            aspect_ratios_selection: "1024*1024",
            image_number: 1,
            image_seed: -1,
            sharpness: 2,
            guidance_scale: 4,
            base_model_name: "juggernautXL_version6Rundiffusion.safetensors",
            refiner_model_name: "None",
            refiner_switch: 0.5,
            loras: [
              {
                model_name: "sd_xl_offset_example-lora_1.0.safetensors",
                weight: 0.1
              }
            ],
            advanced_params: {
              adaptive_cfg: 7,
              adm_scaler_end: 0.3,
              adm_scaler_negative: 0.8,
              adm_scaler_positive: 1.5,
              canny_high_threshold: 128,
              canny_low_threshold: 64,
              controlnet_softness: 0.25,
              debugging_cn_preprocessor: false,
              debugging_inpaint_preprocessor: false,
              disable_preview: false,
              freeu_b1: 1.01,
              freeu_b2: 1.02,
              freeu_enabled: false,
              freeu_s1: 0.99,
              freeu_s2: 0.95,
              inpaint_disable_initial_latent: false,
              inpaint_engine: "v1",
              inpaint_erode_or_dilate: 0,
              inpaint_respective_field: 1,
              inpaint_strength: 1,
              invert_mask_checkbox: false,
              mixing_image_prompt_and_inpaint: false,
              mixing_image_prompt_and_vary_upscale: false,
              overwrite_height: -1,
              overwrite_step: -1,
              overwrite_switch: -1,
              overwrite_upscale_strength: -1,
              overwrite_vary_strength: -1,
              overwrite_width: -1,
              refiner_swap_method: "joint",
              sampler_name: "dpmpp_2m_sde_gpu",
              scheduler_name: "karras",
              skipping_cn_preprocessor: false
            },
            require_base64: false,
            async_process: false,
            webhook_url: ""
          };

          const server_url = "https://gator-eminent-suddenly.ngrok-free.app";

          try {
              const firstApiResponse = await axios.post(`${server_url}/v1/generation/text-to-image`, jsonData, {
                headers: {
                  'User-Agent': 'Adneta Ltd.',
                  'ngrok-skip-browser-warning': 'true'
                }
              });

              const imageUrl = await firstApiResponse.data[0]?.url;

              let replacedImageUrl;

              if (imageUrl) {
                  replacedImageUrl = imageUrl.replace("http://127.0.0.1:8888", server_url);
              } else {
                  // Handle the case when imageUrl is undefined or null
                  console.error("Image URL is undefined or null");
                  // Set a default value or handle the error in an appropriate way
                  replacedImageUrl = ""; // or any default value you prefer
              }

              // Process the final response or send it directly to the client
              res.json(replacedImageUrl);
          } catch (error) {
              console.error("Error occurred while fetching the image URL:", error);
              // Handle the error appropriately
              res.status(500).json({ error: "An error occurred while fetching the image URL" });
          }

          
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
