type ErrorMiddleware = (error: Error, info?: string) => void;

const errorMiddleware: ErrorMiddleware = (error, info) => {
  if (info) console.error("Additional info:", info);
};

export default errorMiddleware;
