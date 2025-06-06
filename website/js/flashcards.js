/**
 * British English Level 2 Study Guide - Flashcards JavaScript
 * 
 * This file contains functionality for the vocabulary flashcards:
 * - Loading vocabulary data from JSON
 * - Displaying flashcards by category
 * - Handling flashcard navigation and flipping
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const categoryTabs = document.querySelectorAll('.tab-btn');
    const flashcardFront = document.querySelector('.flashcard-front p');
    const flashcardBack = document.querySelector('.flashcard-back');
    const flashcardInner = document.querySelector('.flashcard-inner');
    const prevButton = document.getElementById('prev-card');
    const nextButton = document.getElementById('next-card');
    const flipButton = document.getElementById('flip-card');
    
    // State variables
    let vocabularyData = null;
    let currentCategory = 'academic';
    let currentCardIndex = 0;
    let currentCategoryWords = [];
    
    // Load vocabulary data
    loadJSON('data/vocabulary.json')
        .then(data => {
            vocabularyData = data;
            initializeFlashcards();
        })
        .catch(error => {
            console.error('Error loading vocabulary data:', error);
            flashcardFront.textContent = 'Error loading vocabulary data';
        });
    
    // Initialize flashcards
    function initializeFlashcards() {
        if (!vocabularyData) return;
        
        // Set up category tabs
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update current category and load words
                currentCategory = tab.dataset.category;
                loadCategoryWords(currentCategory);
            });
        });
        
        // Load initial category words
        loadCategoryWords(currentCategory);
        
        // Set up flashcard navigation
        prevButton.addEventListener('click', showPreviousCard);
        nextButton.addEventListener('click', showNextCard);
        flipButton.addEventListener('click', flipCard);
        
        // Enable keyboard navigation
        document.addEventListener('keydown', handleKeyboardNavigation);
    }
    
    // Load words for a specific category
    function loadCategoryWords(category) {
        if (!vocabularyData || !vocabularyData[category]) return;
        
        currentCategoryWords = vocabularyData[category];
        currentCardIndex = 0;
        
        updateButtonStates();
        displayCurrentCard();
    }
    
    // Display the current flashcard
    function displayCurrentCard() {
        if (currentCategoryWords.length === 0) {
            flashcardFront.textContent = 'No words available for this category';
            return;
        }
        
        const card = currentCategoryWords[currentCardIndex];
        
        // Reset card to front side
        flashcardInner.classList.remove('flipped');
        
        // Update front side
        flashcardFront.textContent = card.word;
        
        // Update back side
        const definition = createElement('p', { className: 'definition' }, card.definition);
        const example = createElement('p', { className: 'example' }, `Example: ${card.example}`);
        
        let variationsText = '';
        if (card.variations && card.variations.length > 0) {
            variationsText = `Related forms: ${card.variations.join(', ')}`;
        }
        const variations = createElement('p', { className: 'variations' }, variationsText);
        
        // Clear and update back content
        flashcardBack.innerHTML = '';
        flashcardBack.appendChild(definition);
        flashcardBack.appendChild(example);
        if (variationsText) {
            flashcardBack.appendChild(variations);
        }
        
        // Update card counter
        const counter = createElement('p', { className: 'card-counter' }, 
            `Card ${currentCardIndex + 1} of ${currentCategoryWords.length}`);
        flashcardBack.appendChild(counter);
    }
    
    // Flip the flashcard
    function flipCard() {
        flashcardInner.classList.toggle('flipped');
    }
    
    // Show the previous card
    function showPreviousCard() {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            displayCurrentCard();
            updateButtonStates();
        }
    }
    
    // Show the next card
    function showNextCard() {
        if (currentCardIndex < currentCategoryWords.length - 1) {
            currentCardIndex++;
            displayCurrentCard();
            updateButtonStates();
        }
    }
    
    // Update the enabled/disabled state of navigation buttons
    function updateButtonStates() {
        prevButton.disabled = currentCardIndex === 0;
        nextButton.disabled = currentCardIndex === currentCategoryWords.length - 1;
    }
    
    // Handle keyboard navigation
    function handleKeyboardNavigation(event) {
        // Only handle keyboard navigation when the vocabulary section is in view
        const vocabularySection = document.getElementById('vocabulary');
        const rect = vocabularySection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isInView) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                showPreviousCard();
                break;
            case 'ArrowRight':
                showNextCard();
                break;
            case ' ':  // Spacebar
                flipCard();
                event.preventDefault();  // Prevent page scrolling
                break;
        }
    }
});