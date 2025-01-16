// Implementations

// Iterative Loop
export function sum_to_n_a(n: number): number {
    let sum = 0;

    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}
// Complexity:
// Time Complexity: O(n) - iterates through all numbers from 1 to n.
// Space Complexity: O(1) 


// Formula (grouped into (N/2) of (N+1))
export function sum_to_n_b(n: number): number {
    if(n < 0) return 0;

    return (n * (n + 1)) / 2;
}
// Complexity:
// Time Complexity: O(1)
// Space Complexity: O(1) 


// Recursive
export function sum_to_n_c(n: number): number {
    if (n <= 0) return 0;

    return n + sum_to_n_c(n - 1);
}
// Complexity:
// Time Complexity: O(n) - The function calls itself recursively n times.
// Space Complexity: O(n) - The call stack grows linearly with n.
