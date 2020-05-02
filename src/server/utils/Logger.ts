import * as Sentry from '@sentry/node';
Sentry.init({ dsn: process.env.SENTRY_DSN });

export namespace Logger {
    export function captureMessage(message?: any, ...optionalParams: any[]): void {
		if (process.env.NODE_ENV === 'production') {
			Sentry.captureMessage(message);
		}
		console.error(message, ...optionalParams);
	}

	export function captureException(error: Error): void {
		if (process.env.NODE_ENV === 'production') {
			Sentry.captureException(error);
		}

		console.error(error);
	}
}
