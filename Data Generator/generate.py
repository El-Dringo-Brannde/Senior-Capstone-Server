import random
import csv
from pymongo import MongoClient  # pip install PyMongo
from faker import Faker  # pip install Faker
from datetime import date
from datetime import datetime
import numpy as np
import math

MongoClient = MongoClient('mongodb://localhost:27017')
# setup mongodb connection
db = MongoClient.seniorCapstone
db = db.sales
# setup faker instance
f = Faker('en_US')
f.seed_instance()

# create some fake brands
brands = ["apache", "eagle", "brute", "coil", "delta"]

make_model = {
    "apache": ["zentoro", "adder", "bullet", "cabrio", "jester"],
    "eagle": ['banshee', 'felon', 'blade', 'pheonix', 'voodoo'],
    'brute': ['seminole', 'blazer', 'journey', 'pony', 'cheetah'],
    'coil': ['tesla', 'reaper', 'sentinel', 'comet', 'buffalo'],
    'delta': ['pinnacle', 'romero', 'premier', 'ingot', 'locus']
}

color_list = ["Red", "Silver", "White", "Blue", "Black"]

locations = []
avail_states = []
dealers = []

cities_min = 1
cities_max = 10

dealerships_min = 1
dealerships_max = 10

start_year = 2016
end_year = 2017

test_mode = False

# load US cities from file


def load_cities():
    with open('locationsLong.csv') as city_data:
        # open the file
        cityReader = csv.reader(city_data)

        # loop through all the cities and store each city/state combo
        for row in cityReader:
            city = {
                "city": row[3].lower(),
                "state": row[4].lower(),
                "zip": row[0],
                "lat": row[1],
                "long": row[2],
                "county": row[5].lower()
            }

            locations.append(city)

     # get the index ranges for each state
        avail_states.append([locations[0]["state"], 1, 1])

        # for every state, find the first and last index for it
        for i in range(len(locations)):
            # check if the current index is for a different state
            if(avail_states[-1][0] != locations[i]["state"]):
                # previous one was last index for previous state
                avail_states[-1][2] = (i - 1)
                # add it to the list
                avail_states.append([locations[i]["state"], i, i])

    # set the final state end index
    avail_states[-1][2] = len(locations) - 1

    return


def build_dealers():
    # go through all states
    for i in range(len(avail_states)):
     # go through all citites in the state
        num_cities = random.randint(cities_min, cities_max)
        for j in range(num_cities):
            # create the number of dealers in the city
            num_dealerships = random.randint(dealerships_min, dealerships_max)
            for k in range(num_dealerships):
                # get a random city from locations
                if(avail_states[i][1] == avail_states[i][2]):
                    avail_states[i][2]
                else:
                    loc = random.randrange(
                        avail_states[i][1], avail_states[i][2])

                # pick a random set of brands to sell
                avail_brands = []
                brand_count = random.randrange(1, len(brands) + 1)
                for l in range(brand_count):
                    avail_brands.append(
                        brands[random.randrange(0, len(brands))])

                # remove duplicate brands
                for m in range(len(avail_brands)):
                    if(len(avail_brands) > 1 and m < len(avail_brands)):
                        if (avail_brands.count(avail_brands[m]) > 1):
                            avail_brands.remove(avail_brands[m])

                # shift the dealership a small distance away from the city
                # center

                # lat/long change by distance changes depending on circumference of earth
                # at the current lat, so calculate it
                r_earth = 40074
                cir_earth = r_earth * math.cos(float(locations[loc]["lat"]))

                # lat/long calcs use KM, store the conversion factor for going
                # between KM and Miles
                converstion_factor = 0.62137119

                # generate a random number from a standard distribution
                # center around 0, standard dev of 5
                # 68% within 5 miles of center
                # 95% within 10
                # 99.7% within 15
                # 0.3% greater than 15 from city center
                # then convert to KM for the shift
                shift_lat = float(np.random.normal(
                    0, 5.0, 1) / converstion_factor)
                shift_long = float(np.random.normal(
                    0, 5.0, 1) / converstion_factor)

                lat = (
                    ((float(locations[loc]["lat"]) + shift_lat) / 40075) * 360)
                lon = (
                    ((float(locations[loc]["long"]) + shift_long) / 40075) * 360)

                # add the dealer
                dealers.append({
                    "id": 0,
                    "state": avail_states[i][0],
                    "city": locations[loc]["city"],
                    "zip": locations[loc]["zip"],
                    "lat": lat,
                    "long": lon,
                    "county": locations[loc]["county"],
                    "brands": avail_brands,
                    "ytd": 0,
                    "mtd": 0
                })

    # set the dealer ids
    for i in range(len(dealers)):
        dealers[i]["id"] = i + 1

    return


def gen_sale(dealer_index):
    # get the given dealership information
    city = dealers[dealer_index]["city"]
    state = dealers[dealer_index]["state"]
    dealer_id = dealers[dealer_index]["id"]

    # generate random information for the sale
    name = f.name()
    license = f.license_plate()
    color = color_list[random.randint(0, len(color_list) - 1)]

    # get a random brand from the brands the given dealership sells
    brand = dealers[dealer_index]["brands"][random.randrange(
        0, len(dealers[dealer_index]["brands"]))]

    # pick a random model from the brand
    model = make_model[brand][random.randint(0, len(make_model[brand]) - 1)]

    # random price between 10k and 100k
    price = round(random.uniform(10000.99, 100000.99), 2)

    # random date between one year before now and today
    date = datetime.combine(f.date_between(start_date="-1y", end_date="today"),
                            datetime.min.time())

    # create a sale dictionary from the given information
    sale = {
        "name": name,
        "age": random.randint(18, 60),
        "license": license,
        "color": color,
        "brand": brand,
        "model": model,
        "dealer_id": dealer_id,
        "price": price,
        "date": date,
        "days_on_lot": random.randint(1, 100)
    }

    return sale


def build_sales():
    # generate sales for each dealership
    for i in range(len(dealers)):
        # setup the database entry
        dealer_id = db.insert_one(dealers[i]).inserted_id

        # initialize the embedded sales document
        db.update_one(
            {'_id': dealer_id},
            {'$set': {'sales': [gen_sale(i)]}}
        )

        # increment year and month to date sales
        # TODO adjust for dates of more than a month
        db.update_one({'_id': dealer_id}, {'$inc': {'ytd': 1}})
        db.update_one({'_id': dealer_id}, {'$inc': {'mtd': 1}})

        # create the set number of sales
        for j in range(random.randint(5, 50)):
            # add the sale to the entry
            db.update_one(
                {'_id': dealer_id},
                {'$push': {'sales': gen_sale(i)}}
            )

            # increment sales numbers
            db.update_one({'_id': dealer_id}, {'$inc': {'ytd': 1}})
            db.update_one({'_id': dealer_id}, {'$inc': {'mtd': 1}})

    return


def get_choice(type, accepted, message, default):
    valid = False
    entry = ''
    if(type == 'string'):
        while(valid == False):
            entry = input(message)
            if(entry in accepted):
                return entry
            elif(entry == ""):
                return default
            else:
                print("Unrecognized entry, please try again")
    elif(type == 'int'):
        while(valid == False):
            entry = input(message)
            if(entry == ""):
                return default
            elif(accepted[0] <= int(entry) <= accepted[1]):
                return int(entry)
            else:
                print("Unrecognized entry, please try again")


def load_options():
    global cities_min
    global cities_max

    global dealerships_min
    global dealerships_max

    global start_year
    global end_year

    global test_mode

    print("Default settings:")

    print("Minimum cities per state: " + str(cities_min))
    print("Max cities per state: " + str(cities_max))

    print("Minimum dealerships per city: " + str(dealerships_min))
    print("Max dealerships per city: " + str(dealerships_max))

    print("Start year for sales: " + str(start_year))
    print("End year for sales: " + str(end_year))

    print("Testing mode: " + str(test_mode))

    prompt = "Use default settings [y]/n: "
    if(get_choice("string", ["y", "n"], prompt, "y") == "n"):
        # check if should generate range (between x and y) number of cities
        # or a set amount per state
        prompt = "Generate random number of cities per state [y]/n: "
        if(get_choice("string", ["y", "n"], prompt, "y") == "y"):
            prompt = "Minimum number of citites [" + str(cities_min) + "]: "
            cities_min = get_choice("int", [1, 1000], prompt, cities_min)

            prompt = "Max number of citites [" + str(cities_max) + "]: "
            cities_max = get_choice(
                "int", [cities_min, 1000], prompt, cities_max)
        else:
            prompt = "Number of cities to generate per state [" + str(
                cities_max) + "]: "
            cities_min = get_choice("int", [1, 1000], prompt, cities_max)
            cities_max = cities_min

        # same as above, but for dealerships per city
        prompt = "Generate random number of dealerships per city [y]/n: "
        if(get_choice("string", ["y", "n"], prompt, "y") == "y"):
            prompt = "Minimum number of dealerships [" + \
                str(dealerships_min) + "]: "
            dealerships_min = get_choice(
                "int", [1, 1000], prompt, dealerships_min)

            prompt = "Max number of dealerships [" + \
                str(dealerships_max) + "]: "
            dealerships_max = get_choice(
                "int", [dealerships_min, 1000], prompt, dealerships_max)
        else:
            prompt = "Number of dealerships to generate per city [" + str(
                dealerships_max) + "]: "
            dealerships_min = get_choice(
                "int", [1, 1000], prompt, dealerships_max)
            dealerships_max = dealerships_min

        # check for multi-year of sales
        prompt = "Generate more than one year of sales [y]/n: "
        if(get_choice("string", ["y", "n"], prompt, "y") == "y"):
            prompt = "Start year [" + str(start_year) + "]: "
            start_year = get_choice("int", [1970, 9999], prompt, start_year)

            prompt = "End year [" + str(end_year) + "]: "
            end_year = get_choice("int", [start_year, 9999], prompt, end_year)
        else:
            prompt = "Sale year [" + str(end_year) + "]: "
            start_year = get_choice("int", [1970, 9999], prompt, end_year)
            end_year = start_year

        # check if running tests
        prompt = "Run in test mode y/[n]: "
        if(get_choice("string", ["y", "n"], prompt, "n") == "y"):
            test_mode = True
        else:
            test_made = False


# setup run options
load_options()
# create a list of cities from the included file
load_cities()
# create some dealerships
build_dealers()
# fill them with sales
build_sales()
