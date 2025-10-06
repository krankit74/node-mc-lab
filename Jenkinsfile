pipeline {
// Defines where the pipeline stages will run (on the Jenkins agent)
agent any
environment {
// Defines variables accessible in the pipeline
// DOCKER_IMAGE_NAME=&#39;my-nodejs-app&#39; // Already defined in docker-compose.yml
as a base
DOCKER_REGISTRY = &#39;your-dockerhub-username&#39; // Replace with your registry (e.g.,
Docker Hub, AWS ECR)
}
stages {
stage(&#39;Checkout Source&#39;) {
steps {
// Clones the source code from the repository
git url: &#39;your-git-repo-url&#39;, branch: &#39;main&#39;
}
}
stage(&#39;Build &amp; Push Docker Images&#39;) {
steps {
script {
// Authenticate to your Docker Registry (using Jenkins Credentials)
// Ensure you have a &#39;Username with password&#39; credential with ID &#39;docker-hub-
creds&#39;
withCredentials([usernamePassword(credentialsId: &#39;docker-hub-creds&#39;,
passwordVariable: &#39;DOCKER_PASSWORD&#39;,
usernameVariable: &#39;DOCKER_USERNAME&#39;)]) {
// 1. Build the Node.js image defined by the Dockerfile in the current context
(for the &#39;web&#39; service)
// Note: The docker-compose build command uses the Dockerfile defined in its
&#39;web&#39; service
sh &quot;docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}&quot;
sh &quot;docker-compose build web&quot;
// 2. Tag and Push the image to the registry
def imageTag = &quot;${DOCKER_REGISTRY}/my-nodejs-
app:${env.BUILD_NUMBER}&quot;
sh &quot;docker tag my-nodejs-app:latest ${imageTag}&quot; // Assumes docker-
compose build created an image named &#39;my-nodejs-app:latest&#39;

sh &quot;docker push ${imageTag}&quot;
}
}
}
}
stage(&#39;Deploy Multi-Container App&#39;) {
steps {
script {
// Use Docker Compose to stop old containers and start new ones
// The &#39;db&#39; service image (mongo:latest) will be pulled if not present.
// The &#39;web&#39; service image is built locally and tagged, but we will use the local
files.
// Use the BUILD_NUMBER for environment substitution in docker-compose.yml
// This ensures the deployment pulls the *just built* image version.
sh &quot;docker stop node-web node-mongo-db || true&quot; // Stop existing containers
gracefully
sh &quot;docker rm node-web node-mongo-db || true&quot; // Remove existing containers
// Deploy using docker-compose, using the BUILD_NUMBER as a tag
sh &quot;BUILD_NUMBER=${env.BUILD_NUMBER} docker-compose up -d --force-
recreate&quot;
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