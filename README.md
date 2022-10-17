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

and React is setup to automatically proxy all unknown requests to the Flask backend (currently on port 8000, while frontend runs on port 3000)
