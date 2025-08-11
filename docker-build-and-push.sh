#!/bin/bash

# Script para construir y subir imágenes Docker a Docker Hub
# Uso: ./docker-build-and-push.sh <tu_usuario_dockerhub>

if [ $# -eq 0 ]; then
    echo "Error: Debes proporcionar tu nombre de usuario de Docker Hub"
    echo "Uso: ./docker-build-and-push.sh <tu_usuario_dockerhub>"
    exit 1
fi

DOCKER_USERNAME=$1
BACKEND_IMAGE="adr-backend"
FRONTEND_IMAGE="adr-frontend"
TAG="latest"

echo "🔨 Construyendo imagen del Backend..."
cd Backend
docker build -t $DOCKER_USERNAME/$BACKEND_IMAGE:$TAG .
cd ..

echo "🔨 Construyendo imagen del Frontend..."
cd Frontend
docker build -t $DOCKER_USERNAME/$FRONTEND_IMAGE:$TAG .
cd ..

echo "📤 Subiendo imagen del Backend a Docker Hub..."
docker push $DOCKER_USERNAME/$BACKEND_IMAGE:$TAG

echo "📤 Subiendo imagen del Frontend a Docker Hub..."
docker push $DOCKER_USERNAME/$FRONTEND_IMAGE:$TAG

echo "✅ ¡Imágenes subidas exitosamente!"
echo "Backend: $DOCKER_USERNAME/$BACKEND_IMAGE:$TAG"
echo "Frontend: $DOCKER_USERNAME/$FRONTEND_IMAGE:$TAG" 