export const validateString = function(data, conditions) {
    if (!data || !conditions) {
        return null;
    }

    if (conditions.min && data.length < conditions.min) {
        return 'error';
    }

    if (conditions.max && data.length > conditions.max) {
        return 'error';
    }


    if (conditions.regexp && !data.match(new RegExp(conditions.regexp, "i"))) {
        return 'error';
    }

    return 'success';
}

