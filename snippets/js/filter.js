
/*   基础用法   */

// 筛选条件符合大于10的新数组
const spread = [12, 5, 8, 130, 44];
const filtered = spread.filter(n => n >= 10);
console.log('filtered', filtered); // => [12, 130, 44]


/*   进阶用法   */

// 筛选 age等于40或者age等于24的 数组对象
 const users = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred',   'age': 40, 'active': false },
  { 'user': 'ared',   'age': 24, 'active': false },
  { 'user': 'ered',   'age': 80, 'active': false },
  { 'abc': 'ered',   'age': 80, 'active': false }
];
const filtered = users.filter(n => n.age===40 || n.age===24)
// => [{user: "fred", age: 40, active: false}，{user: "ared", age: 24, active: false}]
console.log('filter后的键名', filtered);


/*   数组去重   */

// 筛选符合条件找到的第一个索引值等于当前索引值的数组
const spread = [12, 5, 8, 8, 130, 44,130];
const filtered = spread.filter((item, idx, arr) => {
  return arr.indexOf(item) === idx;
});
console.log('数组去重结果', filtered);
