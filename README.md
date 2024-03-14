# Tournament Management Website

## Setup Backend

First thing to do is clone repo.

```git clone https://github.com/ScivilicGuy/fight-club.git```

Then create a virtual environment in backend folder and activate it.

```cd backend```

```virtualenv env```

```source env/bin/activate```

Then we install dependencies.

```pip install -r requirements.txt```

To setup database, make sure to set database.ini file with your own configuration values. 

Then we create a database in postgresql with same name as what you put in your database.ini file.

Exit postgresql and then load in the dump file to create the tables in terminal.

```psql -d {your-db-name} -U {your-postgresql-user} -f tournament.dump```

Finally, run the server

```flask --app server run```


## Setup Frontend

First thing to do is navigate to frontend folder and install dependencies.

```cd my-app```

```npm install```

Then we open up our website using this command.

```npm start```


