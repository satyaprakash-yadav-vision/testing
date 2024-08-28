module.exports = {
  root: true,
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended'
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    /**
     * To Off: Don't prefer default imports over named imports
     */
    'import/prefer-default-export': 'off',
    /**
     * To Off: Allow use of variables with _ in it. Eg, _id of mongodb
     */
    'no-underscore-dangle': 'off',
    /**
     * To Off: Allow use of methods without this in the calls
     */
    'class-methods-use-this': 'off',
    /**
     * To Off: Allow use of continue statement in loop
     */
    'no-continue': 'off',
    /**
     * To Warning: All prettier related error
     */
    'prettier/prettier': 'warn',
    /**
     * To Warning: Redefinition of the variables from the global scope.
     */
    'no-shadow': 'warn',
    /**
     * To Warning: switch to have a default case
     */
    'default-case': 'warn',
    /**
     * To Warning: function arguments reassignment
     */
    'no-param-reassign': 'warn',

    /**
     * To Warning: reduce await in loop to waring rather than error
     */
    'no-await-in-loop': 'warn',

    /**
     * To Off: reduce await in return to waring rather than error
     */
    '@typescript-eslint/return-await': 'off',

    /**
     * To Warning: Un-used variables
     */
    '@typescript-eslint/no-unused-vars': 'warn'
  },

  /**
   * Disable following rules for test files only
   */

  overrides: [
    {
      files: ['tests/**/*.test.ts', 'tests/**/*.ts'],
      rules: {
        /**
         * To Off: No used expression, this is needed for sinon-chai assertions
         * Eg: spy.should.have.been.calledOnce;
         */
        '@typescript-eslint/no-unused-expressions': 'off'
      }
    }
  ]
};
