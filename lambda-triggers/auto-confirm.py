import json

def lambda_handler(event, context):

  # Confirm the user
  event['response']['autoConfirmUser'] = True

  # Return to Amazon Cognito
  return event