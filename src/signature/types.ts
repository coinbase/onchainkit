import type { APIError } from "../api/types";

/**
 * List of transaction lifecycle statuses.
 * The order of the statuses loosely follows the transaction lifecycle.
 *
 * Note: exported as public Type
 */
export type LifecycleStatus =
  | {
      statusName: 'init';
      statusData: {
        type: 'message' | 'typed_message'
      };
    }
  | {
      statusName: 'error';
      statusData: APIError;
    }
  | {
      statusName: 'pending';
      statusData: null;
    }
  | {
      statusName: 'success';
      statusData: null;
    }
  | {
      statusName: 'reset';
      statusData: null;
    };
