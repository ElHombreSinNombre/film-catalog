import type apiError from '@interfaces/apierror'

const API_ERRORS = {
  INVALID_CONTENT_TYPE: {
    message: 'Invalid content type. Expected application/json',
    status: 415,
    code: 'INVALID_CONTENT_TYPE',
  },
  MISSING_FIELDS: {
    message: 'Missing required fields in request body',
    status: 400,
    code: 'MISSING_FIELDS',
  },
  BAD_REQUEST: {
    message: 'Bad Request',
    status: 400,
    code: 'BAD_REQUEST',
  },
  DB_ERROR: {
    message: 'Database operation failed',
    status: 500,
    code: 'DB_ERROR',
  },
} as const

const createErrorResponse = (error: apiError) => {
  return new Response(
    JSON.stringify({
      error: error.message,
      code: error.code,
    }),
    {
      status: error.status,
      headers: { 'Content-Type': 'application/json' },
    }
  )
}

export { API_ERRORS, createErrorResponse }
