import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { DeveloperApi } from "../api/developer.api";
import { uploadProjectImage } from "../middlewares/multer.middleware";

const router = Router();
const developerApi = new DeveloperApi();

router.use(authenticate);
router.get('/profile/get/:userId', developerApi.getDeveloperProfile);
router.put('/profile/update/:userId', developerApi.updateDeveloperProfile);
router.put('/user/update/:userId', developerApi.updateUserProfile);
router.put('/avatar/update/:userId', uploadProjectImage, developerApi.updateUserAvatar);

export default router;