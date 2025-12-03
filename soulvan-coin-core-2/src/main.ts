// src/main.ts

import { initializeApp } from './app'; // Import the application initialization function

// Main entry point of the Soulvan Coin application
const main = async () => {
    try {
        await initializeApp(); // Initialize the application
        console.log('Soulvan Coin application is running successfully.');
    } catch (error) {
        console.error('Error starting the Soulvan Coin application:', error);
    }
};

// Execute the main function
main();