import Sentry from "@sentry/node";
import Tracing from "@sentry/tracing";

export const initializeSentry = (app) => {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
}

export const forceLoggingErrors = (app) => {
  app.use(function (err, req, res, next) {
    Sentry.captureException(err);
    next(err)
  })
}