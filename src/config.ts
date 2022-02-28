export let version: string;
export function setVersion(v: typeof version) {
	if (version !== undefined) {
		throw new Error(
			`Can only set version once, trying to replace '${version}' with '${v}'`,
		);
	}
	version = v;
}

export const SECONDS = 1000;
export const SECONDS_PER_HOUR = 60 * 60;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;

export const requiredVar = (varName: string): string => {
	const s = process.env[varName];
	if (s == null) {
		process.exitCode = 1;
		throw new Error(`Missing environment variable: ${varName}`);
	}
	return s;
};

export function optionalVar(varName: string, defaultValue: string): string;
export function optionalVar(
	varName: string,
	defaultValue?: string,
): string | undefined;
export function optionalVar(
	varName: string,
	defaultValue?: string,
): string | undefined {
	return process.env[varName] || defaultValue;
}

export function intVar(varName: string): number;
export function intVar<R>(varName: string, defaultValue: R): number | R;
export function intVar<R>(varName: string, defaultValue?: R): number | R {
	if (arguments.length === 1) {
		requiredVar(varName);
	}

	const s = process.env[varName];
	if (s == null) {
		return defaultValue!;
	}
	const i = parseInt(s, 10);
	if (!Number.isFinite(i)) {
		throw new Error(`${varName} must be a valid number if set`);
	}
	return i;
}

const redisHost = requiredVar('REDIS_HOST');
const redisPort = intVar('REDIS_PORT');
const redisRoHost = optionalVar('REDIS_RO_HOST', redisHost);
const redisRoPort = intVar('REDIS_RO_PORT', redisPort);
const redisLogsHost = optionalVar('REDIS_LOGS_HOST');
const redisLogsPort = intVar('REDIS_LOGS_PORT', undefined);
export const REDIS = {
	general: {
		host: redisHost,
		port: redisPort,
		roHost: redisRoHost,
		roPort: redisRoPort,
	},
	logs: {
		host: redisLogsHost ?? redisHost,
		port: redisLogsPort ?? redisPort,
		roHost: optionalVar('REDIS_LOGS_RO_HOST') ?? redisLogsHost ?? redisRoHost,
		roPort:
			intVar('REDIS_LOGS_RO_PORT', undefined) ?? redisLogsPort ?? redisRoPort,
	},
};
