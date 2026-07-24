/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Clean URL for the freelance portfolio: /build serves the static public/build.html
  async rewrites() {
    return [{ source: "/build", destination: "/build.html" }];
  },
  webpack: (config) => {
    config.externals.push(
      "@walletconnect/ethereum-provider",
      "@walletconnect/universal-provider",
      "@walletconnect/sign-client",
      "@walletconnect/modal",
      "@base-org/account",
      "@coinbase/wallet-sdk",
      "@metamask/connect-evm",
      "@metamask/sdk",
      "porto",
      "porto/internal",
      "@safe-global/safe-apps-sdk",
      "@safe-global/safe-apps-provider",
    );
    return config;
  },
};

module.exports = nextConfig;