/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old Wix URL — keep working in case it's bookmarked or already on
      // file with Apple's review team.
      {
        source: "/copy-of-security-policy",
        destination: "/security-policy",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
