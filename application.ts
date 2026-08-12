function addNumbers(a: number, b: number): number {
  return a + b;
}

// Example usage
const num1 = 5;
const num2 = 10;
const result = addNumbers(num1, num2);
console.log(`The sum of ${num1} and ${num2} is: ${result}`);

/**
 * Alternative Implementation: Class-based Calculator
 * 
 * This implementation uses an object-oriented approach with a Calculator class.
 * Unlike the functional approach above, this encapsulates the addition logic
 * within a class, allowing for potential state management and extensibility.
 */
class Calculator {
  private history: Array<{ operation: string; result: number }> = [];

  /**
   * Adds two numbers and optionally tracks the operation in history
   * @param a - First number
   * @param b - Second number
   * @param trackHistory - Whether to save this operation in history (default: false)
   * @returns The sum of a and b
   */
  add(a: number, b: number, trackHistory: boolean = false): number {
    const result = a + b;
    
    if (trackHistory) {
      this.history.push({
        operation: `${a} + ${b}`,
        result: result
      });
    }
    
    return result;
  }

  /**
   * Gets the calculation history
   * @returns Array of previous calculations
   */
  getHistory(): Array<{ operation: string; result: number }> {
    return [...this.history];
  }

  /**
   * Clears the calculation history
   */
  clearHistory(): void {
    this.history = [];
  }
}

// Example usage of class-based approach
const calculator = new Calculator();
const classResult = calculator.add(5, 10, true);
console.log(`Class-based result: ${classResult}`);

// Demonstrating history tracking feature
calculator.add(15, 25, true);
calculator.add(100, 200, true);
console.log('Calculation history:', calculator.getHistory());

/**
 * Alternative Implementation: Curried Function
 * 
 * This implementation uses functional programming concepts with currying.
 * It returns a function that "remembers" the first argument.
 */
const curriedAdd = (a: number) => (b: number): number => a + b;

// Example usage of curried approach
const addFive = curriedAdd(5);
const curriedResult = addFive(10);
console.log(`Curried result: ${curriedResult}`);

/**
 * Alternative Implementation: Variadic Function
 * 
 * This implementation accepts any number of arguments using rest parameters.
 * Unlike the original which only adds two numbers, this can sum multiple values.
 */
function addMultiple(...numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// Example usage of variadic approach
const variadicResult = addMultiple(5, 10, 15, 20);
console.log(`Variadic result (5 + 10 + 15 + 20): ${variadicResult}`);

/**
 * Alternative Implementation: Object with Methods
 * 
 * This implementation uses a plain object with methods for different operations.
 * Provides a namespace for mathematical operations without class instantiation.
 */
const MathOperations = {
  add: (a: number, b: number): number => a + b,
  subtract: (a: number, b: number): number => a - b,
  multiply: (a: number, b: number): number => a * b,
  divide: (a: number, b: number): number => {
    if (b === 0) throw new Error('Cannot divide by zero');
    return a / b;
  }
} as const;

// Example usage of object-based approach
const objectResult = MathOperations.add(5, 10);
console.log(`Object-based result: ${objectResult}`);

