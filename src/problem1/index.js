// A: Iterative
var sum_to_n_a = function(n) {
  let sum = 0;
  if (n >= 0) {
    for (let i = 1; i <= n; i++) sum += i;
  } else {
    for (let i = -1; i >= n; i--) sum += i;
  }
  return sum;
};

// B: Mathematical (Gauss's formula)
var sum_to_n_b = function(n) {
  return (n * (n + 1)) / 2;
};

// C: Recursive
var sum_to_n_c = function(n) {
  if (n === 0) return 0;
  return n > 0
    ? n + sum_to_n_c(n - 1)
    : n + sum_to_n_c(n + 1);
};