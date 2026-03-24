# Centralized Error Handling

This document outlines the centralized error-handling architecture for the TalentTrust Backend. The system is designed to provide consistent API responses, simplify debugging in development, and ensure security in production.

## 1. Overview
All operational errors in the application are managed by a global middleware. Instead of using generic Error objects, developers should use the specialized subclasses of AppError.

## 2. Global Error Response Structure
Every error response returns a 4xx or 5xx HTTP status code with the following JSON body:

`json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE_STRING",
    "message": "A descriptive error message",
    "stack": "Stack trace (Available only in development mode)"
  }
}

3. Error Classes and Mappings
| Class | HTTP Status | Error Code | Description |
|---|---|---|---|
| ValidationError | 400 | VALIDATION_ERROR | Thrown when input data fails schema or logic validation. |
| UnauthorizedError | 401 | UNAUTHORIZED | Thrown when a request lacks valid authentication credentials. |
| ForbiddenError | 403 | FORBIDDEN | Thrown when an authenticated user lacks permission for an action. |
| NotFoundError | 404 | NOT_FOUND | Thrown when a requested resource or route does not exist. |
| ConflictError | 409 | CONFLICT | Thrown when a resource already exists (e.g., duplicate email). |
| UnprocessableError | 422 | UNPROCESSABLE | Thrown for semantic errors (e.g., business logic violations). |
| AppError | 500 | INTERNAL_SERVER_ERROR | The base class for all internal or unhandled exceptions. |
4. Usage in Code
Throwing Errors
When an error condition is met in a controller or service, pass the error instance to the next() function.
import { NotFoundError, UnauthorizedError } from '../errors/AppError';

export const getUser = async (req, res, next) => {
  const user = await db.users.find(req.params.id);
  
  if (!user) {
    return next(new NotFoundError('User'));
  }
  
  res.json(user);
};

Route Not Found (404)
The notFoundHandler is automatically registered after all routes in src/index.ts to catch any undefined endpoints and format them as a NOT_FOUND error.
5. Security Considerations
 * Production: In production environments (NODE_ENV=production), the stack property is automatically omitted from the response to prevent exposing internal file structures or logic.
 * Consistency: The middleware ensures that even standard JavaScript errors (like ReferenceError or TypeError) are caught and formatted into the standard JSON shape rather than crashing the process.

---
