import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { DeveloperApi } from "../api/developer.api";
import { uploadProjectImage } from "../middlewares/multer.middleware";

const router = Router();
const developerApi = new DeveloperApi();

router.use(authenticate);
router.get('/profile/get/:userId', developerApi.getDeveloperProfile);
router.get('/list', authorize(['CUSTOMER']), developerApi.getDevelopersByPage);
router.get('/admin/list', authorize(['ADMIN']), developerApi.getDevelopersByPage);
router.put('/profile/update/:userId', developerApi.updateDeveloperProfile);
router.put('/user/update/:userId', developerApi.updateUserProfile);
router.put('/avatar/update/:userId', uploadProjectImage, developerApi.updateUserAvatar);

// Skill management routes
router.post('/skills/add/:userId', developerApi.addSkill);
router.put('/skills/update/:userId/:skillId', developerApi.updateSkill);
router.delete('/skills/remove/:userId/:skillId', developerApi.removeSkill);
router.get('/skills/:userId', developerApi.getSkills);

export default router;