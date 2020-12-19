// FUNCTION SUCCESS
exports.success = function(result) {
    return {
        status: 'success',
        result: result
    }
}

// FUNCTION ERROR
exports.error = function(message) {
    return {
        statut: 'error',
        result: message
    }
}


// FUNCTION ISERR
exports.isErr = function(err) {
    return err instanceof Error;
}

// FUNCTION CHECKANDCHANGE (Permet de renvoyer erreur ou obj)
exports.checkAndChange = (obj) => {
    if (this.isErr(obj)) {
        return this.error(obj.message)
    }
    else {
        return this.success(obj)
    }
}