import { Router } from "express";
import { ProjectApi } from "@/web/api/project.api";
import { handleProjectFormData } from "@/web/middlewares/multer.middleware";
import { authenticate } from "@/web/middlewares/auth.middleware";

const router = Router();
const projectApi = new ProjectApi();

// Public routes (no authentication required)
router.get('/public/get-all', projectApi.getAllProjectsPublic);
router.get('/public/get-by-id/:id', projectApi.getProjectByIdPublic);

// Apply authentication middleware to protected routes
router.use(authenticate);

router.post('/types/create-project-type', handleProjectFormData, projectApi.createProjectType);
router.get('/types/get-by-user-id', projectApi.getProjectTypesByUserId);
router.get('/types/:id', projectApi.getProjectTypeById);
router.put('/types/update/:id', handleProjectFormData, projectApi.updateProjectType);
router.delete('/types/delete/:id', projectApi.deleteProjectType);


router.post('/create-project', handleProjectFormData, projectApi.createProject);
router.get('/get-by-user-id', projectApi.getProjectByUserId);
router.get('/get-all', projectApi.getAllProjects);
router.get('/get-by-id/:id', projectApi.getProjectById);
router.put('/update/:id', handleProjectFormData, projectApi.updateProject);
router.delete('/delete/:id', projectApi.deleteProject);


router.post('/team/add-user-to-project/:id', projectApi.addUserToProject);
router.delete('/team/remove-user-from-project/:id/:userId', projectApi.removeUserFromProject);

export default router;
