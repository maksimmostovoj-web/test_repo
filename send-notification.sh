#!/bin/bash
cd /Users/maksimmostovoj/Downloads/Автотесты/java/tempgit/tests
rm -rf allure-report
allure generate allure-results
java "-DconfigFile=notifications/telegram.json" -jar notifications/allure-notifications-4.11.0.jar