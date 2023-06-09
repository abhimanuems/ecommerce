// // const Handlebars = require("handlebars");
// // const moment = require("moment");

// // Handlebars.registerHelper("notLessThan", function (a, b, options) {
// //   if (!(a < b)) {
// //     return options.fn(this);
// //   } else {
// //     return options.inverse(this);
// //   }
// // });

// //   Handlebars.registerHelper("nestedEach", function (arr1, arr2, options) {
// //     let result = "";
// //     for (let i = 0; i < arr1.length; i++) {
// //       result += options.fn({ product: arr1[i], count: arr2[i] });
// //     }
// //     return result;
// //   });

// //   Handlebars.registerHelper("nestedEach", function (arr1, arr2, options) {
// //     let result = "";
// //     for (let i = 0; i < arr1.length; i++) {
// //       result += options.fn({ product: arr1[i], order: arr2[i] });
// //     }
// //     return result;
// //   });
// //   Handlebars.registerHelper("subtract", function (num1, num2) {
// //     return num1 - num2;
// //   });

// // Handlebars.registerHelper('compareValues', function(value1, value2, options) {
// //   if (value1 == value2) {
// //     return options.fn(this);
// //   }
// //   return options.inverse(this);
// // });

// // Handlebars.registerHelper("formatDate", function (date) {

// //   return moment(date).format("MMMM Do YYYY");
// // });

// const Handlebars = require("handlebars");
// const moment = require("moment");

// Handlebars.registerHelper("notLessThan", function (a, b, options) {
//   if (!(a < b)) {
//     return options.fn(this);
//   } else {
//     return options.inverse(this);
//   }
// });

// Handlebars.registerHelper("nestedEach", function (arr1, arr2, options) {
//   let result = "";
//   for (let i = 0; i < arr1.length; i++) {
//     result += options.fn({ product: arr1[i], count: arr2[i] });
//   }
//   return result;
// });

// Handlebars.registerHelper("subtract", function (num1, num2) {
//   return num1 - num2;
// });

// Handlebars.registerHelper("compareValues", function (value1, value2, options) {
//   if (value1 == value2) {
//     return options.fn(this);
//   }
//   return options.inverse(this);
// });

// Handlebars.registerHelper("formatDate", function (date) {
//   return moment(date).format("MMMM Do YYYY");
// });

// Handlebars.registerHelper("multiply", function (num1, num2) {
//   return num1 * num2;
// });

// Handlebars.registerHelper("add", function (num1, num2) {
//   return num1 + num2;
// });

// Handlebars.registerHelper("nestedEach", function (arr1, arr2, options) {
//     let result = "";
//     for (let i = 0; i < arr1.length; i++) {
//       result += options.fn({ product: arr1[i], orders: arr2[i] });
//     }
//     return result;
//   });

//   Handlebars.registerHelper("ifEqual", function (arg1, arg2, options) {
//     if (arg1 == arg2) {
//       return options.fn(this);
//     } else {
//       return options.inverse(this);
//     }
//   });


// Handlebars.registerHelper('greaterThan', function(a, b, options) {
//   if (a >= b) {
//     return options.fn(this);
//   } else {
//     return options.inverse(this);
//   }
// });

const Handlebars = require("handlebars");
const moment = require("moment");

Handlebars.registerHelper("notLessThan", function (a, b, options) {
  if (!(a < b)) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper("nestedEach", function (arr1, arr2, options) {
  let result = "";
  for (let i = 0; i < arr1.length; i++) {
    result += options.fn({ product: arr1[i], count: arr2[i] });
  }
  return result;
});

Handlebars.registerHelper("subtract", function (num1, num2) {
  return num1 - num2;
});

Handlebars.registerHelper("compareValues", function (value1, value2, options) {
  if (value1 == value2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("formatDate", function (date) {
  return moment(date).format("MMMM Do YYYY");
});

Handlebars.registerHelper("multiply", function (num1, num2) {
  return num1 * num2;
});

Handlebars.registerHelper("add", function (num1, num2) {
  return num1 + num2;
});

Handlebars.registerHelper("nestedEach", function (arr1, arr2, options) {
  let result = "";
  for (let i = 0; i < arr2.length; i++) {
    const count = arr2[i];
    result += options.fn({ product: arr1[i], count });
  }
  return result;
});




Handlebars.registerHelper("ifEqual", function (arg1, arg2, options) {
  if (arg1 == arg2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper("greaterThan", function (a, b, options) {
  if (a >= b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});
