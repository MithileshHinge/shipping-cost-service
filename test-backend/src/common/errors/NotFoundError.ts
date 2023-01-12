/**
 * Gets thrown when requested resource could not be found
 */
class NotFoundError extends Error {
	type = 'NotFoundError';
}
  
export default NotFoundError;
