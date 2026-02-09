import { servicesConfig } from "@/config/service";
import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "api-gateway",
    version: "1.0.0",
    uptime: process.uptime(),
    services: {
      auth: servicesConfig.auth.url,
      users: servicesConfig.users.url,
      notes: servicesConfig.notes.url,
      tags: servicesConfig.tags.url,
      search: servicesConfig.search.url,
    },
  });
});

function createserviceProxy(
  targetUrl: string,
  pathRewrite?: Record<string, string>,
): any {
  const options = {
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: pathRewrite || {},
    timeout: 30000, // 30 seconds
    proxyTimeout: 30000, // 30 seconds
    onError: (err: any, req: any, res: any) => {
      console.error(`Proxy error: ${err.message}`);
      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          error: "Service unavailable. Please try again later.",
          message: "Service unavailable. Please try again later.",
        });
      }
    },

    onProxyReq: (proxyReq: any, req: any) => {
      console.log(
        `Proxying request: ${req.method} ${req.originalUrl} to ${targetUrl}`,
      );

      const authHeader = req.headers["authorization"];
      if (authHeader) {
        proxyReq.setHeader("Authorization", authHeader);
      }

      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.userId);
        proxyReq.setHeader("x-user-email", req.user.email);
      }

      if (
        req.body &&
        (req.method === "POST" ||
          req.method === "PUT" ||
          req.method === "PATCH")
      ) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },

    onProxyRes: (proxyRes: any, req: any) => {
      // log proxy response details
      console.log(
        `Received response from ${targetUrl}: ${proxyRes.statusCode} for ${req.method} ${req.originalUrl}`,
      );
    },
  };

  return createProxyMiddleware(options);
}

router.use(
  "/api/auth",
  createserviceProxy(servicesConfig.auth.url, {
    "^/api/auth": "/auth",
  }),
);

router.use(
  "/api/users",
  createserviceProxy(servicesConfig.users.url, {
    "^/api/users": "/users", // Rewrite path to match service endpoint
  }),
);

router.use(
  "/api/notes",
  createserviceProxy(servicesConfig.notes.url, {
    "^/api/notes": "/notes", // Rewrite path to match service endpoint
  }),
);

router.use(
  "/api/tags",
  createserviceProxy(servicesConfig.tags.url, {
    "^/api/tags": "/tags", // Rewrite path to match service endpoint
  }),
);

router.use(
  "/api/search",
  createserviceProxy(servicesConfig.search.url, {
    "^/api/search": "/search", // Rewrite path to match service endpoint
  }),
);

export default router;
