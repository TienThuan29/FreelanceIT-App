import { Router } from "express";
import { ProjectTeamApi } from "@/web/api/project-team.api";
import { authenticate } from "@/web/middlewares/auth.middleware";

const router = Router();
const projectTeamApi = new ProjectTeamApi();

// Apply authentication middleware to all routes
router.use(authenticate);

// Project team routes
router.get('/project/:projectId/members', projectTeamApi.getProjectTeamMembers);
router.post('/project/:projectId/members', projectTeamApi.addTeamMember);
router.delete('/project/:projectId/members/:developerId', projectTeamApi.removeTeamMember);
router.put('/member/:teamMemberId', projectTeamApi.updateTeamMember);
router.get('/member/:teamMemberId', projectTeamApi.getTeamMemberById);
router.get('/developer/projects', projectTeamApi.getProjectsByDeveloper);

export default router;
