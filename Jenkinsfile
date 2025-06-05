pipeline {
    agent any

    environment {
        IMAGE_NAME = 'task-api'
        IMAGE_TAG = '1.0'
    }

    stages {
       stage('Checkout') {
    steps {
        git credentialsId: 'github-token', branch: 'main', url: 'https://github.com/Vexced/task-manager-devops.git'
    }
}


        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${env.IMAGE_NAME}:${env.IMAGE_TAG}", './api')
                }
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Aquí podrías ejecutar tests si tienes configurados'
                // sh 'npm test' dentro del contenedor o en agente
            }
        }

        stage('Push Image') {
            steps {
                echo 'Aquí puedes agregar login y push a Docker Hub si quieres'
                // Ejemplo:
                // withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                //     sh 'docker login -u $USER -p $PASS'
                //     sh "docker push ${env.IMAGE_NAME}:${env.IMAGE_TAG}"
                // }
            }
        }
    }
}
