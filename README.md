
# SellScaleHood Setup Instructions

Follow the steps below to set up and run the project.

## Download the Project Files

1. Download the `.zip` file.
2. Extract the `.zip` file.
3. Ensure the `.env` file is in the root directory.

----------

## Set Up Python Flask & Connect to the Database

### 1. Set Up Virtual Environment

#### 1.1 Create the Virtual Environment

```bash
python3 -m venv venv
```

#### 1.2 Activate the Virtual Environment

-   On **Linux/macOS**:
    
    ```bash
    source venv/bin/activate
    
    ```
    
-   On **Windows**:
    
    ```bash
    venv\Scripts\activate
    
    ```
    

### 2. Install Packages

Install the required Python packages using the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

### 3. Run the Flask Application

Start the Flask API server:

```bash
python3 api.py
```

----------

## Run the React App

1.  Navigate to the `sellscalehood-frontend` directory (or wherever your React application is located):
    
    ```bash
    cd sellscalehood-frontend
    ```
    
2.  Install the necessary Node.js packages:
    
    ```bash
    npm install
    ```
    
3.  Start the React application:
    
    ```bash
    npm start
    ```
    

The React application should now be running, typically accessible at `http://localhost:3000` in your web browser.

----------

## Additional Notes

-   Ensure you have the necessary versions of Python, Flask, Node.js, and npm installed.
-   For database setup, verify any configuration in the `.env` file, such as database credentials or connection URLs.