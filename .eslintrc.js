module.exports = {
    "extends": "airbnb-base",
    "env": {
        "browser": true,
    },
    "rules": {
        "strict": 0,
        "no-use-before-define": 0,
        "no-return-assign": 0,
        "no-param-reassign": 0,
        "no-bitwise": 0,
        "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "linebreak-style": ["error", "windows"],
        "quotes": ["error", "double"],
    }
};