# Deno Workspace

## Overview
This project is a Deno application that integrates with Supabase to handle deposit requests. It includes serverless functions for verifying deposits, managing user balances, and provides a structured way to organize code and tests.

## Project Structure
```
deno-workspace
├── .vscode
│   ├── settings.json
│   ├── launch.json
│   └── extensions.json
├── supabase
│   └── functions
│       └── verify-deposit
│           └── index.ts
├── src
│   ├── mod.ts
│   └── deps.ts
├── tests
│   └── unit
│       └── example_test.ts
├── deno.json
├── import_map.json
└── README.md
```

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd deno-workspace
   ```

2. **Install Deno**: Follow the instructions on the [Deno website](https://deno.land/) to install Deno.

3. **Environment Variables**: Set up the necessary environment variables for Supabase:
   - `SUPABASE_URL`: Your Supabase project URL.
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key.

4. **Run the application**:
   You can run the application using the following command:
   ```bash
   deno run --allow-net --allow-env src/mod.ts
   ```

## Usage
- The application provides a serverless function to verify deposit requests. You can send a POST request to the function endpoint with the required parameters (`depositId` and `action`).

## Testing
- Unit tests are located in the `tests/unit` directory. You can run the tests using:
  ```bash
  deno test
  ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.