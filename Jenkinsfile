pipeline {
  agent any
  environment {
    DOCKER_REGISTRY = 'docker.io/<your-dockerhub-username>'
    IMAGE_NAME = 'my-nodejs-app'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build image') {
      steps {
        sh '''
          DOCKER_REGISTRY=${DOCKER_REGISTRY} BUILD_NUMBER=${BUILD_NUMBER} docker compose build web
        '''
      }
    }
    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          sh '''
            echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
            docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
          '''
        }
      }
    }
    stage('Deploy (Compose up)') {
      steps {
        sh '''
          docker stop node-web node-mongo-db || true
          docker rm node-web node-mongo-db || true
          DOCKER_REGISTRY=${DOCKER_REGISTRY} BUILD_NUMBER=${BUILD_NUMBER} docker compose up -d --force-recreate
        '''
      }
    }
  }
  post {
    always { cleanWs() }
  }
}
