const { body } = require('express-validator');

const destinationValidator = [
  body('name').notEmpty().withMessage('Destination name is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('continent')
    .isIn([
      'Africa', 'Antarctica', 'Asia', 'Europe',
      'North America', 'Oceania', 'South America'
    ])
    .withMessage('Invalid continent'),
  body('estimatedCost')
    .isFloat({ min: 0 })
    .withMessage('Estimated cost must be a positive number'),
  body('priority')
    .isInt({ min: 1, max: 5 })
    .withMessage('Priority must be between 1 and 5'),
  body('visited')
    .isBoolean()
    .withMessage('Visited must be true or false'),
];

module.exports = { destinationValidator };