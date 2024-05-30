pipeline {
    agent any
    tools {
        nodejs 'node-latest'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Building the project...'
                sh 'npm install'
                sh 'npm run build'  // Example command to build your project
            }
        }
        // other stages...
    }
}
