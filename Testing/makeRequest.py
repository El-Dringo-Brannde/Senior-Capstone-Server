#A python script to hopefully make testing/grading the project easier
#Simulate the requests Alexa makes for user requests

import json
try:
    import urllib.request
except ImportError:
    print('Error importing urllib. This script needs to be run using Python3')
    quit()

state = ''
city = ''
grouping = ''
view = 'home'

#Build the query string for a new request
def buildRequest():
    global city
    global state
    global grouping
    serverURL = 'http://35.169.224.183:3105/sales/'
    userID = 'amzn1.ask.account.testing'

    requestURL = serverURL
    if(city != ''):
        requestURL = requestURL + 'city/' + city + '/'

    if(state != ''):
        requestURL = requestURL + 'state/' + state +'/'

    requestURL = requestURL + '?group=' + grouping + '&userID=' + userID

    return requestURL

#Accept a suggestion and make the request
def accept_suggestion():
    #Get the last suggestion for the user
    serverURL = 'http://35.169.224.183:3105/sales/last/user/'
    userID = 'amzn1.ask.account.testing'

    req = serverURL + userID
    makeRequest(req)

#Send the request and return what Alexa would have said
def makeRequest(requestURL):
    reqResult = urllib.request.urlopen(requestURL)

    data = reqResult.read()
    dataEncoding = reqResult.info().get_content_charset('utf-8')
    jsonData = json.loads(data.decode(dataEncoding))

    try:
        print(jsonData['speechlet'])
    except KeyError:
        print('')

#Print out a list of available commands
def printHelp():
    print('Commands:')
    print('help - Prints this list')
    print('demos - Prints a list of predefined request')
    print('city - Set the city to request')
    print('state - Set the city to request')
    print('group - Set how sales are aggregated')
    print('list - Show the currently defined request')
    print('run - Make the request')
    print('clear - Clear the currently defined request')
    print('view - Switch view between house and map')
    print('yes - Only works after a request, used to follow the suggested request')

#Intro to be shown upon startup
def printIntro():
    print('****************************')
    print('This script allows for testing the VR portion of the project without needing to set up an Echo with the custom commands')
    print('Sales were generated randomly, which means some cities were not used. If a request returns no results please try a different location')
    print('')
    printHelp()
    print('****************************')

#Get a state to request
def setState():
    global state
    print('Enter a new state for the request or blank to clear the current value of ' + state)
    newState = input('> ')

    state = newState

#Get a city to request
def setCity():
    global city
    print('Enter a new city for the request or blank to clear the current value of ' + city)
    newCity = input('> ')

    city = newCity

#Change the grouping method between color and brand
def setGrouping():
    global grouping
    print('Enter either "brand" or "color" to set what to group sales by. Currently ' + grouping)
    newGrouping = input('> ')

    if(newGrouping == 'brand' or newGrouping == 'color'):
        grouping = newGrouping
    else:
        print('Invalid entry, please try again')
        setGrouping()

#Swap the VR view between the house and map overview
def swap_view():
    global city
    global state
    global view
    global grouping
    serverURL = 'http://35.169.224.183:3105/sales/'
    userID = 'amzn1.ask.account.testing'

    if(view == 'home'):
        query = '/map/name/none/state/' + state + '/city/' + city + '/?userID=' + userID + '&group=' + grouping
        req = makeRequest(serverURL + query)
        view = 'map'
    else:
        req = makeRequest(serverURL + 'home/')
        view = 'home'

#Get user input for a command to run
def getCommand():
    global city
    global state
    global grouping

    command = input('Command: ')
    if(command == 'help'):
        printIntro()
    elif(command == 'demos'):
        print('demo stuff')
    elif(command == 'city'):
        setCity()
    elif(command == 'state'):
        setState()
    elif(command == 'group'):
        setGrouping()
    elif(command == 'list'):
        print('City: ' + city + '; State: '+ state + '; Group by: ' + grouping)
    elif(command == 'view'):
        swap_view()
    elif(command == 'yes'):
        accept_suggestion()
    elif(command == 'run'):
        if(grouping != '' and (city != '' or state != '')):
            print('You could make this request to Alexa by saying "Show me sales by ' + grouping + ' in ' + city + ', ' + state + '"')
            req = buildRequest()
            makeRequest(req)
        else:
            print('Please set some values to request. A request needs at least a city or state as well as grouping type')

    elif(command == 'clear'):
        state = ''
        city = ''
        grouping = ''
    else:
        print('Unknown command, please try again')

    getCommand()

printIntro()

getCommand()
