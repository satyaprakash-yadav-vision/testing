/**
 * Schema for a JSON primitive values
 */
export type JSONPrimitive = string | number | boolean | Date | null;

// Schema for JSON entry
type JSONEntry = JSONPrimitive | Json | JsonArray;

/**
 * Schema for a JSON object
 */
export interface Json {
  [key: string]: JSONEntry;
}

/**
 * Schema for a JSON array
 */
export type JsonArray = Array<JSONEntry>;

// Not compatible with JSON
type DefinitelyNotJsonable = ((...args: any[]) => any) | undefined;

/**
 * Defines typing for matching JSON compatible objects
 */
export type JsonCompatible<T> =
  // Check if there are any non-jsonable types represented in the union
  // Note: use of tuples in this first condition side-steps distributive conditional types
  // (see https://github.com/microsoft/TypeScript/issues/29368#issuecomment-453529532)
  [Extract<T, DefinitelyNotJsonable>] extends [never]
    ? // Non-jsonable type union was found empty
      T extends JSONPrimitive
      ? // Primitive is acceptable
        T
      : // Otherwise check if array
      T extends (infer U)[]
      ? // Arrays are special; just check array element type
        JsonCompatible<U>[]
      : // Otherwise check if object
      T extends object
      ? // It's an object
        {
          // Iterate over keys in object case
          [P in keyof T]: JsonCompatible<T[P]>; // Recursive call for children
        }
      : // Otherwise any other non-object no bueno
        never
    : // Otherwise non-jsonable type union was found not empty
      never;

export interface StringMap<T> {
  [key: string]: T;
}

type AllKeyOf<T> = T extends never ? never : keyof T;

type Omit<T, K> = { [P in Exclude<keyof T, K>]: T[P] };

type Optional<T, K> = { [P in Extract<keyof T, K>]?: T[P] };

export type WithOptional<T, K extends AllKeyOf<T>> = T extends never
  ? never
  : Omit<T, K> & Optional<T, K>;

declare module 'http' {
  interface OutgoingMessage {
    /**
     * Body on express response is set by the consumer micro service so that response
     * body can also be logged.
     */
    body?: Json | string;
    /**
     * Response time for the corresponding request
     */
    responseTime: string;
  }

  interface IncomingMessage {
    /**
     * Error object in case of an error in processing the request
     */
    err?: Error;
    /**
     * Original route configured in express router for the API
     */
    originalRoute: string;
  }
}
