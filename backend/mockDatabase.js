const bcrypt = require('bcrypt');

const users = [
  {
    fullName: "John Doe",
    idNumber: "1234567890",
    accountNumber: "10001",
    password: bcrypt.hashSync("Password123", 10),
  },
  {
    fullName: "Jane Smith",
    idNumber: "9876543210",
    accountNumber: "10002",
    password: bcrypt.hashSync("securePass456", 10),
  },
];

module.exports = users;