

module.exports={
    randomStringGenerate: function (x) {
        const randomString = require("randomstring");
        return randomString.generate(x);
    }
}