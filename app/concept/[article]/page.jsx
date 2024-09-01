import { notFound } from 'next/navigation';

const mockConcepts = {
  'python-fundamentals-syntax-and-variables': {
    title: 'Syntax and Variables In Python',
    content: `Syntax and Variables in Python

    Python is a high-level programming language renowned for its simplicity and readability. Understanding its syntax and variables is fundamental for anyone starting out with Python.
    
    **Syntax in Python**
    
    Syntax refers to the set of rules that define the combinations of symbols considered to be correctly structured programs in Python. The language’s syntax is designed to be intuitive, making it easier for beginners to learn. 
    
    Python uses indentation to define the structure of the code. Unlike many other programming languages that use braces or keywords, Python uses white space to delimit blocks of code. For example, in a function definition or a conditional statement, the body of the code is indented. This makes Python visually clear and easy to follow.
    
    Another important aspect of Python syntax is its use of colons to indicate the beginning of an indented block. For example, after a function definition or an if statement, a colon is used before the indented code block.
    
    **Variables in Python**
    
    Variables are used to store data that can be referenced and manipulated throughout a program. In Python, variables are created when you assign a value to them. There is no need to declare a variable before assigning it a value, which is a feature that simplifies coding in Python.
    
    To assign a value to a variable, you use the equals sign (\`=\`). For example, \`x = 5\` assigns the value 5 to the variable \`x\`. Variables do not need explicit type declaration because Python is dynamically typed; the type of a variable is inferred from the value assigned to it.
    
    Python supports various types of variables, including integers, floating-point numbers, strings, and lists. Each type of variable can be used to store different kinds of data. For example, \`name = "Alice"\` assigns a string value to the variable \`name\`, while \`age = 30\` assigns an integer value to the variable \`age\`.
    
    In summary, Python’s syntax is designed for readability and simplicity, using indentation and colons to structure code. Variables in Python are dynamically typed, allowing for flexible and intuitive coding. Understanding these basics is crucial for anyone looking to write effective Python code.`
  },
  'python-fundamentals-data-types': {
    title: 'Data Types In Python',
    content: `Python supports several data types, including integers (int), floating-point numbers (float), strings (str), and lists (list). Each type serves a different purpose: integers for whole numbers, floats for decimals, strings for text, and lists for ordered collections. Python's dynamic typing system means variables can change types as needed.`
  },

};

export default function ConceptPage({ params }) {
  const { article } = params;
  const concept = mockConcepts[article];

  if (!concept) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{concept.title}</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <p className="text-gray-700 dark:text-gray-300">{concept.content}</p>
      </div>
    </div>
  );
}