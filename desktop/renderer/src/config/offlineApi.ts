/**
 * Offline API Adapter
 * 
 * Intercepts API calls and routes them to the local IndexedDB
 * when running in Electron offline mode.
 */

import offlineDb from '../lib/offlineDb';

// Check if running in Electron
export const isElectron = typeof window !== 'undefined' && 
  (navigator.userAgent.toLowerCase().includes('electron') ||
   (window as unknown as { process?: { type?: string } }).process?.type === 'renderer');

// API response wrapper
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

function createResponse<T>(data: T, status = 200): ApiResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : status === 201 ? 'Created' : 'Error',
  };
}

// Parse URL to extract path and query params
function parseUrl(url: string): { path: string; params: URLSearchParams } {
  const urlObj = new URL(url, 'http://localhost');
  return {
    path: urlObj.pathname,
    params: urlObj.searchParams,
  };
}

// Extract ID from URL path like /api/resource/123
function extractId(path: string): string | null {
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 3) {
    return parts[parts.length - 1];
  }
  return null;
}

// Route handlers
type RouteHandler = (params: URLSearchParams, data?: unknown, id?: string | null) => Promise<unknown>;

interface RouteHandlers {
  GET?: RouteHandler;
  POST?: RouteHandler;
  PUT?: RouteHandler;
  DELETE?: RouteHandler;
}

const routes: Record<string, RouteHandlers> = {
  // General Traffic Offences
  '/api/generalTraficOffence': {
    GET: async (params) => {
      const groupBy = params.get('groupBy');
      if (groupBy === 'offenceType') {
        const filters: Record<string, string> = {};
        params.forEach((value, key) => {
          if (key !== 'groupBy' && value) {
            filters[key] = value;
          }
        });
        return offlineDb.generalTrafficOffences.getGroupedByOffenceType(filters);
      }
      return offlineDb.generalTrafficOffences.getAll();
    },
    POST: async (_params, data) => {
      return offlineDb.generalTrafficOffences.create(data as Record<string, unknown>);
    },
  },
  '/api/generalTraficOffence/:id': {
    GET: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.generalTrafficOffences.getById(id);
    },
    PUT: async (_params, data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.generalTrafficOffences.update(id, data as Record<string, unknown>);
    },
    DELETE: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.generalTrafficOffences.delete(id);
    },
  },

  // Speed Check Records
  '/api/speedCheckRecord': {
    GET: async () => offlineDb.speedCheckRecords.getAll(),
    POST: async (_params, data) => offlineDb.speedCheckRecords.create(data as Record<string, unknown>),
  },
  '/api/speedCheckRecord/:id': {
    GET: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.speedCheckRecords.getById(id);
    },
    PUT: async (_params, data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.speedCheckRecords.update(id, data as Record<string, unknown>);
    },
    DELETE: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.speedCheckRecords.delete(id);
    },
  },

  // MP Reports
  '/api/mp-reports': {
    GET: async () => offlineDb.mpReports.getAll(),
    POST: async (_params, data) => offlineDb.mpReports.create(data as Record<string, unknown>),
  },
  '/api/mp-reports/:id': {
    GET: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.mpReports.getById(id);
    },
    PUT: async (_params, data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.mpReports.update(id, data as Record<string, unknown>);
    },
    DELETE: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.mpReports.delete(id);
    },
  },

  // Witnessing MPs
  '/api/witnessing-mps': {
    GET: async () => offlineDb.witnessingMps.getAll(),
    POST: async (_params, data) => offlineDb.witnessingMps.create(data as Record<string, unknown>),
  },
  '/api/witnessing-mps/:id': {
    GET: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.witnessingMps.getById(id);
    },
    PUT: async (_params, data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.witnessingMps.update(id, data as Record<string, unknown>);
    },
    DELETE: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.witnessingMps.delete(id);
    },
  },

  // Offenders
  '/api/offender': {
    GET: async () => offlineDb.offenders.getAll(),
    POST: async (_params, data) => offlineDb.offenders.create(data as Record<string, unknown>),
  },
  '/api/offender/:id': {
    GET: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.offenders.getById(id);
    },
    PUT: async (_params, data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.offenders.update(id, data as Record<string, unknown>);
    },
    DELETE: async (_params, _data, id) => {
      if (!id) throw new Error('ID required');
      return offlineDb.offenders.delete(id);
    },
  },

  // Suggestions
  '/api/suggestions': {
    GET: async (params) => {
      const field = params.get('field') || '';
      const query = params.get('query') || '';
      return offlineDb.fieldSuggestions.getSuggestions(field, query);
    },
  },
};

// Match URL path to route pattern
function matchRoute(path: string): { route: RouteHandlers | null; id: string | null } {
  // Direct match
  if (routes[path]) {
    return { route: routes[path], id: null };
  }

  // Pattern match for :id routes
  const parts = path.split('/').filter(Boolean);
  if (parts.length >= 3) {
    const id = parts.pop();
    const basePath = '/' + parts.join('/') + '/:id';
    if (routes[basePath]) {
      return { route: routes[basePath], id: id || null };
    }
  }

  return { route: null, id: null };
}

// Main offline request handler
export async function offlineRequest<T>(
  method: string,
  url: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  const { path, params } = parseUrl(url);
  const { route, id } = matchRoute(path);

  if (!route) {
    console.warn(`[OfflineAPI] No handler for: ${method} ${path}`);
    return createResponse([] as unknown as T);
  }

  const handler = route[method.toUpperCase() as keyof RouteHandlers];
  if (!handler) {
    console.warn(`[OfflineAPI] Method ${method} not supported for: ${path}`);
    return createResponse(null as T, 405);
  }

  try {
    const result = await handler(params, data, id);
    const status = method.toUpperCase() === 'POST' ? 201 : 200;
    return createResponse(result as T, status);
  } catch (error) {
    console.error(`[OfflineAPI] Error:`, error);
    return createResponse({ error: (error as Error).message } as T, 500);
  }
}

export default offlineRequest;
