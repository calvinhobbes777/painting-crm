const field = (name, type, entity, values = [], size = 25) => ({
  name,
  type,
  entity,
  values,
  size,
  static: true
});

const user = [
  field("First Name", "TEXT", "USER", [], 50),
  field("Last Name", "TEXT", "USER", [], 50),
  field("Street Address", "TEXT", "USER", [], 30),
  field("City", "TEXT", "USER", [], 30),
  field("State", "TEXT", "USER", [], 20),
  field("Zip Code", "NUMBER", "USER", [], 20)
];

const customer = [
  field("Company", "TEXT", "CUSTOMER", [], 40),
  field("First Name", "TEXT", "CUSTOMER", [], 30),
  field("Last Name", "TEXT", "CUSTOMER", [], 30),
  field("Street Address", "TEXT", "CUSTOMER", [], 30),
  field("City", "TEXT", "CUSTOMER", [], 30),
  field("State", "TEXT", "CUSTOMER", [], 20),
  field("Zip Code", "NUMBER", "CUSTOMER", [], 20)
];

const job = [
  field("Title", "TEXT", "JOB", [], 50),
  field(
    "Type",
    "SELECT",
    "JOB",
    ["Residential", "Commerical", "Automotive", "Industrial"],
    25
  ),
  field(
    "Status",
    "SELECT",
    "JOB",
    [
      "Estimated",
      "Materials Ordered",
      "In Progress",
      "Quality Check",
      "Complete"
    ],
    25
  ),
  field("Street Address", "TEXT", "JOB", [], 30),
  field("City", "TEXT", "JOB", [], 30),
  field("State", "TEXT", "JOB", [], 20),
  field("Zip Code", "NUMBER", "JOB", [], 20)
];

const task = [
  field("Title", "TEXT", "TASK", [], 40),
  field(
    "Type",
    "SELECT",
    "TASK",
    ["Task", "Appointment", "Meetings", "Phone Call"],
    20
  ),
  field(
    "Priority",
    "SELECT",
    "TASK",
    ["Low", "Medium", "High", "Critical"],
    20
  ),
  field("Due Date", "DATE", "TASK", [], 20),
  field("Notes", "LONGTEXT", "TASK", [], 50),
  field("Description", "LONGTEXT", "TASK", [], 50)
];

module.exports = { user, task, job, customer };
