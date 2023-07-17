let user = {
  name: 'Faisal',
  age: '23',
};

const academic = {
  school: 'Police School',
  result: 3.5,
};

user = { ...user, ...academic };
console.log(user);
