document.addEventListener('DOMContentLoaded', function() {
    // Required variables
    let player1Name, player2Name;
    let player1Score = 0, player2Score = 0;
    let selectedCategory;
    let currentQuestionIndex = 0;
    let questions = [];
    let currentPlayer = 1;
    let selectedAnswer = null;
    const questionsPerCategory = 6;
    const easyQuestions = 2, mediumQuestions = 2, hardQuestions = 2;

    // Event listeners
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('select-category-btn').addEventListener('click', selectCategory);
    document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
    document.getElementById('play-again').addEventListener('click', playAgain);
    document.getElementById('end-game').addEventListener('click', endGame);

    // Game logic
    function startGame() {
        player1Name = document.getElementById('firstName').value;
        player2Name = document.getElementById('secondName').value;
        
        if (player1Name === '' || player2Name === '') {
            alert('Please enter both player names.');
            return;
        }
        
        document.getElementById('player-details').style.display = 'none';
        document.getElementById('category').style.display = 'block';
        fetchCategories();
    }

    function selectCategory() {
        selectedCategory = document.getElementById('list').value;
        document.getElementById('category').style.display = 'none';
        document.getElementById('questions').style.display = 'block';
        fetchQuestions();
    }

    function fetchQuestions() {
        fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&limit=${questionsPerCategory}`)
            .then(response => response.json())
            .then(data => {
                questions = data;
                displayQuestion();
            })
            .catch(error => {
                console.error('Error in fetching questions:', error);
            });
    }

    function displayQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        document.getElementById('textQuestions').textContent = currentQuestion.question.text;

        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';

        const answers = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
        answers.sort(() => Math.random() - 0.5);

        answers.forEach(answer => {
            const li = document.createElement('li');
            li.textContent = answer;
            li.addEventListener('click', () => {
                selectAnswer(answer);
            });
            answersContainer.appendChild(li);
        });

        document.getElementById('submitAnswer').style.display = 'inline-block';
    }

    function selectAnswer(answer) {
        selectedAnswer = answer;
        const answersContainer = document.getElementById('answers');
        const answerOptions = answersContainer.getElementsByTagName('li');
        
        for (let i = 0; i < answerOptions.length; i++) {
            if (answerOptions[i].textContent === answer) {
                answerOptions[i].classList.add('selected');
            } else {
                answerOptions[i].classList.remove('selected');
            }
        }
    }

    function submitAnswer() {
        if (selectedAnswer === null) {
            return;
        }
        
        const currentQuestion = questions[currentQuestionIndex];
        if (selectedAnswer === currentQuestion.correctAnswer) {
            if (currentPlayer === 1) {
                if (currentQuestionIndex < easyQuestions) {
                    player1Score += 10;
                } else if (currentQuestionIndex < easyQuestions + mediumQuestions) {
                    player1Score += 15;
                } else {
                    player1Score += 20;
                }
                document.getElementById('player1-score').textContent = player1Score;
            } else {
                if (currentQuestionIndex < easyQuestions) {
                    player2Score += 10;
                } else if (currentQuestionIndex < easyQuestions + mediumQuestions) {
                    player2Score += 15;
                } else {
                    player2Score += 20;
                }
                document.getElementById('player2-score').textContent = player2Score;
            }
        }

        currentQuestionIndex++;
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        selectedAnswer = null;
        document.getElementById('submitAnswer').style.display = 'none';

        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            document.getElementById('questions').style.display = 'none';
            document.getElementById('results').style.display = 'block';
            let message;
            if (player1Score > player2Score) {
                message = `${player1Name} wins with a score of ${player1Score}!`;
            } else if (player2Score > player1Score) {
                message = `${player2Name} wins with a score of ${player2Score}!`;
            } else {
                message = 'It\'s a tie!';
            }
            document.getElementById('resultText').textContent = message;
        }
    }

    function playAgain() {
        currentQuestionIndex = 0;
        player1Score = 0;
        player2Score = 0;
        currentPlayer = 1;
        selectedAnswer = null;
        document.getElementById('player1-score').textContent = '0';
        document.getElementById('player2-score').textContent = '0';
        document.getElementById('results').style.display = 'none';
        document.getElementById('category').style.display = 'block';
        fetchCategories();
    }

    function endGame() {
        document.getElementById('questions').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        let message;
        if (player1Score > player2Score) {
            message = `${player1Name} wins with a score of ${player1Score}!`;
        } else if (player2Score > player1Score) {
            message = `${player2Name} wins with a score of ${player2Score}!`;
        } else {
            message = 'It\'s a tie!';
        }
        document.getElementById('resultText').textContent = message;
        document.getElementById('end-game').style.display = 'none';
        document.getElementById('play-again').textContent = 'Play Again';
    }

    // Fetch categories
    function fetchCategories() {
        fetch('https://the-trivia-api.com/v2/categories')
            .then(response => response.json())
            .then(data => {
                const categoryDropdown = document.getElementById('list');
                for (const category in data) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.text = data[category];
                    categoryDropdown.add(option);
                }
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    }
});





