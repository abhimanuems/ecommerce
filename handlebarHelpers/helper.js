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
const { handlebars } = require("hbs");
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
Handlebars.registerHelper("add", function (num1, num2) {
  return num1 + num2;
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


Handlebars.registerHelper("doubleEach", function (context, options) {
  let ret = "";

  if (context && context.length > 0) {
    for (let i = 0; i < context.length; i++) {

      ret += options.fn(context[i]);
    }
  } else {
    ret = options.inverse(this);
  }

  return ret;
});

Handlebars.registerHelper("isFirstIndex", function (index, options) {
  if (index === 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper("calculatePercentage", function (value, base) {
  const percentage = Math.floor(((value - base) / base) * 100);
  return percentage;
});

Handlebars.registerHelper("isDateWithin7Days", function (date) {
  const currentDate = moment();
  const givenDate = moment(date);

  const daysDifference = givenDate.diff(currentDate, "days");

  return daysDifference <= 7;
});

handlebars.registerHelper("inc", function (value) {
  return value + 1;
});

handlebars.registerHelper("equal", function (a, b) {
  return a === b;
});
console.log("eneter here")
handlebars.registerHelper("range", function (start, end, options) {
  const range = [];
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
});