class salesUtility {
   constructor() { }

   arrayToObject(arr) {
      var rv = {};
      for (var i of arr)
         rv[i._id] = i.sales;
      return rv;
   }

   monthDateToMonth(monthNumber) {
      let months = ['January',
         'February',
         'March',
         'April',
         'May',
         'June',
         'July',
         'August',
         'September',
         'October',
         'November',
         'December']
      return months[monthNumber - 1];
   }

   pullGroupToObjectKey(mongoArray) {
      let newObj = {};
      for (let i of mongoArray) {
         let grouping = i._id.group
         if (!newObj[grouping]) {
            newObj[grouping] = [];
            newObj[grouping].push({
               sales: i.sales,
               month: this.monthDateToMonth(i._id.month)
            })
         } else
            newObj[grouping].push({
               sales: i.sales,
               month: this.monthDateToMonth(i._id.month)
            })
      }
      return newObj
   }
}

module.exports = new salesUtility();