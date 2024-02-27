pipeline {
    agent any
    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }
    environment {
        GIT_REPO_NAME = "TODO-Manifest"
        GIT_USER_NAME = "satyatulasijalandharch"
        SCANNER_HOME = tool 'sonar-scanner'
        APP_NAME = "TODO-Frontend"
        RELEASE = "1.0"
        DOCKER_USER = "mrstjch"
        IMAGE_NAME = "${DOCKER_USER}"
        IMAGE_TAG = "${RELEASE}.${BUILD_NUMBER}"
    }
    stages {
        stage('Started') {
            steps {
                slackSend botUser: true, channel: '#devops', color: 'good', message: 'Frontend Build Started', teamDomain: 'DevOps', tokenCredentialId: 'slack'
            }
        }
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install Frontend Dependencies') {
            steps {
                sh "npm ci"
            }
        }
        stage('Sonarqube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh "$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=TODO-Frontend -Dsonar.projectKey=TODO-Frontend"
                }
            }
        }
        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: false, credentialsId: 'sonar'
            }
        }
        stage('TRIVY FS SCAN') {
            steps {
                sh "trivy fs . > trivyfs.txt"
            }
        }
        stage('Frontend Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'dockerhub', toolName: 'docker') {
                        sh "docker build -t ${IMAGE_NAME}/todo-frontend:${IMAGE_TAG} -t ${IMAGE_NAME}/todo-frontend:latest ."
                        sh "docker push ${IMAGE_NAME}/todo-frontend:${IMAGE_TAG}"
                        sh "docker push ${IMAGE_NAME}/todo-frontend:latest"
                    }
                }
            }
        }
        stage('TRIVY Frontend Image Scan') {
            steps {
                sh "trivy image ${IMAGE_NAME}/todo-frontend:${IMAGE_TAG} > todo-frontend-trivy.txt"
            }
        }
        stage("TODO-Manifest Checkout") {
            steps {
                git branch: 'main', url: 'https://github.com/satyatulasijalandharch/TODO-Manifest.git'
            }
        }
        stage('Deploy to TODO-Frontend-Manifest') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GITHUB_USERNAME', passwordVariable: 'GITHUB_TOKEN')]) {


                        sh "sed -Ei '/- name: mrstjch\\/todo-frontend\$/{n;s/(\\s+newTag:\\s+)[0-9]+\\.[0-9]+\\.[0-9]+/\\1${IMAGE_TAG}/}' ./deployments/node-app/kustomization.yaml"

                        // Git commands to stage, commit, and push the changes
                        sh 'git add .'
                        sh "git commit -m 'Update image to ${IMAGE_TAG}'"
                        sh "git push https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main"
                    }
                }
            }
        }
    }
    post {
        success {
            script {
                def attachments = [
                    [
                        "color": "good",
                        "text": "Frontend Build Successful",
                        "fields": [
                            ["title": "Project", "value": "${env.JOB_NAME}", "short": true],
                            ["title": "Build Number", "value": "${env.BUILD_NUMBER}", "short": true],
                            ["title": "URL", "value": "${env.BUILD_URL}", "short": false]
                        ]
                    ]
                ]
                slackSend color: 'good', channel: '#devops', attachments: attachments
                slackUploadFile filePath: "trivyfs.txt", initialComment: "TRIVY FS Scan Results (Frontend)"
                slackUploadFile filePath: "todo-frontend-trivy.txt", initialComment: "TRIVY Frontend Image Scan Results"
            }
        }
        failure {
            script {
                def attachments = [
                    [
                        "color": "danger",
                        "text": "Frontend Build Failed",
                        "fields": [
                            ["title": "Project", "value": "${env.JOB_NAME}", "short": true],
                            ["title": "Build Number", "value": "${env.BUILD_NUMBER}", "short": true],
                            ["title": "URL", "value": "${env.BUILD_URL}", "short": false]
                        ]
                    ]
                ]
                slackSend color: 'danger', channel: '#devops', attachments: attachments
                slackUploadFile filePath: "trivyfs.txt", initialComment: "TRIVY FS Scan Results (Frontend)"
                slackUploadFile filePath: "todo-frontend-trivy.txt", initialComment: "TRIVY Frontend Image Scan Results"
            }
        }
    }
}
