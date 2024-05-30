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
            }
        }
        stage('Test') {
            steps {
                echo 'Testing the project...'
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                // Add deployment scripts or commands here
            }
        }
    }
}
