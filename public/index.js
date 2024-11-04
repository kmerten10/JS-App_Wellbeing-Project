//CREATE VARIABLES: Creates a variable for an array of objects, each containing a string property and an array of strings.
    const questions = [
        { question: "Did you eat breakfast?", options: ["yes", "no", "Idk"], points: { yes: 7, no: 0, Idk: -5 }},
        { question: "Did you eat lunch?", options: ["yes", "no", "Idk"], points: { yes: 7, no: 0, Idk: -5 }},
        { question: "Did you eat dinner?", options: ["yes", "no", "Idk"], points: { yes: 7, no: 0, Idk: -5 }},
        { question: "Did you drink water?", input: true, inputs: 2, type: "water"},
        { question: "Amount of protein today?", input: true, inputs: 2, type: "protein"},
        { question: "Did you exercise?", options: ["yes", "no"], points: { yes: 5, no: 0 }},
        { question: "Did you go outside?", options: ["yes", "no"], points: { yes: 5, no: 0 }},
        { question: "Did you feel grateful today?", options: ["yes", "no"], points: { yes: 5, no: 0 }},
        { question: "Did you accomplish or <br> maintain a goal?", options: ["yes", "no"], points: { yes: 5, no: 0 }},
        { question: "Rate your day 1 - 10?", input: true, inputs: 1, type: "rating"},
    ];

    // CREATES a variable to track the index of the current question, initialized to 0.
    let currentQuestionIndex = 0;
    // INITIALIZES score
    let totalScore = 0;

    // CRETAES variables that reference DOM elements for displaying questions and handling user interaction.
    const questionContainer = document.getElementById('question-container');
    const nextButton = document.getElementById('next-button');

// DISPLAYS QUESTION FUNCTION: Creates a function to display the current question, using the current index to retrieve the question and dynamically maps its options or input to the DOM.
    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <div>${currentQuestion.question}</div>
                <div>
                ${currentQuestion.inputs === 2 && currentQuestion.type === "water" ?
                        `<input class="text-box" type="number" name="water" placeholder="Enter ounces" min="0" step="1">
                        <input class="text-box" type="number" name="weight" placeholder="Enter weight (lbs)" min="0" step="0.1">` :
                    currentQuestion.inputs === 2 && currentQuestion.type === "protein" ?
                        `<input class="text-box" type="number" name="protein" placeholder="Enter grams" min="0" step="0.1">
                        <input class="text-box" type="number" name="weight" placeholder="Enter weight (lbs)" min="0" step="0.1">` :
                    currentQuestion.inputs === 1 && currentQuestion.type === "rating" ?
                    `<input class="text-box" type="number" name="rating" placeholder="Enter rating" min="0" step="0.1">` :
                    (currentQuestion.options && Array.isArray(currentQuestion.options) ?
                        currentQuestion.options.map(option => `<label class="option-label"><input type="radio" name="answer" value="${option}">${option}</label>`).join('') :
                        '')}
                </div>
                `;
    }
// Function to submit the score to the server
function submitScore() {
    fetch('/save-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: totalScore })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Optionally, display a success message to the user
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

//CREATES BUTTON: Uses an event listener FUNCTION to create the nextButton with logic when clicked. 
    nextButton.addEventListener('click', () => {
        // If an answer is selected, it logs the current question and selected answer to the console. 
        const currentQuestion = questions[currentQuestionIndex];

        const waterInput = currentQuestion.type === "water" ? document.querySelector('input[name="water"]') : null;
        const weightInput = currentQuestion.inputs === 2 ? document.querySelector('input[name="weight"]') : null;
        const proteinInput = currentQuestion.type === "protein" ? document.querySelector('input[name="protein"]') : null;


    //"WATER INTAKE" INPUT QUESTION LOGIC
        if (currentQuestion.type === "water") {
        //INITIALIZE VARIABLES to calculate weight points values
            const weight = weightInput.value;
            const water = waterInput.value;
            const waterIntake = weight * 0.67;

            let pointsEarned = 10;

            //CALCULATION FOR WATER INTAKE
                if (water < waterIntake) {
                    const difference = waterIntake - water;
                    const percentageDeviation = (difference / waterIntake) * 100;

                    const deduction = Math.floor(percentageDeviation / 10);
                    pointsEarned = Math.max(0,pointsEarned - deduction);
                }
                //VALIDATES INPUT LOGIC
                totalScore += pointsEarned;

                console.log(`Question: ${currentQuestion.question}, Water: ${waterInput.value}, Weight: ${weightInput.value}, Points: ${pointsEarned}, Total: ${totalScore}`);
                

                //If no response
                if (!waterInput.value || !weightInput.value) {
                    alert("Please enter a number.");
                        if (!waterInput.value) {
                            waterInput.focus(); // Adds focus for user
                            } else {
                            weightInput.focus(); // Adds focus for user
                        }
                        return; // EXIT - Prevent advancing to the next question
            }

        }

//"PROTEIN INTAKE" INPUT QUESTION LOGIC
if (proteinInput) {
    //INITIALIZE VARIABLES to calculate weight points values
        const weight = weightInput.value;
        const protein = proteinInput.value;
        const proteinIntake = weight * 0.36;

        let pointsEarned = 10;

        //CALCULATION FOR PROTEIN INTAKE
            if (protein < proteinIntake) {
                const difference = proteinIntake - protein;
                const percentageDeviation = (difference / proteinIntake) * 100;

                const deduction = Math.floor(percentageDeviation / 10);
                pointsEarned = Math.max(0,pointsEarned - deduction);
            }
            //VALIDATES INPUT LOGIC
            totalScore += pointsEarned;
            console.log(`Question: ${currentQuestion.question}, Protein: ${proteinInput.value}, Weight: ${weightInput.value}, Points: ${pointsEarned},Total: ${totalScore}`);

            //If no response
            if (!proteinInput.value || !weightInput.value) {
                alert("Please enter a number.");
                    if (!proteinInput.value) {
                        proteinInput.focus(); // Adds focus for user
                        } else {
                        weightInput.focus(); // Adds focus for user
                    }
                    return; // EXIT - Prevent advancing to the next question
        }

    }

    //RADIO BUTTON LOGIC
            if (currentQuestion.options) {
            const selectedOption = document.querySelector('input[name="answer"]:checked');

                if (!selectedOption) {
                    alert("Please select an answer.");
                    return;
                    }                
                    //UPDATES SCORE based on response
                    const pointsEarned = currentQuestion.points[selectedOption.value]
                    totalScore += pointsEarned;
                    console.log(`Question: ${currentQuestion.question}, Answer: ${selectedOption.value}, Points: ${pointsEarned}, Total: ${totalScore}`);

                }

    //RATING QUESTION LOGIC
             else if (currentQuestion.type === 'rating') {
             const ratingInput = document.querySelector('input[name="rating"]');
             const rating = parseInt(ratingInput.value, 10);

                if (isNaN(rating) || rating < 1 || rating >10) {
                    alert("Please enter rating 1 - 10.");
                    return;
                     }

                //UPDATES SCORE based on response
                totalScore += rating;
                console.log(`Question: ${currentQuestion.question}, Rating: ${rating}, Total: ${totalScore}`);
            }

    //INDEXING THRU QUESTIONS: If the current question index is less than the length of the questions array, the next question will be displayed. 
            currentQuestionIndex++;

            if (currentQuestionIndex < questions.length) {
                displayQuestion();

            // END OF QUESTIONAIRE RESPONSE
            } else {
                questionContainer.innerHTML = `<div>Your score is:</div><div class="score">${totalScore}</div><div class="tomorrow">See you tomorrow!</div>`;
                nextButton.style.display = 'none';
            }
        });

displayQuestion();