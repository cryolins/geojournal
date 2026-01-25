import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false // disabled for a deck.gl issue, see more here https://github.com/visgl/deck.gl/discussions/9857
};

export default nextConfig;
