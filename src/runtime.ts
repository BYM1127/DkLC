export const isServerlessRuntime = (): boolean =>
  Boolean(
    process.env.NETLIFY ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    process.env.NETLIFY_IMAGES_CDN_DOMAIN
  );
