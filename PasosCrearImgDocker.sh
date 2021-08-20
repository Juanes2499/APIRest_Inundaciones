#1. Crear la imagen de Docker
sudo docker build -t rescity/apisensores:1.0 .

#2. Probar si la imagen creada funciona
sudo docker run --name apiprueba -d -p 3010:3010 rescity/apisensores:1.0

#3. Crear TAG a la imagen de docker creada para poderla subir a Docker Hub, 
#la primera parte del tag de la imagen de docker debe ser el usuario a donde 
#se va a enviar la imagen de docker
sudo docker tag rescity/apisensores:1.0 juanes240899/apisensores:1.0  

#4. Enviar la imagen de Docker a Docker Hub
sudo docker push juanes240899/apisensores:1.0