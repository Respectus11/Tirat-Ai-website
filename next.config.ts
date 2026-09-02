import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove the X-Powered-By header — it leaks the framework version
  // to potential attackers and provides no value to legitimate clients.
  poweredByHeader: false,
};

export default nextConfig;
