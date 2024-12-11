module.exports = {
    images: {
      domains: ['localhost'],
    },
    env: {
      API_BASE_URL: process.env.API_BASE_URL,
    },

    // erreur cors
    // async rewrites() {
    //   return [
    //     {
    //       source: '/api/:path*',
    //       destination: `${process.env.API_BASE_URL}/:path*`,
    //     },
    //   ]
    // },
  };