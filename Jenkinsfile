pipeline {
    // Defines where the pipeline stages will run (on the Jenkins agent)
    agent any

    environment {
        // Defines variables accessible in the pipeline
        // DOCKER_IMAGE_NAME='my-nodejs-app' // Already defined in docker-compose.yml as a base
        DOCKER_REGISTRY = 'krankit74' // Replace with your registry (e.g., Docker Hub, AWS ECR)
    }

    stages {
        stage('Checkout Source') {
            steps {
                // Clones the source code from the repository
                git url: 'https://github.com/krankit74/node-mc-lab.git', branch: 'main'
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    // Authenticate to your Docker Registry (using Jenkins Credentials)
                    // Ensure you have a 'Username with password' credential with ID 'docker-hub-creds'
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-creds',
                                                    passwordVariable: 'DOCKER_PASSWORD',
                                                    usernameVariable: 'DOCKER_USERNAME')]) {

                        // 1. Build the Node.js image defined by the Dockerfile in the current context (for the 'web' service)
                        // Note: The docker-compose build command uses the Dockerfile defined in its 'web' service
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker-compose build web"

                        // 2. Tag and Push the image to the registry
                        def imageTag = "${DOCKER_REGISTRY}/my-nodejs-app:${env.BUILD_NUMBER}"
                        sh "docker tag my-nodejs-app:latest ${imageTag}" // Assumes docker-compose build created an image named 'my-nodejs-app:latest'
                        sh "docker push ${imageTag}"
                    }
                }
            }
        }

        stage('Deploy Multi-Container App') {
            steps {
                script {
                    // Use Docker Compose to stop old containers and start new ones
                    // The 'db' service image (mongo:latest) will be pulled if not present.
                    // The 'web' service image is built locally and tagged, but we will use the local files.

                    // Use the BUILD_NUMBER for environment substitution in docker-compose.yml
                    // This ensures the deployment pulls the *just built* image version.
                    sh "docker stop node-web node-mongo-db || true"  // Stop existing containers gracefully
                    sh "docker rm node-web node-mongo-db || true"   // Remove existing containers

                    // Deploy using docker-compose, using the BUILD_NUMBER as a tag
                    sh "BUILD_NUMBER=${env.BUILD_NUMBER} docker-compose up -d --force-recreate"
                }
            }
        }
    }
    post {
        always {
            // Clean up the local workspace after the job finishess
            cleanWs()
        }
    }
}

