const {sum_to_n_a, sum_to_n_b, sum_to_n_c} = require('./sum_to_n')

// Test Data
const testCases = [
    { input: -10, expected: 0 },
    { input: -1, expected: 0 },
    { input: 0, expected: 0 },
    { input: 1, expected: 1 },
    { input: 5, expected: 15 },
    { input: 10, expected: 55 },
    { input: 50, expected: 1275 },
    { input: 100, expected: 5050 },
];

// Test Suite
function runTests() {
    console.log("Running Test Suite...\n");

    testCases.forEach(({ input, expected }, index) => {
        console.log(`\nTest Case ${index + 1}: n = ${input}`);

        const resultA = sum_to_n_a(input);
        const resultB = sum_to_n_b(input);
        const resultC = sum_to_n_c(input);

        console.log(`  Iterative Result: ${resultA} ${resultA === expected ? "passed" : "failed"}`);
        console.log(`  Formula Result: ${resultB} ${resultB === expected ? "passed" : "failed"}`);
        console.log(`  Recursive Result: ${resultC} ${resultC === expected ? "passed" : "failed"}`);
    });

    console.log("Test Suite Completed.");
}

// Run Tests Instantly
runTests();
