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