# chatmessenger
This is a node project aimed at building a chat application using express and socketIO framework

The google oauth2 is used to get the user logged into to the app and the app inturn used the profile details from the google server as per the permission allowed.

Docker commands to create the image :

docker build -t chatmessenger .

Docker command to run the image on the container:

docker run -p 4000:4000 -d chatmessenger
