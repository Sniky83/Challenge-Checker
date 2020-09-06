from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import requests, json, time

while 1:
    URL_API_SUBMIT = "http://localhost:3000/api/new/ticket"

    URL_API_NEW_SOLVER = "http://localhost:3000/api/new/solver"

    URL_API_REMOVE = "http://localhost:3000/api/remove/tickets"

    URL_JSON_TICKETS = "http://localhost:3000/api/get/tickets"

    headers = {'x-access-token': 'qhGipVM?rb;akCvdHd:VEsjV3KHxwG1q8jd8J3yn6Yz2F&BN1T'}

    response = requests.get(URL_JSON_TICKETS, headers=headers)

    data = response.json()

    state = 0

    for i in data:
        vuln_type = i['vulnerability_type']
        if(vuln_type == 'XSS'):
            state = 1
            break
    
    if(state == 1):
        print("Début de l'analyse ...")
        opts = webdriver.FirefoxOptions()
        opts.headless = True
        browser = webdriver.Firefox(options=opts)

        increment1 = 0
        for i in data:
            chall_id = i['challenge_id']
            base_url = i['base_url']
            payload = i['data']
            username = i['username']
            url_data = base_url + payload

            status_code = requests.head(url_data).status_code

            if(status_code != 404):
                try:
                    browser.get(url_data)
                    #browser.find_element_by_id("xss_button").click()
                    WebDriverWait(browser, 5).until(EC.alert_is_present())
                    browser.switch_to.alert.accept()
                    print("Alert Acceptée pour l'user : " + username)
                    #On insert dans l'API
                    res = requests.post(URL_API_NEW_SOLVER, headers=headers, json={"challenge_id": chall_id, "vulnerability_type": "XSS", "username": username})
                    res = res.json()
                    res = res['message']
                    if(res == 'Informations correctement envoyées !'):
                        print("Nouveau gagnant ajouté !")
                    else:
                        print("Problème lors de l'ajout du gagnant !")
                except TimeoutException:
                    print("Alert refusée pour l'user : " + username)
            else:
                print("Erreur 404 Not Found ! (logiquement impossible) " + username)
        #On clear le fichier JSON de submit
        requests.delete(URL_API_REMOVE, headers=headers)
        increment1 = increment1+1
        browser.close()
        print("Fin de l'analyse ...")
        time.sleep(60)
    else:
        time.sleep(60)
        print("Aucun ticket n'a été posté !")