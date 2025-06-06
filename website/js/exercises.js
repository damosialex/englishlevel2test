/**
 * British English Level 2 Study Guide - Exercises JavaScript
 * 
 * This file contains functionality for:
 * - Reading comprehension exercises
 * - Grammar exercises
 * - Listening exercises
 * - Writing exercises feedback
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all exercise sections
    initializeReadingSection();
    initializeGrammarSection();
    initializeListeningSection();
    initializeWritingSection();
});

/**
 * Reading Section Functionality
 */
function initializeReadingSection() {
    // DOM elements
    const readingSelector = document.getElementById('reading-selector');
    const readingTitle = document.getElementById('reading-title');
    const readingText = document.getElementById('reading-text');
    const questionsContainer = document.getElementById('reading-questions');
    const checkAnswersButton = document.getElementById('check-reading-answers');
    
    // State variables
    let readingData = null;
    let currentReadingIndex = -1;
    
    // Load reading data
    loadJSON('data/reading.json')
        .then(data => {
            readingData = data;
            populateReadingSelector();
        })
        .catch(error => {
            console.error('Error loading reading data:', error);
            readingText.innerHTML = '<p>Error loading reading passages</p>';
        });
    
    // Populate the reading selector dropdown
    function populateReadingSelector() {
        if (!readingData || !readingData.length) return;
        
        // Clear existing options except the placeholder
        while (readingSelector.options.length > 1) {
            readingSelector.remove(1);
        }
        
        // Add options for each reading passage
        readingData.forEach((passage, index) => {
            const option = createElement('option', { value: index }, passage.title);
            readingSelector.appendChild(option);
        });
        
        // Set up change event
        readingSelector.addEventListener('change', function() {
            const selectedIndex = parseInt(this.value);
            if (!isNaN(selectedIndex)) {
                displayReadingPassage(selectedIndex);
            } else {
                // Clear the reading area if placeholder is selected
                clearReadingArea();
            }
        });
    }
    
    // Display a reading passage and its questions
    function displayReadingPassage(index) {
        if (!readingData || index < 0 || index >= readingData.length) return;
        
        const passage = readingData[index];
        currentReadingIndex = index;
        
        // Display passage title and content
        readingTitle.textContent = passage.title;
        readingText.innerHTML = formatTextWithParagraphs(passage.content);
        
        // Create questions
        createReadingQuestions(passage);
        
        // Show check answers button
        checkAnswersButton.style.display = 'block';
    }
    
    // Create reading comprehension questions
    function createReadingQuestions(passage) {
        questionsContainer.innerHTML = '';
        
        if (!passage.questions || !passage.questions.length) {
            questionsContainer.innerHTML = '<p>No questions available for this passage.</p>';
            return;
        }
        
        // Create a heading for the questions section
        const heading = createElement('h4', {}, 'Questions');
        questionsContainer.appendChild(heading);
        
        // Create each question
        passage.questions.forEach((question, index) => {
            const questionNumber = index + 1;
            const questionContainer = createElement('div', { className: 'question' });
            
            // Question text
            const questionText = createElement('p', {}, `${questionNumber}. ${question.text}`);
            questionContainer.appendChild(questionText);
            
            // Create appropriate input based on question type
            if (question.type === 'multiple-choice') {
                const optionsContainer = createElement('div', { className: 'options' });
                
                question.options.forEach((option, optionIndex) => {
                    const id = `q${questionNumber}_option${optionIndex}`;
                    const label = createElement('label', { for: id });
                    const radio = createElement('input', {
                        type: 'radio',
                        name: `question${questionNumber}`,
                        id,
                        value: option
                    });
                    
                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(` ${option}`));
                    optionsContainer.appendChild(label);
                });
                
                questionContainer.appendChild(optionsContainer);
            } else if (question.type === 'short-answer') {
                const input = createElement('input', {
                    type: 'text',
                    className: 'short-answer',
                    placeholder: 'Your answer...'
                });
                questionContainer.appendChild(input);
            }
            
            // Add feedback container (initially hidden)
            const feedback = createElement('div', { className: 'feedback', style: 'display: none;' });
            questionContainer.appendChild(feedback);
            
            questionsContainer.appendChild(questionContainer);
        });
        
        // Set up check answers button
        checkAnswersButton.onclick = checkReadingAnswers;
    }
    
    // Check reading comprehension answers
    function checkReadingAnswers() {
        if (currentReadingIndex < 0 || !readingData) return;
        
        const passage = readingData[currentReadingIndex];
        const questions = questionsContainer.querySelectorAll('.question');
        
        questions.forEach((questionElement, index) => {
            const question = passage.questions[index];
            const feedback = questionElement.querySelector('.feedback');
            let userAnswer = '';
            let isCorrect = false;
            
            // Get user's answer based on question type
            if (question.type === 'multiple-choice') {
                const selectedOption = questionElement.querySelector('input[type="radio"]:checked');
                if (selectedOption) {
                    userAnswer = selectedOption.value;
                    isCorrect = userAnswer === question.answer;
                }
            } else if (question.type === 'short-answer') {
                const input = questionElement.querySelector('input[type="text"]');
                if (input) {
                    userAnswer = input.value.trim();
                    
                    // For short answers, check if the answer contains key words
                    const keyWords = question.answer.toLowerCase().split(/\s+/);
                    const userWords = userAnswer.toLowerCase().split(/\s+/);
                    
                    // Check if all key words are present in the user's answer
                    isCorrect = keyWords.every(word => 
                        userWords.some(userWord => userWord.includes(word))
                    );
                }
            }
            
            // Display feedback
            feedback.style.display = 'block';
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            
            if (isCorrect) {
                feedback.textContent = 'Correct!';
            } else {
                feedback.textContent = `Incorrect. ${question.explanation || ''}`;
            }
        });
    }
    
    // Clear the reading area
    function clearReadingArea() {
        readingTitle.textContent = '';
        readingText.innerHTML = '';
        questionsContainer.innerHTML = '';
        checkAnswersButton.style.display = 'none';
        currentReadingIndex = -1;
    }
}

/**
 * Grammar Section Functionality
 */
function initializeGrammarSection() {
    // DOM elements
    const grammarSelector = document.getElementById('grammar-selector');
    const grammarDescription = document.getElementById('grammar-description');
    const exercisesContainer = document.getElementById('grammar-exercises');
    const checkAnswersButton = document.getElementById('check-grammar-answers');
    
    // State variables
    let grammarData = null;
    let currentGrammarIndex = -1;
    
    // Load grammar data
    loadJSON('data/grammar.json')
        .then(data => {
            grammarData = data;
            populateGrammarSelector();
        })
        .catch(error => {
            console.error('Error loading grammar data:', error);
            grammarDescription.innerHTML = '<p>Error loading grammar exercises</p>';
        });
    
    // Populate the grammar selector dropdown
    function populateGrammarSelector() {
        if (!grammarData || !grammarData.length) return;
        
        // Clear existing options except the placeholder
        while (grammarSelector.options.length > 1) {
            grammarSelector.remove(1);
        }
        
        // Add options for each grammar category
        grammarData.forEach((item, index) => {
            const option = createElement('option', { value: index }, item.category);
            grammarSelector.appendChild(option);
        });
        
        // Set up change event
        grammarSelector.addEventListener('change', function() {
            const selectedIndex = parseInt(this.value);
            if (!isNaN(selectedIndex)) {
                displayGrammarExercises(selectedIndex);
            } else {
                // Clear the grammar area if placeholder is selected
                clearGrammarArea();
            }
        });
    }
    
    // Display grammar exercises for a category
    function displayGrammarExercises(index) {
        if (!grammarData || index < 0 || index >= grammarData.length) return;
        
        const grammarItem = grammarData[index];
        currentGrammarIndex = index;
        
        // Display grammar description
        grammarDescription.innerHTML = `<h3>${grammarItem.category}</h3><p>${grammarItem.description}</p>`;
        
        // Create exercises
        createGrammarExercises(grammarItem);
        
        // Show check answers button
        checkAnswersButton.style.display = 'block';
        checkAnswersButton.onclick = checkGrammarAnswers;
    }
    
    // Create grammar exercises
    function createGrammarExercises(grammarItem) {
        exercisesContainer.innerHTML = '';
        
        if (!grammarItem.exercises || !grammarItem.exercises.length) {
            exercisesContainer.innerHTML = '<p>No exercises available for this grammar topic.</p>';
            return;
        }
        
        // Create each exercise
        grammarItem.exercises.forEach((exercise, index) => {
            const exerciseNumber = index + 1;
            const exerciseContainer = createElement('div', { className: 'exercise' });
            
            // Exercise question
            const questionText = createElement('p', {}, `${exerciseNumber}. ${exercise.question}`);
            exerciseContainer.appendChild(questionText);
            
            // Create appropriate input based on exercise type
            if (exercise.type === 'multiple-choice') {
                const optionsContainer = createElement('div', { className: 'options' });
                
                exercise.options.forEach((option, optionIndex) => {
                    const id = `ex${exerciseNumber}_option${optionIndex}`;
                    const label = createElement('label', { for: id });
                    const radio = createElement('input', {
                        type: 'radio',
                        name: `exercise${exerciseNumber}`,
                        id,
                        value: option
                    });
                    
                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(` ${option}`));
                    optionsContainer.appendChild(label);
                });
                
                exerciseContainer.appendChild(optionsContainer);
            } else if (exercise.type === 'fill-in') {
                const input = createElement('input', {
                    type: 'text',
                    className: 'fill-in',
                    placeholder: 'Your answer...'
                });
                exerciseContainer.appendChild(input);
            }
            
            // Add feedback container (initially hidden)
            const feedback = createElement('div', { className: 'feedback', style: 'display: none;' });
            exerciseContainer.appendChild(feedback);
            
            exercisesContainer.appendChild(exerciseContainer);
        });
    }
    
    // Check grammar exercise answers
    function checkGrammarAnswers() {
        if (currentGrammarIndex < 0 || !grammarData) return;
        
        const grammarItem = grammarData[currentGrammarIndex];
        const exercises = exercisesContainer.querySelectorAll('.exercise');
        
        exercises.forEach((exerciseElement, index) => {
            const exercise = grammarItem.exercises[index];
            const feedback = exerciseElement.querySelector('.feedback');
            let userAnswer = '';
            let isCorrect = false;
            
            // Get user's answer based on exercise type
            if (exercise.type === 'multiple-choice') {
                const selectedOption = exerciseElement.querySelector('input[type="radio"]:checked');
                if (selectedOption) {
                    userAnswer = selectedOption.value;
                    isCorrect = userAnswer === exercise.answer;
                }
            } else if (exercise.type === 'fill-in') {
                const input = exerciseElement.querySelector('input[type="text"]');
                if (input) {
                    userAnswer = input.value.trim().toLowerCase();
                    isCorrect = userAnswer === exercise.answer.toLowerCase();
                }
            }
            
            // Display feedback
            feedback.style.display = 'block';
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            
            if (isCorrect) {
                feedback.textContent = 'Correct!';
            } else {
                feedback.textContent = `Incorrect. The correct answer is "${exercise.answer}". ${exercise.explanation || ''}`;
            }
        });
    }
    
    // Clear the grammar area
    function clearGrammarArea() {
        grammarDescription.innerHTML = '';
        exercisesContainer.innerHTML = '';
        checkAnswersButton.style.display = 'none';
        currentGrammarIndex = -1;
    }
}

/**
 * Listening Section Functionality
 */
function initializeListeningSection() {
    // DOM elements
    const listeningSelector = document.getElementById('listening-selector');
    const listeningTitle = document.getElementById('listening-title');
    const listeningDescription = document.getElementById('listening-description');
    const audioPlayer = document.getElementById('audio-player');
    const showTranscriptButton = document.getElementById('show-transcript');
    const transcript = document.getElementById('transcript');
    const questionsContainer = document.getElementById('listening-questions');
    const checkAnswersButton = document.getElementById('check-listening-answers');
    
    // Speaking practice elements
    const speakingTopicText = document.getElementById('speaking-topic-text');
    const speakingGuidelinesList = document.getElementById('speaking-guidelines-list');
    const speakingDiscussionList = document.getElementById('speaking-discussion-list');
    
    // State variables
    let listeningData = null;
    let currentListeningIndex = -1;
    
    // Load listening data
    loadJSON('data/listening.json')
        .then(data => {
            listeningData = data;
            populateListeningSelector();
        })
        .catch(error => {
            console.error('Error loading listening data:', error);
            listeningDescription.innerHTML = '<p>Error loading listening exercises</p>';
        });
    
    // Populate the listening selector dropdown
    function populateListeningSelector() {
        if (!listeningData || !listeningData.length) return;
        
        // Clear existing options except the placeholder
        while (listeningSelector.options.length > 1) {
            listeningSelector.remove(1);
        }
        
        // Add options for each listening exercise
        listeningData.forEach((item, index) => {
            const option = createElement('option', { value: index }, item.title);
            listeningSelector.appendChild(option);
        });
        
        // Set up change event
        listeningSelector.addEventListener('change', function() {
            const selectedIndex = parseInt(this.value);
            if (!isNaN(selectedIndex)) {
                displayListeningExercise(selectedIndex);
            } else {
                // Clear the listening area if placeholder is selected
                clearListeningArea();
            }
        });
    }
    
    // Display a listening exercise
    function displayListeningExercise(index) {
        if (!listeningData || index < 0 || index >= listeningData.length) return;
        
        const listeningItem = listeningData[index];
        currentListeningIndex = index;
        
        // Display exercise title and description
        listeningTitle.textContent = listeningItem.title;
        listeningDescription.textContent = listeningItem.description;
        
        // Set up audio player
        audioPlayer.src = `assets/audio/${listeningItem.audio_file}`;
        
        // Set up transcript
        transcript.innerHTML = formatTextWithParagraphs(listeningItem.transcript);
        transcript.style.display = 'none';
        
        // Set up show/hide transcript button
        showTranscriptButton.textContent = 'Show Transcript';
        showTranscriptButton.onclick = toggleTranscript;
        
        // Create questions
        createListeningQuestions(listeningItem);
        
        // Show check answers button
        checkAnswersButton.style.display = 'block';
        checkAnswersButton.onclick = checkListeningAnswers;
        
        // Set up speaking practice
        setupSpeakingPractice(listeningItem);
    }
    
    // Set up speaking practice section
    function setupSpeakingPractice(listeningItem) {
        if (listeningItem.speaking_practice) {
            const speakingPractice = listeningItem.speaking_practice;
            
            // Set topic
            speakingTopicText.textContent = speakingPractice.topic;
            
            // Set guidelines
            speakingGuidelinesList.innerHTML = '';
            speakingPractice.guidelines.forEach(guideline => {
                const li = createElement('li', {}, guideline);
                speakingGuidelinesList.appendChild(li);
            });
            
            // Set discussion questions
            speakingDiscussionList.innerHTML = '';
            speakingPractice.discussion_questions.forEach(question => {
                const li = createElement('li', {}, question);
                speakingDiscussionList.appendChild(li);
            });
        } else {
            // Default content if no speaking practice is available
            speakingTopicText.textContent = 'No speaking practice available for this exercise.';
            speakingGuidelinesList.innerHTML = '';
            speakingDiscussionList.innerHTML = '';
        }
    }
    
    // Toggle transcript visibility
    function toggleTranscript() {
        if (transcript.style.display === 'none') {
            transcript.style.display = 'block';
            showTranscriptButton.textContent = 'Hide Transcript';
        } else {
            transcript.style.display = 'none';
            showTranscriptButton.textContent = 'Show Transcript';
        }
    }
    
    // Create listening comprehension questions
    function createListeningQuestions(listeningItem) {
        questionsContainer.innerHTML = '';
        
        if (!listeningItem.questions || !listeningItem.questions.length) {
            questionsContainer.innerHTML = '<p>No questions available for this listening exercise.</p>';
            return;
        }
        
        // Create a heading for the questions section
        const heading = createElement('h4', {}, 'Questions');
        questionsContainer.appendChild(heading);
        
        // Create each question
        listeningItem.questions.forEach((question, index) => {
            const questionNumber = index + 1;
            const questionContainer = createElement('div', { className: 'question' });
            
            // Question text
            const questionText = createElement('p', {}, `${questionNumber}. ${question.question}`);
            questionContainer.appendChild(questionText);
            
            // Create options for multiple choice questions
            const optionsContainer = createElement('div', { className: 'options' });
            
            question.options.forEach((option, optionIndex) => {
                const id = `lq${questionNumber}_option${optionIndex}`;
                const label = createElement('label', { for: id });
                const radio = createElement('input', {
                    type: 'radio',
                    name: `listening_question${questionNumber}`,
                    id,
                    value: option
                });
                
                label.appendChild(radio);
                label.appendChild(document.createTextNode(` ${option}`));
                optionsContainer.appendChild(label);
            });
            
            questionContainer.appendChild(optionsContainer);
            
            // Add feedback container (initially hidden)
            const feedback = createElement('div', { className: 'feedback', style: 'display: none;' });
            questionContainer.appendChild(feedback);
            
            questionsContainer.appendChild(questionContainer);
        });
    }
    
    // Check listening comprehension answers
    function checkListeningAnswers() {
        if (currentListeningIndex < 0 || !listeningData) return;
        
        const listeningItem = listeningData[currentListeningIndex];
        const questions = questionsContainer.querySelectorAll('.question');
        
        questions.forEach((questionElement, index) => {
            const question = listeningItem.questions[index];
            const feedback = questionElement.querySelector('.feedback');
            let userAnswer = '';
            let isCorrect = false;
            
            // Get user's answer
            const selectedOption = questionElement.querySelector('input[type="radio"]:checked');
            if (selectedOption) {
                userAnswer = selectedOption.value;
                isCorrect = userAnswer === question.answer;
            }
            
            // Display feedback
            feedback.style.display = 'block';
            feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
            
            if (isCorrect) {
                feedback.textContent = 'Correct!';
            } else {
                feedback.textContent = `Incorrect. The correct answer is "${question.answer}".`;
            }
        });
    }
    
    // Clear the listening area
    function clearListeningArea() {
        listeningTitle.textContent = '';
        listeningDescription.textContent = '';
        audioPlayer.src = '';
        transcript.innerHTML = '';
        transcript.style.display = 'none';
        questionsContainer.innerHTML = '';
        checkAnswersButton.style.display = 'none';
        
        // Clear speaking practice
        speakingTopicText.textContent = 'Select a listening exercise to see the related speaking practice.';
        speakingGuidelinesList.innerHTML = '';
        speakingDiscussionList.innerHTML = '';
        
        currentListeningIndex = -1;
    }
}

/**
 * Writing Section Functionality
 */
function initializeWritingSection() {
    // DOM elements
    const writingAreas = document.querySelectorAll('.writing-exercise textarea');
    const saveButtons = document.querySelectorAll('.save-writing');
    const checkButtons = document.querySelectorAll('.check-writing');
    
    // Set up save buttons
    saveButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const textarea = writingAreas[index];
            const content = textarea.value;
            
            if (content.trim() === '') {
                alert('Please write something before saving.');
                return;
            }
            
            // Save to local storage
            localStorage.setItem(`writing_draft_${index}`, content);
            alert('Your draft has been saved.');
        });
    });
    
    // Set up check buttons
    checkButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const textarea = writingAreas[index];
            const content = textarea.value;
            
            if (content.trim() === '') {
                alert('Please write something before checking.');
                return;
            }
            
            // Provide basic feedback
            const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
            const sentenceCount = content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
            
            let feedback = `Word count: ${wordCount}\n`;
            feedback += `Sentence count: ${sentenceCount}\n\n`;
            
            // Basic writing assessment
            if (wordCount < 50) {
                feedback += 'Your response is quite short. Consider developing your ideas more fully.\n';
            } else if (wordCount > 300) {
                feedback += 'Good length for a detailed response.\n';
            }
            
            if (sentenceCount > 0 && wordCount / sentenceCount > 25) {
                feedback += 'Your sentences are quite long on average. Consider using some shorter sentences for clarity.\n';
            }
            
            // Check for common issues
            const commonErrors = [
                { pattern: /\bi\b/g, suggestion: 'Remember to capitalize "I"' },
                { pattern: /\s\s+/g, suggestion: 'Multiple spaces detected' },
                { pattern: /[,.!?][A-Za-z]/g, suggestion: 'Add a space after punctuation marks' },
                { pattern: /\b(their|there|they're|your|you're|its|it's|to|too|two)\b/gi, suggestion: 'Check usage of commonly confused words' }
            ];
            
            let errorFound = false;
            commonErrors.forEach(error => {
                if (error.pattern.test(content)) {
                    if (!errorFound) {
                        feedback += '\nPotential issues to check:\n';
                        errorFound = true;
                    }
                    feedback += `- ${error.suggestion}\n`;
                }
            });
            
            alert(feedback);
        });
    });
    
    // Load saved drafts from local storage
    writingAreas.forEach((textarea, index) => {
        const savedContent = localStorage.getItem(`writing_draft_${index}`);
        if (savedContent) {
            textarea.value = savedContent;
        }
    });
}

/**
 * Utility Functions
 */

// Load JSON data from a file
function loadJSON(path) {
    return fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        });
}

// Create an HTML element with attributes and content
function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    
    // Set attributes
    for (const key in attributes) {
        if (key === 'className') {
            element.className = attributes[key];
        } else {
            element.setAttribute(key, attributes[key]);
        }
    }
    
    // Set text content if provided
    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
}

// Format text with paragraphs
function formatTextWithParagraphs(text) {
    if (!text) return '';
    return text.split('\n\n')
        .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
        .join('');
}