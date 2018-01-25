import random
import csv
from pymongo import MongoClient  # pip install PyMongo
from faker import Faker  # pip install Faker
from datetime import date
from datetime import datetime

# setup mongodb connection
#client = MongoClient()
#db = client.seniorCapstone.sales

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

dealers_per_city = random.randint(2, 10)
cities_per_state = random.randint(2, 10)

# load US cities from file


def load_cities():
    with open('locations.csv') as city_data:
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
            print(city)
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
        for j in range(cities_per_state):
            # create the number of dealers in the city
            for k in range(dealers_per_city):
                #get a random city from locations
                loc = random.randrange(avail_states[i][1], avail_states[i][2])

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

                # add the dealer
                dealers.append({
                    "id": 0,
                    "state": avail_states[i][0],
                    "city": locations[loc]["city"],
                    "zip": locations[loc]["zip"],
                    "lat": locations[loc]["lat"],
                    "long": locations[loc]["long"],
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
    color = color_list[random.randint(0, len(color_list))]

    # get a random brand from the brands the given dealership sells
    brand = dealers[dealer_index]["brands"][random.randrange(
        0, len(dealers[dealer_index]["brands"]))]

    #pick a random model from the brand
    model = make_model[brand][random.randint(0, len(make_model[brand]))]

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
        "color_name": color,
        "brand": brand,
        "model": model,
        "dealer_id": dealer_id,
        "price": price,
        "date": date
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


# TODO allow definition of settings through prompts and/or CLI


# create a list of cities from the included file
load_cities()
# create some dealerships
build_dealers()
# fill them with sales
build_sales()
