
function createApplication() {
    return {
        get: function () {
            console.log('get')
        },
        listen: function () {
            console.log('listen')
        }
    }
}

exports = module.exports = createApplication;