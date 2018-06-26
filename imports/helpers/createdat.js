export function schemaCreatedAt() {
  return {
    type: Date,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
      else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      else {
        this.unset(); // Prevent user from supplying their own value
      }
    }
  };
}

