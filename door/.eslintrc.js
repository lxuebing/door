module.exports = {
  root: true,
  extends: '@react-native-community',
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    "jest": true,
    "react-native/react-native": true
  },
  plugins: [
    "jest",
    "react",
    "react-native",
    "immutable",
    "filenames",
    "@scottnonnenberg/thehelp"
  ],
  settings: {
    "import/resolver": {
      "node": {
        "extensions": [
          ".js",
          ".ios.js",
          ".android.js"
        ]
      }
    }
  },
  rules: {
    /* rules below are explicitly disabled */
    "no-underscore-dangle": "off",
    "react/forbid-prop-types": "off",
    "class-methods-use-this": "off",
    "no-use-before-define": "off",
    "no-mixed-operators": "off",
    "prefer-destructuring": "off",
    "react/destructuring-assignment": "off",
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "react/sort-comp": "off",
    "no-shadow": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/accessible-emoji": "off",
    /* rules above are explicitly disabled */
    "filenames/match-exported": "warn",
    "filenames/no-index": "warn",
    "no-undef": "warn",
    "no-param-reassign": "warn",
    "immutable/no-let": "warn",
    "consistent-return": "warn",
    "react-native/no-unused-styles": "warn",
    "react-native/no-inline-styles": "error",
    "no-console": "error",
    "max-nested-callbacks": [
      "error",
      5
    ],
    "complexity": [
      "error",
      23
    ],
    // target 10
    "max-depth": [
      "error",
      20
    ],
    // target 10
    "max-statements": [
      2,
      23,
      // target 10
      {
        "ignoreTopLevelFunctions": true
      }
    ],
    "max-lines": [
      2,
      {
        "max": 2000,
        // target 500
        "skipBlankLines": true
      }
    ],
    "react/no-unused-prop-types": [
      1,
      {
        "skipShapeProps": true
      }
    ],
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "prefer-promise-reject-errors": "warn",
    "react/no-deprecated": "warn",
    "max-len": [
      "error",
      {
        "code": 300
      }
    ],
    "react/prefer-stateless-function": "warn",
    "react-native/no-color-literals": "warn",
    "react/jsx-props-no-spreading": "warn",
    "react/no-access-state-in-setstate": "warn",
    "react/prop-types": "error",
    "react/default-props-match-prop-types": "warn",
    "react/state-in-constructor": "error",
    "react/no-unused-state": "warn",
    "react-native/split-platform-components": "warn",
    "react-native/no-raw-text": "warn",
    "react/jsx-filename-extension": [
      1,
      {
        "extensions": [
          ".js",
          ".jsx"
        ]
      }
    ],
    "camelcase": "warn",
    "no-return-assign": "error",
    "no-unused-vars": "error",
    "object-curly-newline": [
      "error",
      {
        "ObjectPattern": {
          "multiline": true
        }
      }
    ],
    "react/display-name": "warn",
    "react/jsx-key": "error",
    "max-lines-per-function": [
      2,
      200
      // target 50
    ],
    "jest/no-identical-title": "warn",
    "jest/no-standalone-expect": "warn",
    "jest/valid-expect": "warn",
    "jest/no-try-expect": "warn",
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "MethodDefinition[kind='set']",
        "message": "Property setters are not allowed"
      },
      {
        "selector": "MethodDefinition[kind='get']",
        "message": "Property getters are not allowed"
      }
    ],
    "@scottnonnenberg/thehelp/no-mutation": [
      "warn",
      {
        "exceptions": [
          {
            "object": "this"
          },
          {
            "property": "defaultProps"
          },
          {
            "property": "propTypes"
          }
        ]
      }
    ]
  },
};
