import json
try:
    import urllib.request
except ImportError:
    print('Error importing urllib. This script needs to be run using Python3')
    quit()

city = ''
state = ''
grouping = ''

def buildRequest():
    serverURL = 'http://35.169.224.183:3105/sales/'
    userID = 'amzn1.ask.account.testing'

    requestURL = serverURL
    if(city != ''):
        requestURL = requestURL + 'city/' + city + '/'

    if(city != ''):
        requestURL = requestURL + 'state/' + state +'/'

    requestURL = requestURL + '?group=' + grouping + '&userID=' + userID
    print('Requesting ' + requestURL)
    return requestURL

def makeRequest(requestURL):
    return urllib.request.urlopen(requestURL)

def parseResult(reqResult):
    data = reqResult.read()
    dataEncoding = reqResult.info().get_content_charset('utf-8')
    jsonData = json.loads(data.decode(dataEncoding))

    print(jsonData['speechlet'])

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

def printIntro():
    print('****************************')
    print('This script allows for testing the VR portion of the project without needing to set up an Echo with the custom commands')
    print('Sales were generated randomly, which means some cities were not used. If a request returns no results please try a different location')
    print('')
    printHelp()
    print('****************************')

def setState():
    print('Enter a new state for the request or blank to clear the current value of ' + state)
    newState = input('> ')

    state = newState

def setCity():
    print('Enter a new city for the request or blank to clear the current value of ' + city)
    newCity = input('> ')

    city = newCity

def setGrouping():
    print('Enter either "brand" or "color" to set what to group sales by. Currently ' + grouping)
    newGrouping = input('> ')

    if(newGrouping == 'brand' || newGrouping == 'color'):
        grouping = newGrouping
    else:
        print('Invalid entry, please try again')
        setGrouping()


def getCommand():
    command = input('Command: ')
    if(command == 'help'):
        printIntro()
    elif(command == 'demos'):

    elif(command == 'city'):
        setCity()
    elif(command == 'state'):
        setState()
    elif(command == 'group'):
        setGrouping()
    elif(command == 'list'):
        print('City: ' + city + '; State: '+ state + '; Group by: ' + grouping)
    elif(command == 'run'):
        if(grouping != '' && (city != '' || state != '')):
            print('You could make this request to Alexa by saying "Show me sales by ' + grouping + ' in ' + city + ', ' + state + '."')
            req = buildRequest()
            res = makeRequest(req)
            parseResult(res)
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
