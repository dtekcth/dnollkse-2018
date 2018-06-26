module.exports = {
  useRelativePaths: false,
  importStatementFormatter({ importStatement }) {
    return importStatement.replace(/'/g, "\"");
  }
};
