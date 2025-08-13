document.addEventListener('DOMContentLoaded', () => {

    // --- UI Elements ---
    const menuScreen = document.getElementById('menu-screen');
    const explanationScreen = document.getElementById('explanation-screen');
    const practiceScreen = document.getElementById('practice-screen');
    const scoreScreen = document.getElementById('score-screen');
    const sutraListDiv = document.getElementById('sutra-list');
    const upSutraListDiv = document.getElementById('up-sutra-list');
    const sutraTitle = document.getElementById('sutra-title');
    const sutraExplanation = document.getElementById('sutra-explanation');
    const sutraExamplesContainer = document.getElementById('sutra-examples-container');
    const sutraExamplesList = document.getElementById('sutra-examples');
    const startPracticeBtn = document.getElementById('start-practice-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const backToExplanationBtn = document.getElementById('back-to-explanation-btn');
    const questionCounter = document.getElementById('question-counter');
    const currentQuestion = document.getElementById('current-question');
    const answerInput = document.getElementById('answer-input');
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const finalScore = document.getElementById('final-score');
    const backFromScoreBtn = document.getElementById('back-from-score-btn');
    const messageBox = document.getElementById('message-box');
    const messageOverlay = document.getElementById('message-overlay');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // --- App State ---
    let currentTopic = null;
    let currentQuestionIndex = 0;
    let score = 0;
    const TOTAL_QUESTIONS = 15;
    
    // --- Sutra & Up-Sutra Data ---
    const topics = {
        sutras: {
            'ekadhiken-purven': {
                name: 'Sutra 1: Ekadhiken Purven',
                explanation: 'This sutra means "One more than the previous one." It\'s a brilliant shortcut for squaring numbers that end in 5. You simply multiply the digit(s) before the 5 by the next consecutive number, and then append 25 to the result. It can also be used for multiplying two numbers whose last digits add up to 10 and the rest of the digits are the same.',
                examples: [
                    {
                        problem: 'Square 35^2',
                        solution: `
                        **Step 1:** The number before the 5 is 3. The next consecutive number is 4.
                        **Step 2:** Multiply these two numbers: 3 x 4 = 12. This is the first part of the answer.
                        **Step 3:** Always append 25 to the result.
                        **Answer:** 1225
                        `
                    },
                    {
                        problem: 'Multiply 43 x 47',
                        solution: `
                        **Step 1:** The last digits (3 and 7) add up to 10. The first digits (4) are the same.
                        **Step 2:** The first digit is 4. The next consecutive number is 5. Multiply them: 4 x 5 = 20.
                        **Step 3:** Multiply the last digits: 3 x 7 = 21.
                        **Step 4:** Combine the results.
                        **Answer:** 2021
                        `
                    },
                    {
                        problem: 'Square 85^2',
                        solution: `
                        **Step 1:** The number before the 5 is 8. The next consecutive number is 9.
                        **Step 2:** Multiply them: 8 x 9 = 72.
                        **Step 3:** Append 25.
                        **Answer:** 7225
                        `
                    }
                ],
                generateQuestion: () => {
                    const method = Math.random() < 0.5 ? 'square' : 'multiply';
                    if (method === 'square') {
                        const n = Math.floor(Math.random() * 90) + 10;
                        const num = Math.floor(n / 10) * 10 + 5;
                        const answer = num * num;
                        return { question: `${num} x ${num}`, answer: answer };
                    } else {
                        const tensDigit = Math.floor(Math.random() * 9) + 1;
                        const unitDigit1 = Math.floor(Math.random() * 9) + 1;
                        const unitDigit2 = 10 - unitDigit1;
                        const num1 = tensDigit * 10 + unitDigit1;
                        const num2 = tensDigit * 10 + unitDigit2;
                        if (num1 === num2) return generateQuestion();
                        const answer = num1 * num2;
                        return { question: `${num1} x ${num2}`, answer: answer };
                    }
                }
            },
            'ek-nyun-purven': {
                name: 'Sutra 2: Ek Nyun Purven',
                explanation: 'This sutra means "One less than the previous one" and is a powerful tool for multiplying any number by a series of nines (like 9, 99, 999, etc.). To solve, you subtract 1 from the number being multiplied, and this gives you the left part of the answer. Then, subtract the left part from the series of nines to get the right part of the answer.',
                examples: [
                    {
                        problem: 'Multiply 54 x 99',
                        solution: `
                        **Step 1:** Subtract 1 from the first number: 54 - 1 = 53. This is the first part of the answer.
                        **Step 2:** Subtract the result from 99: 99 - 53 = 46. This is the second part.
                        **Step 3:** Combine the parts.
                        **Answer:** 5346
                        `
                    },
                    {
                        problem: 'Multiply 123 x 999',
                        solution: `
                        **Step 1:** Subtract 1 from the first number: 123 - 1 = 122.
                        **Step 2:** Subtract the result from 999: 999 - 122 = 877.
                        **Step 3:** Combine the parts.
                        **Answer:** 122877
                        `
                    },
                    {
                        problem: 'Multiply 8 x 9',
                        solution: `
                        **Step 1:** Subtract 1 from the first number: 8 - 1 = 7.
                        **Step 2:** Subtract the result from 9: 9 - 7 = 2.
                        **Step 3:** Combine the parts.
                        **Answer:** 72
                        `
                    }
                ],
                generateQuestion: () => {
                    const numDigits = Math.floor(Math.random() * 2) + 2;
                    const multiplier = parseInt('9'.repeat(numDigits));
                    let multiplicand = Math.floor(Math.random() * (multiplier - 10)) + 10;
                    if (multiplicand >= multiplier) multiplicand = Math.floor(Math.random() * (multiplier - 10)) + 10;
                    const answer = multiplicand * multiplier;
                    return { question: `${multiplicand} x ${multiplier}`, answer: answer };
                }
            },
            'yavdunam': {
                name: 'Sutra 3: Yavdunam',
                explanation: 'This sutra means "By the deficiency." It\'s used for squaring numbers close to a base like 10, 100, or 1000. You find the difference from the base, subtract this difference from the number, and then append the square of the difference to the result. It makes mental calculations quick and easy!',
                examples: [
                    {
                        problem: 'Square 97^2',
                        solution: `
                        **Step 1:** The base is 100. The difference is 100 - 97 = 3.
                        **Step 2:** Subtract the difference from the number: 97 - 3 = 94. This is the left part.
                        **Step 3:** Square the difference: 3^2 = 9. This is the right part. Since the base has two zeros, the right part must have two digits. So, we write it as 09.
                        **Step 4:** Combine the parts.
                        **Answer:** 9409
                        `
                    },
                    {
                        problem: 'Square 8^2',
                        solution: `
                        **Step 1:** The base is 10. The difference is 10 - 8 = 2.
                        **Step 2:** Subtract the difference from the number: 8 - 2 = 6.
                        **Step 3:** Square the difference: 2^2 = 4.
                        **Step 4:** Combine the parts.
                        **Answer:** 64
                        `
                    },
                    {
                        problem: 'Square 994^2',
                        solution: `
                        **Step 1:** The base is 1000. The difference is 1000 - 994 = 6.
                        **Step 2:** Subtract the difference from the number: 994 - 6 = 988.
                        **Step 3:** Square the difference: 6^2 = 36. Since the base has three zeros, the right part must have three digits. So, we write it as 036.
                        **Answer:** 988036
                        `
                    }
                ],
                generateQuestion: () => {
                    const basePower = Math.floor(Math.random() * 2) + 1;
                    const base = Math.pow(10, basePower);
                    const diff = Math.floor(Math.random() * 8) + 1;
                    const num = base - diff;
                    const answer = num * num;
                    return { question: `${num} x ${num}`, answer: answer };
                }
            },
            'urdhva-triyagbhyam': {
                name: 'Sutra 4: Urdhva Tiryagbhyam',
                explanation: 'This translates to "Vertically and Crosswise" and is a powerful general multiplication method. It can be used to multiply any two numbers, regardless of their size. It involves a systematic way of multiplying digits in columns and adding the results, which is much faster than the conventional method.',
                examples: [
                    {
                        problem: 'Multiply 12 x 34',
                        solution: `
                        **Step 1 (Vertical):** Multiply the last digits: 2 x 4 = 8. (Last digit of the answer is 8)
                        **Step 2 (Crosswise):** Cross-multiply and add: (1 x 4) + (2 x 3) = 4 + 6 = 10. (Write down 0, carry over 1)
                        **Step 3 (Vertical):** Multiply the first digits and add the carry: (1 x 3) + 1 = 4. (First digit is 4)
                        **Answer:** 408
                        `
                    },
                    {
                        problem: 'Multiply 21 x 53',
                        solution: `
                        **Step 1:** Multiply last digits: 1 x 3 = 3. (Last digit is 3)
                        **Step 2:** Cross-multiply and add: (2 x 3) + (1 x 5) = 6 + 5 = 11. (Write down 1, carry over 1)
                        **Step 3:** Multiply first digits and add the carry: (2 x 5) + 1 = 11. (First digits are 11)
                        **Answer:** 1113
                        `
                    },
                    {
                        problem: 'Multiply 123 x 456',
                        solution: `
                        **Step 1:** Vertical: 3 x 6 = 18 (8, carry 1)
                        **Step 2:** Crosswise: (2 x 6) + (3 x 5) + 1 = 12 + 15 + 1 = 28 (8, carry 2)
                        **Step 3:** Three-digit crosswise: (1 x 6) + (3 x 4) + (2 x 5) + 2 = 6 + 12 + 10 + 2 = 30 (0, carry 3)
                        **Step 4:** Crosswise: (1 x 5) + (2 x 4) + 3 = 5 + 8 + 3 = 16 (6, carry 1)
                        **Step 5:** Vertical: (1 x 4) + 1 = 5 (5)
                        **Answer:** 56088
                        `
                    }
                ],
                generateQuestion: () => {
                    const num1 = Math.floor(Math.random() * 90) + 10;
                    const num2 = Math.floor(Math.random() * 90) + 10;
                    const answer = num1 * num2;
                    return { question: `${num1} x ${num2}`, answer: answer };
                }
            },
            'sunyam-samyasamuccaye': {
                name: 'Sutra 5: Sunyam Samyasamuccaye',
                explanation: 'This sutra means "When the sum is the same, that sum is zero." It\'s a quick way to solve certain types of linear equations. For example, if two expressions are equal and they both contain the same term, that term can be equated to zero to find the value of the variable.',
                examples: [
                    {
                        problem: 'Solve for x: 5x + 3 = 5x + 9',
                        solution: `
                        **Step 1:** Notice that the term 5x is the same on both sides of the equation.
                        **Step 2:** The sutra tells us that when a common term exists, we can look at the other numbers. The other terms are 3 and 9. If they were the same, 5x+3=5x+3, any x would be a solution. However, since the sums on both sides are not the same, there is no solution.
                        `
                    },
                    {
                        problem: 'Solve for x: (x+7) (x+9) = (x+5) (x+12)',
                        solution: `
                        **Step 1:** The terms in the parentheses are of the form (x+a) and (x+b). The sutra can be applied if the sum of the constant terms on both sides is equal.
                        **Step 2:** On the left side, the sum is 7 + 9 = 16. On the right side, the sum is 5 + 12 = 17. The sums are not equal, so there is no simple solution using this sutra. Let's create a new example where the sum is the same.
                        `
                    },
                    {
                        problem: 'Solve for x: (x+7) (x+9) = (x+5) (x+11)',
                        solution: `
                        **Step 1:** The sums of the constant terms are 7+9=16 and 5+11=16. Since the sums are the same, the sutra applies.
                        **Step 2:** The sutra states that if the sum is the same, that sum is zero. In this context, it implies that the variable is zero.
                        **Answer:** x=0
                        `
                    }
                ],
                generateQuestion: () => {
                    const a = Math.floor(Math.random() * 10) + 1;
                    const b = Math.floor(Math.random() * 10) + 1;
                    const x = Math.floor(Math.random() * 5) + 1;
                    const eqn1 = `${a}x + ${b}`;
                    const eqn2 = `${a}x + ${x + b}`;
                    const answer = -x;
                    return { question: `Solve for x: ${eqn1} = ${eqn2}`, answer: answer };
                }
            },
            'nikhilam-navtam-charmam-dashtah': {
                name: 'Sutra 6: Nikhilam Navtam Charmam Dashtah',
                explanation: 'This translates to "All from 9 and the last from 10." This method is fantastic for multiplication, especially when the numbers are close to a base like 10, 100, or 1000. You find the difference of each number from the base. Then, you cross-add or subtract the differences to get the first part of the answer and multiply the differences to get the second part.',
                examples: [
                    {
                        problem: 'Multiply 8 x 7',
                        solution: `
                        **Step 1:** The base is 10. The numbers are 2 and 3 less than 10.
                        **Step 2:** Left part of answer: cross-subtract. (8 - 3) = 5 or (7 - 2) = 5.
                        **Step 3:** Right part of answer: multiply the deficiencies. 2 x 3 = 6.
                        **Step 4:** Combine the parts.
                        **Answer:** 56
                        `
                    },
                    {
                        problem: 'Multiply 96 x 98',
                        solution: `
                        **Step 1:** The base is 100. The deficiencies are 100 - 96 = 4 and 100 - 98 = 2.
                        **Step 2:** Left part: cross-subtract. 96 - 2 = 94 or 98 - 4 = 94.
                        **Step 3:** Right part: multiply the deficiencies. 4 x 2 = 8. Since the base has two zeros, the right part needs two digits, so we write it as 08.
                        **Answer:** 9408
                        `
                    },
                    {
                        problem: 'Multiply 104 x 107',
                        solution: `
                        **Step 1:** The base is 100. The surpluses are 104 - 100 = 4 and 107 - 100 = 7.
                        **Step 2:** Left part: cross-add. 104 + 7 = 111 or 107 + 4 = 111.
                        **Step 3:** Right part: multiply the surpluses. 4 x 7 = 28.
                        **Step 4:** Combine the parts.
                        **Answer:** 11128
                        `
                    }
                ],
                generateQuestion: () => {
                    const basePower = Math.floor(Math.random() * 2) + 1;
                    const base = Math.pow(10, basePower);
                    const diff1 = Math.floor(Math.random() * 5) + 1;
                    const diff2 = Math.floor(Math.random() * 5) + 1;
                    const num1 = base - diff1;
                    const num2 = base - diff2;
                    const answer = num1 * num2;
                    return { question: `${num1} x ${num2}`, answer: answer };
                }
            },
            'paraavartya-yojayet': {
                name: 'Sutra 7: Paravartya Yojayet',
                explanation: 'This sutra means "Transpose and Adjust" and is a powerful division method. It is similar to the Nikhilam method but is used when the divisor is larger than the base (e.g., dividing by 112 with a base of 100). The process involves transposing the digits of the divisor and then making adjustments.',
                examples: [],
                canPractice: false
            },
            'sankalana-vyavakalanabhyam': {
                name: 'Sutra 8: Sankalana Vyavakalanabhyam',
                explanation: 'This sutra means "By addition and by subtraction." It is primarily used to solve simultaneous linear equations. It leverages the idea of adding and subtracting equations to eliminate variables, making the process faster and more intuitive.',
                examples: [],
                canPractice: false
            },
            'purana-apuranabhyam': {
                name: 'Sutra 9: Purana Apuranabhyam',
                explanation: 'This sutra means "By completion or non-completion" and is useful for solving specific algebraic equations. It is often applied to problems that can be easily simplified by completing a square or a binomial expansion.',
                examples: [],
                canPractice: false
            },
            'chalana-kalanabhyam': {
                name: 'Sutra 10: Chalana Kalanabhyam',
                explanation: 'This sutra means "Calculus" and is used in a more advanced context. In Vedic Math, it pertains to the differentiation and integration of algebraic expressions, offering a simpler way to perform these operations.',
                examples: [],
                canPractice: false
            },
            'yadunam-tadunam-krutva': {
                name: 'Sutra 11: Yadunam Tadunam Krutva',
                explanation: 'This is a corollary of the Yavdunam sutra. It means "The remainder and the remainder." It is another way to perform squaring of numbers near a base.',
                examples: [],
                canPractice: false
            },
            'antyayor-dashakah': {
                name: 'Sutra 12: Antyayor Dashakah',
                explanation: 'This sutra means "The last digits sum to 10." It is a special case of Ekadhiken Purven for multiplication, applied when the last digits of two numbers add up to 10.',
                examples: [],
                canPractice: false
            },
            'vyasti-samashti': {
                name: 'Sutra 13: Vyasti Samashti',
                explanation: 'This sutra means "Separation and combination" and is used in multiplication and division. It allows for the simplification of complex calculations by breaking a problem down into smaller, more manageable parts, solving them, and then combining the results.',
                examples: [],
                canPractice: false
            },
            'seshanyankena-charamena': {
                name: 'Sutra 14: Seshanyankena Charamena',
                explanation: 'This sutra means "The remainders by the last digit." It is a method for division that involves using the last digit of the divisor to simplify the process. It is an advanced technique for long division.',
                examples: [],
                canPractice: false
            },
            'lopa-sthapana': {
                name: 'Sutra 15: Lopa Sthapana',
                explanation: 'This sutra means "By alternate elimination and retention." It is a technique for solving algebraic equations and can be used to find the roots of a polynomial equation by a systematic trial and error process.',
                examples: [],
                canPractice: false
            },
            'vilokanam': {
                name: 'Sutra 16: Vilokanam',
                explanation: 'This sutra means "By mere observation." It is a principle that teaches us to look at a problem and, in some cases, determine the answer immediately without any calculation. This comes with practice and understanding of the patterns in Vedic Math.',
                examples: [],
                canPractice: false
            }
        },
        upSutras: {
            'anurupyea': {
                name: 'Up-Sutra 1: Anurupyea',
                explanation: 'This up-sutra means "Proportionately." It is a corollary of the Urdhva Tiryagbhyam sutra and is used for multiplication of numbers that are in a certain proportion to each other.',
                examples: [],
                canPractice: false
            },
            'sistam-sesam-sanjna': {
                name: 'Up-Sutra 2: Sistam Sesam Sanjna',
                explanation: 'This means "The remainders by the remainder." This up-sutra helps in finding the remainder in certain division problems.',
                examples: [],
                canPractice: false
            },
            'adyam-adyena': {
                name: 'Up-Sutra 3: Adyam Adyena',
                explanation: 'This means "The first by the first" and is used in division. It simplifies the division process by dealing with the first digits of the dividend and divisor.',
                examples: [],
                canPractice: false
            },
            'antyayoreva': {
                name: 'Up-Sutra 4: Antyayoreva',
                explanation: 'This means "Only the last." This up-sutra is a quick method for finding the last digit of certain mathematical operations.',
                examples: [],
                canPractice: false
            },
            'keshava': {
                name: 'Up-Sutra 5: Keshava',
                explanation: 'This up-sutra is used for certain types of division and is related to the idea of division by a divisor ending in 9.',
                examples: [],
                canPractice: false
            },
            'antya-ekadasha': {
                name: 'Up-Sutra 6: Antya Ekadasha',
                explanation: 'This means "The last by 11." This up-sutra is a special case for multiplication of numbers where the last digits add up to 11.',
                examples: [],
                canPractice: false
            },
            'lopana-sthapana': {
                name: 'Up-Sutra 7: Lopana Sthapana',
                explanation: 'This means "Alternate elimination and retention." It is a technique for solving equations by systematically eliminating and retaining terms to find the solution.',
                examples: [],
                canPractice: false
            },
            'gunita-samuchchayah': {
                name: 'Up-Sutra 8: Gunita Samuchchayah',
                explanation: 'This means "The sum of the products is the product of the sums." It is a fundamental checking method in Vedic Math to verify the accuracy of a calculation.',
                examples: [],
                canPractice: false
            },
            'adyam-madhyam-antyam': {
                name: 'Up-Sutra 9: Adyam Madhyam Antyam',
                explanation: 'This means "The first, the middle, and the last." This up-sutra is used for complex division and involves a systematic approach to dividing large numbers.',
                examples: [],
                canPractice: false
            },
            'vyasthanam': {
                name: 'Up-Sutra 10: Vyasthanam',
                explanation: 'This means "By arrangement." It is a method used for solving certain types of algebraic equations by rearranging the terms.',
                examples: [],
                canPractice: false
            },
            'ekadhikena': {
                name: 'Up-Sutra 11: Ekadhikena',
                explanation: 'This is a specific form of the Ekadhiken Purven sutra. It means "By one more than." It is used for multiplying numbers where the sum of the digits in one part is equal to the sum of the digits in the other part.',
                examples: [],
                canPractice: false
            },
            'antyayor-dashakah': {
                name: 'Up-Sutra 12: Antyayor Dashakah',
                explanation: 'This is another form of the Ekadhiken Purven sutra. It means "The last digits sum to 10." It is a quick method for multiplication where the last digits of the numbers add up to 10.',
                examples: [],
                canPractice: false
            },
            'seshanyankena': {
                name: 'Up-Sutra 13: Seshanyankena',
                explanation: 'This means "The remainders by the remainder." It is a more advanced technique for division, especially with large numbers, and is related to the idea of finding remainders.',
                examples: [],
                canPractice: false
            }
        }
    };

    // --- Core Functions ---
    const showScreen = (screenId) => {
        const screens = [menuScreen, explanationScreen, practiceScreen, scoreScreen];
        screens.forEach(screen => screen.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
    };

    const showMessage = (message) => {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
        messageOverlay.style.display = 'block';
    };

    const hideMessage = () => {
        messageBox.style.display = 'none';
        messageOverlay.style.display = 'none';
    };
    
    const renderTopicList = (listDiv, topicsData) => {
        listDiv.innerHTML = '';
        for (const key in topicsData) {
            const topic = topicsData[key];
            const div = document.createElement('div');
            div.className = 'flex flex-col sm:flex-row items-center sm:items-start justify-between p-4 bg-gray-50 rounded-xl shadow-inner';
            div.innerHTML = `
                <p class="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">${topic.name}</p>
                <button class="btn" data-topic-id="${key}">${topic.canPractice === false ? 'Learn' : 'Learn & Practice'}</button>
            `;
            listDiv.appendChild(div);
        }
    };

    const handleLearnButtonClick = (e) => {
        const topicId = e.target.getAttribute('data-topic-id');
        const isSutra = topics.sutras.hasOwnProperty(topicId);
        let topicData = isSutra ? topics.sutras[topicId] : topics.upSutras[topicId];
        
        if (topicData) {
            currentTopic = topicData;
            sutraTitle.textContent = currentTopic.name;
            sutraExplanation.innerHTML = currentTopic.explanation;
            
            sutraExamplesList.innerHTML = '';
            if (currentTopic.examples && currentTopic.examples.length > 0) {
                sutraExamplesContainer.classList.remove('hidden');
                currentTopic.examples.forEach(example => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>Problem:</strong> ${example.problem}<br><p>${example.solution}</p>`;
                    sutraExamplesList.appendChild(li);
                });
            } else {
                sutraExamplesContainer.classList.add('hidden');
            }

            if (currentTopic.canPractice === false) {
                startPracticeBtn.style.display = 'none';
                showMessage(`Practice questions for "${currentTopic.name}" are not yet available. But you can still learn about it!`);
            } else {
                startPracticeBtn.style.display = 'inline-block';
            }

            showScreen('explanation-screen');
        }
    };

    const startPractice = () => {
        score = 0;
        currentQuestionIndex = 0;
        showScreen('practice-screen');
        generateAndDisplayQuestion();
        answerInput.focus();
    };

    const generateAndDisplayQuestion = () => {
        if (currentQuestionIndex < TOTAL_QUESTIONS) {
            const { question, answer } = currentTopic.generateQuestion();
            currentQuestion.textContent = question;
            currentQuestion.dataset.answer = answer; // Store the answer
            answerInput.value = '';
            questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
        } else {
            showScore();
        }
    };

    const checkAnswer = () => {
        const userAnswer = parseInt(answerInput.value, 10);
        const correctAnswer = parseInt(currentQuestion.dataset.answer, 10);
        if (userAnswer === correctAnswer) {
            score++;
            showMessage('Correct! 🎉');
        } else {
            showMessage(`Oops, that's not quite right. The correct answer was ${correctAnswer}.`);
        }
        currentQuestionIndex++;
    };

    const showScore = () => {
        showScreen('score-screen');
        finalScore.textContent = `You got ${score} out of ${TOTAL_QUESTIONS} questions correct!`;
    };

    // --- Event Listeners ---
    sutraListDiv.addEventListener('click', handleLearnButtonClick);
    upSutraListDiv.addEventListener('click', handleLearnButtonClick);
    startPracticeBtn.addEventListener('click', startPractice);
    backToMenuBtn.addEventListener('click', () => showScreen('menu-screen'));
    backToExplanationBtn.addEventListener('click', () => showScreen('explanation-screen'));
    backFromScoreBtn.addEventListener('click', () => showScreen('menu-screen'));

    checkAnswerBtn.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    closeMessageBtn.addEventListener('click', () => {
        hideMessage();
        if (currentQuestionIndex < TOTAL_QUESTIONS && startPracticeBtn.style.display !== 'none') {
            generateAndDisplayQuestion();
            answerInput.focus();
        } else if (currentQuestionIndex >= TOTAL_QUESTIONS) {
            showScore();
        }
    });

    // Initial rendering
    renderTopicList(sutraListDiv, topics.sutras);
    renderTopicList(upSutraListDiv, topics.upSutras);
    showScreen('menu-screen');
});