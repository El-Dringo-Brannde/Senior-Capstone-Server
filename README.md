# Senior-Capstone-Server ![alt text](https://travis-ci.org/El-Dringo-Brannde/Senior-Capstone-Server.svg?branch=master "Build Status")
A place for all web server stuff related to the Capstone Project

# Alexa 
1. You'll need to set up an AWS account and register your Alexa under it and all that stuff. You can find all of that here [AWS Create Account](https://portal.aws.amazon.com/billing/signup?nc2=h_ct&redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start). At some point you will need to add your CC. But you'll be under the free tier for a year. 
2. Make sure the server is started and running, ssh in and forever start it if it died some how.
3. Then, follow the instructions [here](https://developer.amazon.com/alexa-skills-kit/alexa-skill-quick-start-tutorial) Or just Google around about developing an Alexa skill
4. Go into the Alexa folder, and copy/paste the proper files for each step of the Alexa setup. 
5. You'll need to use the SampleUtternaces.txt, customSlotTypes.txt, and IntentSchema.json. Just for the Alexa language processing section.
6. Create a Lambda function on your AWS account found [here](https://portal.aws.amazon.com/billing/signup?nc2=h_ct&redirect_url=https%3A%2F%2Faws.amazon.com%2Fregistration-confirmation#/start). 
7.  Go into the Alexa/Lambda folder of the Directory and do `npm install && npm start`
8. Upload the .zip file generated into the Lambda function
9. Tie the lambda function into your AWS skill 
10. When everything is in place and tested, save the skill under your local account so it goes to your Alexa. 
11. Make a branch and push any changes, then submit a PR. 
12. \$\$\$ Profit \$\$\$


# Local Server
1. SSH into the AWS server (please ask for access)
2. Change directory to the localServer folder then `npm install && npm start`. 
3. If the AWS server is up, you should get a console message saying 'connected!'. Which means you're connected via a websocket to the server. 
4. Do cool stuff
5. Create branch, make PR
6. Profit

