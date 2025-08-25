import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Add any valid experimental features here if needed
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client-side bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        worker_threads: false,
      };
    }

    // Ignore missing optional dependencies and warnings
    config.ignoreWarnings = [
      /Module not found: Can't resolve '@opentelemetry\/exporter-jaeger'/,
      /Module not found: Can't resolve '@genkit-ai\/firebase'/,
      /require\.extensions is not supported by webpack/,
      { module: /node_modules\/@opentelemetry/ },
      { module: /node_modules\/@genkit-ai/ },
      { module: /node_modules\/handlebars/ },
      { module: /node_modules\/dotprompt/ },
    ];

    // Externalize problematic server-side modules
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('@opentelemetry/exporter-jaeger');
      config.externals.push('@genkit-ai/firebase');
    }

    return config;
  },
};

export default nextConfig;
