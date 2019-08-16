# docker

## To build  container:
```cd OrgRestAPI```

``` docker build -t d1121f/pipedrivetask .```

## To run  container:
``` docker run --name pipedrivetest -p 3000:3000 d1121f/pipedrivetask```

## To start nodejs server
``` docker exec pipedrivetest node index.js```
# Usage

## GET all organizations
 - Your docker machine ip: example 192.168.99.100
 
	send GET request to 192.168.99.100/orgs
	
## POST organizations names
 - Your docker machine ip: example 192.168.99.100
 
 - Send POST request to 192.168.99.100/orgs
	For example: use the following values to make a post request
```
{
    "org_name": "Paradise Island",
    "daughters": [
        {
            "org_name": "Banana tree",
            "daughters": [
                {
                    "org_name": "Yellow Banana"
                },
                {
                    "org_name": "Brown Banana"
                },
                {
                    "org_name": "Black Banana"
                }
            ]
        },
        {
            "org_name": "Big banana tree",
            "daughters": [
                {
                    "org_name": "Yellow Banana"
                },
                {
                    "org_name": "Brown Banana"
                },
                {
                    "org_name": "Green Banana"
                },
                {
                    "org_name": "Black Banana",
                    "daughters": [
                        {
                            "org_name": "Phoneutria Spider"
                        }
                    ]
                }
            ]
        }
    ]
}
```
 - Now you can make the GET request again using the above example and it should return
 the lists of organizations. 
 
 ## Search organizations names
 - Your docker machine ip: example 192.168.99.100
 - Send GET request to 192.168.99.100/orgs/name of organization
 OR
 - Send GET request to 192.168.99.100/orgs/name of organization/page
 - page parameter is optional. If passed nothing, it will return the first 100 results
 - page has to be positive number
 