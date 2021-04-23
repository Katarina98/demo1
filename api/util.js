const getUserId = (headres) => {
    return headres.app_user_id;
}

const getUserName = (headres) => {
    return headres.app_user_name;
}

const getResponseHeaders = () => {
    return {
        'Access-Control-Allow-Origin': '*'
    }
}

module.exports = {
    getUserId,
    getUserName,
    getResponseHeaders
}