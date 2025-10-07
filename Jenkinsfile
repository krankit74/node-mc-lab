pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = 'krankit74' // change this if your Docker Hub username is different
    IMAGE_NAME = 'my-nodejs-app'
  }

  stages {

    stage('Checkout Source') {
      steps {
        git url: 'https://github.com/krankit74/node-mc-lab.git', branch: 'main'
      }
    }

    stage('Build & Push Docker Images') {
      steps {
        script {
          withCredentials([usernamePassword(
            credentialsId: 'docker-hub-creds',
            usernameVariable: 'DOCKER_USERNAME',
            passwordVariable: 'DOCKER_PASSWORD')]) {

            // More secure Docker login
            bat """
            @echo off
            echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USERNAME% --password-stdin
            """
            // Build the Docker image
            bat "docker-compose build web"

            // Tag and push image
            def imageTag = "${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}"
            bat "docker tag ${IMAGE_NAME}:${env.BUILD_NUMBER} ${imageTag}"
            bat "docker push ${imageTag}"
          }
        }
      }
    }

    stage('Deploy Multi-Container App') {
      steps {
        script {
          bat """
            @echo off
            docker-compose down || exit /b 0
            set BUILD_NUMBER=${env.BUILD_NUMBER}
            docker-compose up -d
          """
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}