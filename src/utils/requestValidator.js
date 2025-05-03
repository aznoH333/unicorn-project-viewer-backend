/**
 * Request Validator Utility
 * 
 * This utility function validates incoming requests against a specified validation schema.
 * It checks for the presence of required fields and verifies that the types of the provided values match the expected types.
 * This function is primarily used in controllers to ensure that incoming data is valid before processing it further.
 * 
 * @module validator
 */

/**
 * Validates a request object against a given validation schema.
 * 
 * @param {Object} request - The request object to validate. Typically, this is the body of an incoming HTTP request.
 * 
 * @param {Object} validationSchema - An object defining the validation rules for the request. Each key corresponds to a field in the request, and its value is an object specifying the expected type and whether the field is required.
 * 
 * @throws {Error} Throws an error if a required field is missing or if a field's value does not match the expected type.
 * 
 * @example
 * // Example usage of validateRequest function in an Express.js controller
 * try {
 *     validator.validateRequest(request.body, {
 *         title: { type: "string", required: true },
 *         description: { type: "string", required: true },
 *         dateCreated: { type: "string", required: true },
 *         dateEnded: { type: "string" }
 *     });
 *     
 *     projectService.updateProject(request.params.id, request.body.title, request.body.description, request.body.dateCreated, request.body.dateEnded);
 *     response.send({});
 * } catch (err) {
 *     next(err); // Pass the error to the next middleware
 * }
 */
function validateRequest(request, validationSchema){
    for (const it of Object.entries(validationSchema)) {
        if (it[1].required && !Object.keys(request).includes(it[0])) {
            
            throw new Error(`Request validation error. Missing required field ${it[0]}`);
        }

        if (request[it[0]] !== undefined && typeof request[it[0]] !== it[1].type){
            throw new Error(`Request validation error. Field has wrong type ${it[0]}. Value ${request[it[0]]}. Type ${typeof request[it[0]]}. Required ${it[1].type}`);
        }
    }
}

module.exports.validateRequest = validateRequest;