// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.
import { Logger } from "./logger.ts";
import type { GenericFunction } from "./logger.ts";
import {
  BaseHandler,
  ConsoleHandler,
  FileHandler,
  RotatingFileHandler,
  WriterHandler,
} from "./handlers.ts";
import { assert } from "../_util/assert.ts";
import type { LevelName } from "./levels.ts";

export { LogLevels } from "./levels.ts";
export type { LevelName } from "./levels.ts";
export { Logger } from "./logger.ts";

export class LoggerConfig {
  level?: LevelName;
  handlers?: string[];
}

export interface LogConfig {
  /**
   * Map of handlers. The key is the name of the handler.
   * Note that "default" is a special handler name that is used for unnamed loggers
   */
  handlers?: {
    [name: string]: BaseHandler;
  };
  loggers?: {
    [name: string]: LoggerConfig;
  };
  /** Fallback logger that is used if a logger with a name is created but not configured via the setup function */
  fallbackLogger?: LoggerConfig;
}

const DEFAULT_LEVEL = "INFO";
const DEFAULT_CONFIG: LogConfig = {
  handlers: {
    default: new ConsoleHandler(DEFAULT_LEVEL),
  },

  loggers: {
    default: {
      level: DEFAULT_LEVEL,
      handlers: ["default"],
    },
  },
};

const state = {
  handlers: new Map<string, BaseHandler>(),
  loggers: new Map<string, Logger>(),
  config: DEFAULT_CONFIG,
};

export const handlers = {
  BaseHandler,
  ConsoleHandler,
  WriterHandler,
  FileHandler,
  RotatingFileHandler,
};

/** Get a logger instance. If not specified `name`, get the default logger.  */
export function getLogger(name?: string): Logger {
  if (!name) {
    const d = state.loggers.get("default");
    assert(
      d != null,
      `"default" logger must be set for getting logger without name`,
    );
    return d;
  }
  const result = state.loggers.get(name);
  if (!result) {
    const handlers = getHandlersByName(state.config.fallbackLogger?.handlers);
    const logger = new Logger(
      name,
      state.config.fallbackLogger?.level ?? "NOTSET",
      { handlers },
    );
    state.loggers.set(name, logger);
    return logger;
  }
  return result;
}

/** Log with debug level, using default logger. */
export function debug<T>(msg: () => T, ...args: unknown[]): T | undefined;
export function debug<T>(
  msg: T extends GenericFunction ? never : T,
  ...args: unknown[]
): T;
export function debug<T>(
  msg: (T extends GenericFunction ? never : T) | (() => T),
  ...args: unknown[]
): T | undefined {
  // Assist TS compiler with pass-through generic type
  if (msg instanceof Function) {
    return getLogger("default").debug(msg, ...args);
  }
  return getLogger("default").debug(msg, ...args);
}

/** Log with info level, using default logger. */
export function info<T>(msg: () => T, ...args: unknown[]): T | undefined;
export function info<T>(
  msg: T extends GenericFunction ? never : T,
  ...args: unknown[]
): T;
export function info<T>(
  msg: (T extends GenericFunction ? never : T) | (() => T),
  ...args: unknown[]
): T | undefined {
  // Assist TS compiler with pass-through generic type
  if (msg instanceof Function) {
    return getLogger("default").info(msg, ...args);
  }
  return getLogger("default").info(msg, ...args);
}

/** Log with warning level, using default logger. */
export function warning<T>(msg: () => T, ...args: unknown[]): T | undefined;
export function warning<T>(
  msg: T extends GenericFunction ? never : T,
  ...args: unknown[]
): T;
export function warning<T>(
  msg: (T extends GenericFunction ? never : T) | (() => T),
  ...args: unknown[]
): T | undefined {
  // Assist TS compiler with pass-through generic type
  if (msg instanceof Function) {
    return getLogger("default").warning(msg, ...args);
  }
  return getLogger("default").warning(msg, ...args);
}

/** Log with error level, using default logger. */
export function error<T>(msg: () => T, ...args: unknown[]): T | undefined;
export function error<T>(
  msg: T extends GenericFunction ? never : T,
  ...args: unknown[]
): T;
export function error<T>(
  msg: (T extends GenericFunction ? never : T) | (() => T),
  ...args: unknown[]
): T | undefined {
  // Assist TS compiler with pass-through generic type
  if (msg instanceof Function) {
    return getLogger("default").error(msg, ...args);
  }
  return getLogger("default").error(msg, ...args);
}

/** Log with critical level, using default logger. */
export function critical<T>(msg: () => T, ...args: unknown[]): T | undefined;
export function critical<T>(
  msg: T extends GenericFunction ? never : T,
  ...args: unknown[]
): T;
export function critical<T>(
  msg: (T extends GenericFunction ? never : T) | (() => T),
  ...args: unknown[]
): T | undefined {
  // Assist TS compiler with pass-through generic type
  if (msg instanceof Function) {
    return getLogger("default").critical(msg, ...args);
  }
  return getLogger("default").critical(msg, ...args);
}

/** Setup logger config. */
export async function setup(config: LogConfig) {
  state.config = {
    handlers: { ...DEFAULT_CONFIG.handlers, ...config.handlers },
    loggers: { ...DEFAULT_CONFIG.loggers, ...config.loggers },
    fallbackLogger: {
      handlers: config.fallbackLogger?.handlers,
      level: config.fallbackLogger?.level,
    },
  };

  // tear down existing handlers
  state.handlers.forEach((handler): void => {
    handler.destroy();
  });
  state.handlers.clear();

  // setup handlers
  const handlers = state.config.handlers || {};

  for (const handlerName in handlers) {
    const handler = handlers[handlerName];
    await handler.setup();
    state.handlers.set(handlerName, handler);
  }

  // remove existing loggers
  state.loggers.clear();

  // setup loggers
  const loggers = state.config.loggers || {};
  for (const loggerName in loggers) {
    const loggerConfig = loggers[loggerName];
    const handlers: BaseHandler[] = getHandlersByName(loggerConfig.handlers);
    const levelName = loggerConfig.level || DEFAULT_LEVEL;
    const logger = new Logger(loggerName, levelName, { handlers: handlers });
    state.loggers.set(loggerName, logger);
  }
}

function getHandlersByName(
  handlerNames: string[] | undefined = [],
): BaseHandler[] {
  const handlers: BaseHandler[] = [];
  handlerNames.forEach((handlerName): void => {
    const handler = state.handlers.get(handlerName);
    if (handler) {
      handlers.push(handler);
    }
  });
  return handlers;
}

await setup(DEFAULT_CONFIG);
