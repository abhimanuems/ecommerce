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

const arr = [1, 1, 2, 2, 2, 3];
let map =new Map()
const length = arr.length;
function findFrequency(arr)
{
    
    for(let i=0;i<length;i++)
    {
        let count = 0;
        for(let j=0;j<length;j++)
        {
            if(arr[i]===arr[j])
            {
                ++count;

            }
        }

        if(arr[i]!=arr[i-1])
      map.set()
    }
}
findFrequency(arr)
console.log(map)