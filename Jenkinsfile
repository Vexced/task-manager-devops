pipeline {
    agent any

    environment {
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
    }

    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-token', branch: 'main', url: 'https://github.com/Vexced/task-manager-devops.git'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // (Opcional) debug info
                    sh 'whoami'
                    sh 'id'

                    sh "kubectl apply -f k8s/configmap.yaml || true"
                    sh "kubectl apply -f k8s/deployment.yaml"
                    sh "kubectl apply -f k8s/service.yaml"
                }
            }
        }
    }
}
