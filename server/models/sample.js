// {
//  firstname: { type: String, required: true },
//  lastname: { type: String, optional: true  },
//  email: { type: String, validate: 'isEmail', required: true },
//  password: { type: String, read: false, required: true },
//  createdOn: { type: String, default: gstore.defaultValues.NOW, write: false, read: false },
//  dateOfBirth: { type: Date },
//  bio: { type: String, excludeFromIndexes: true },
//  website: { validate: 'isURL', optional: true }
// }