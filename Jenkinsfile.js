pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        nodejs('NodeJS22.22.0') {
          sh 'npm ci'
          sh 'npx playwright install --with-deps'
          sh 'npm t'
        }
      }      
    }
    stage('Allure') {
      steps {
        allure(
          [
            includeProperties: false,
            jdk: '',
            properties: [],
            reportBuildPolicy: 'ALWAYS',
            results: [[path: 'allure-report']]
          ]
        )
      }
    }
  }
  post {
    always {
      echo 'This will always run regardless of test results'
    }
    success {
      echo 'Pipeline completed successfully'
    }
    failure {
      echo 'Pipeline failed'
      // Можно добавить уведомления здесь
    }
  }
}