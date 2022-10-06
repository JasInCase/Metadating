# Metadating

This repository contains both the frontend and backend for the metadating web app.

Both of these can be run while in the metadating-frontend directory.

Within that directory, you can run the following commands:

```
yarn start
```

- Runs the frontend of the webapp

```
yarn start-api
```

- Runs the Flask backend for the webapp. It is accessible at /api/v1/

```
yarn start-all
```

- Runs both the frontend and backend in parallel.


<!-- Make sure to have the following libraries installed:
(I recommend starting a python virtual environment in the main project directory for these)

- flask
  - pip install flask
- python-dotenv
  - pip install python-dotenv
- requests
  - pip install requests
- nodejs
  - sudo apt-get install nodejs
- npm
  - sudo apt-get install npm
- yarn
  - npm install --global yarn
- axios
  - npm install axios
- pylint-flask
  - pip install pylint pylint-flask -->

Use the script "installrequirements" to install the required libraries.
```
./installrequirements <wsl | mac>
```

The command to run backend directly is 
```
FLASK_DEBUG=TRUE FLASK_APP=metabackend flask run --host 0.0.0.0 --port 8000
```

On Powershell:
```
$env:FLASK_APP = "metabackend"
flask run --host 0.0.0.0 --port 8000
```

and React is setup to automatically proxy all unknown requests to the Flask backend.
