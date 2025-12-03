# API Documentation for Soulvan Coin

## Overview
The Soulvan Coin API provides a set of endpoints for interacting with the Soulvan Coin blockchain. This documentation outlines the available endpoints, their usage, and the expected responses.

## Base URL
The base URL for all API requests is:
```
http://localhost:3000/api
```

## Endpoints

### 1. Create Transaction
- **POST** `/transactions`
- **Description**: Creates a new transaction.
- **Request Body**:
  ```json
  {
    "sender": "string",
    "recipient": "string",
    "amount": "number"
  }
  ```
- **Response**:
  - **201 Created**: Returns the created transaction.
  - **400 Bad Request**: If the transaction is invalid.

### 2. Get Transaction
- **GET** `/transactions/:id`
- **Description**: Retrieves a transaction by its ID.
- **Response**:
  - **200 OK**: Returns the transaction details.
  - **404 Not Found**: If the transaction does not exist.

### 3. Get All Transactions
- **GET** `/transactions`
- **Description**: Retrieves all transactions.
- **Response**:
  - **200 OK**: Returns an array of transactions.

### 4. Mine Block
- **POST** `/mine`
- **Description**: Mines a new block and adds it to the blockchain.
- **Response**:
  - **200 OK**: Returns the newly mined block.
  - **500 Internal Server Error**: If mining fails.

### 5. Get Blockchain
- **GET** `/blocks`
- **Description**: Retrieves the entire blockchain.
- **Response**:
  - **200 OK**: Returns an array of blocks.

### 6. Get Block
- **GET** `/blocks/:index`
- **Description**: Retrieves a block by its index.
- **Response**:
  - **200 OK**: Returns the block details.
  - **404 Not Found**: If the block does not exist.

## Usage Instructions
To use the API, send HTTP requests to the specified endpoints with the appropriate method and data format. Ensure that your server is running and accessible at the base URL.

## Error Handling
All responses include a status code and a message indicating the success or failure of the request. Handle errors gracefully in your application to provide a better user experience.