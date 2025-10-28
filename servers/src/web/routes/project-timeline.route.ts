import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { ProjectTimelineApi } from "../api/project-timeline.api";

const router = Router();
const projectTimelineApi = new ProjectTimelineApi();

router.use(authenticate);

// ProjectTimeline CRUD routes
router.post('/', authorize(['CUSTOMER', 'DEVELOPER']), projectTimelineApi.createTimeline);
router.get('/', authorize(['CUSTOMER', 'DEVELOPER']), projectTimelineApi.getAllTimelines);
router.get('/:id', authorize(['CUSTOMER', 'DEVELOPER']), projectTimelineApi.getTimelineById);
router.get('/project/:projectId', authorize(['CUSTOMER', 'DEVELOPER']), projectTimelineApi.getTimelinesByProjectId);
router.put('/:id', authorize(['CUSTOMER', 'DEVELOPER']), projectTimelineApi.updateTimeline);
router.delete('/:id', authorize(['CUSTOMER', 'DEVELOPER']), projectTimelineApi.deleteTimeline);

export default router;
