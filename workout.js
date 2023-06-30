// // let grid =[[4,3,2,-1],[3,2,1,-1],[1,1,-1,-2],[-1,-1,-2,-3]];
// let grid =[[3,2],[1,0]]

// let count =0;
// let length =grid.length
// function countNegative(grid)
// {
    

// for(let i=0;i<length;i++)
// {

//     for(let j = grid[i].length - 1;j>=0;j--)
//     {
//         if(grid[i][j]<0)
//         {
//             ++count;
//         }
//         else if (grid[i][j] >0) {
//             break;
//         }
//     }
// }
// return count;
// }
// console.log(countNegative(grid))


// let number =7;
// let temp = number;
// let rem,count=0;

// while(temp>0)
// {
    
//     rem = Math.floor(temp%10);
//     if(number%rem == 0)
//     {
//         ++count;
//     }
  
//     temp=Math.floor(temp/10);
    
// }
// console.log(count)

// let arr = [2,3,4,7,11]
// let starting =1,count=0
// let missingNumber=[]
// let length=5

// function missing(arr)
// {

//     for(let i=0;count<length;i++)
//     {
//         if(arr[i]!=starting)
//         {
//             console.log(arr[i],starting)
           
//             missingNumber.push(starting)
//             count++;
//         }
       
//         starting=arr[i]
        



//     }
// }
// missing(arr)
// console.log(missingNumber)

// console.log("kth misiing number is "+missingNumber[4])

// const arr = [1, 1, 2, 2, 2, 3];
// let map =new Map()
// const length = arr.length;
// function findFrequency(arr)
// {
    
//     for(let i=0;i<length;i++)
//     {
//         let count = 0;
//         for(let j=0;j<length;j++)
//         {
//             if(arr[i]===arr[j])
//             {
//                 ++count;

//             }
//         }

//         if(arr[i]!=arr[i-1])
//       map.set()
//     }
// }
// findFrequency(arr)
// console.log(map)

// let  nums = [5,5 ,5];
// let k = 2;
// let sum =0;
// let index;

// for(let i=0;i<k;i++)
// {

//     let max = Math.max(...nums);
//     index = nums.indexOf(max);
//     nums[index]=nums[index]+1

//     sum+=max;


// }
// console.log(sum)

// let word1 = ["ab", "c"];
// let word2 = ["a", "bc"];
// let check1 = [];
// let check2 = [];


// function check(word, check) {
//     let k = 0;
//   let length = word.length;
//   for (let i = 0; i < length; i++) {
//     for (let j = 0; j < word[i].length; j++) {
//       check[k] = word[i][j];
//       k++;
//     }
//   }
// }

// check(word1, check1);
// check(word2, check2);
// console.log(check1,check2)

// if (check1.join("") === check2.join("")) {
//   console.log(true);
// } else {
//   console.log(false);
// }


// function check(nums)
// {
//   let flag=0;
//   for(let i=0;i<nums.length-1;i++)
// {
//   if(nums[i]>nums[i+1] && flag==0)
//   {
//     nums.splice(i,1);
//     flag=1;
//   }
//    if((nums[i-1] > nums[i] || nums[i]==nums[i+1]|| nums[i] > nums[i+1] ) && flag==1  )
//   {
//     return false
//   }

// }
// return true;
// }

// const nums = [1,2,10,5,7];
// console.log(check(nums));
// console.log(nums)


// var buddyStrings = function (s, goal) {
//   let k = 0;
//   for (let i = 0; i < s.length - 1; i++) {
//     if (s[i] != goal[i]) {

//       [s[i], s[i + 1]] = [s[i + 1], s[i]];
//       k++;
//     }
//   var areEqual = JSON.stringify(s) === JSON.stringify(goal);
//     if (k == 2) {
//       if (areEqual) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//   }
//   if (areEqual) {
//     return true;
//   } else {
//     return false;
//   }
// };

// function generateReferralCode(length) {
//   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   var referralCode = "";

//   for (var i = 0; i < length; i++) {
//     var randomIndex = Math.floor(Math.random() * characters.length);
//     referralCode += characters.charAt(randomIndex);
//   }

//   return referralCode;
// }

// var referralCode = generateReferralCode(8);
// console.log(referralCode);


// let s = ['a','b'];
//  let goal = ['b','a']
//  console.log(buddyStrings(s,goal))
//    console.log(s, goal);

// var numberOfSteps = function (num) {
//   let count = 0;
//   while (num > 0) {
//     console.log(num)
//     if (num % 2 == 0) {
    
//       num /= 2;
//       count++;
//         console.log(num, count);
//     } else {
//       num -= 1;
//       console.log(count)
//       count++;
//     }
//   }
//   return count;
// };
// console.log('count is ',numberOfSteps(14));

// var getNoZeroIntegers = function (n) {
//   let array = [];
//   let num = n;
//   let nums = [];

//   while (n > 0) {
//     array.push((n - 1).toString());
//     console.log(array);
//     if (array.includes("0")) {
//       nums.push(n - 2);
//     } else {
//       nums.push(n-3)
//       console.log(n-1)
      
//     }



//     return nums;
//   }
// };

// console.log(getNoZeroIntegers(10));

const arr1 = [2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19] ;
const arr2 = [2, 1, 4, 3, 9, 6]
let resultArray=[] 
const relativeSortArray = function (arr1, arr2) {

  // arr1.sort((a, b) => a - b);
  for(let i in arr2){
  
    if(arr1.includes(arr2[i])){
      resultArray.push(arr1[i]);
      arr1[i]=null;
    }
  
  }
  console.log(resultArray)
  for(let i in arr1){
      if (arr1[i] != null) {
        resultArray.push(arr1[i]);
      }
  }
  
  return resultArray
};


console.log(relativeSortArray(arr1,arr2));
console.log(resultArray)

