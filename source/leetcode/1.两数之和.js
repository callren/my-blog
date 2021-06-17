/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

// 最好的方式就是使用hashmap做一个对应的映射，数组遍历一次即可
var twoSum = function(nums, target) {
    let hash = {}
    let result = []
    nums.forEach((item, index) => {
        const n = target - item
        if(hash[n] !== undefined){
            result = [hash[n], index]
        }
        hash[item] = index
    })
    return result
};
// @lc code=end

