// GET /api/rooms/owner - Get rooms created by the authenticated user (owners only)
router.get("/owner", getMyRooms);

// 新增路由：GET /api/rooms/my - Get rooms created by the authenticated user (owners only)
router.get("/my", getMyRooms);