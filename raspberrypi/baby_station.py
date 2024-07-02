import time
from typing import TypedDict

from pyvirtualdisplay import Display

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.ui import Select

from utils import login

firefox_profile = webdriver.FirefoxProfile()
firefox_profile.set_preference("media.navigator.permission.disabled", True)
firefox_profile.set_preference("media.navigator.streams.fake", False)
firefox_options = webdriver.FirefoxOptions()
firefox_options.profile = firefox_profile

class NewBabyStationInput(TypedDict):
    email: str
    password: str

class BabyStation:
    def __init__(self, input: NewBabyStationInput):
        self.email = input["email"]
        self.password = input["password"]
        self.target_state = 0
        self.should_continue = True

    def run(self):
        with Display(visible=0, size=[992,600]) as display:
            service = webdriver.FirefoxService(executable_path="/usr/local/bin/geckodriver")
            with webdriver.Firefox(service=service, options=firefox_options) as driver:
                driver.get("https://app.beddybytes.com")

                login(driver, self.email, self.password)

                driver.find_element(By.ID, "nav-link-baby").click()
                wait = WebDriverWait(driver, timeout=2)

                select_video_device = wait.until(lambda driver: Select(driver.find_element(By.ID, "select-video-device")))
                if len(select_video_device.options) > 0:
                    select_video_device.options[1].click()

                while self.should_continue:
                    time.sleep(1)
                    session_toggle = wait.until(lambda driver: driver.find_element(By.ID, "session-toggle"))
                    session_toggle_text = session_toggle.text
                    try:
                        current_state = get_current_state(session_toggle_text)
                        if current_state == self.target_state:
                            continue
                        session_toggle.click()
                    except Exception as exception:
                        print(exception)
                        continue

    def start(self):
        self.target_state = 1

    def stop(self):
        self.target_state = 0

    def close(self):
        self.should_continue = False

def login(driver, email, password):
    wait = WebDriverWait(driver, timeout=2)

    form_element = wait.until(lambda driver: driver.find_element(By.ID, "form-login"))
    
    email_input_element = form_element.find_element(By.ID, "input-login-email")
    email_input_element.send_keys(email)

    password_input_element = form_element.find_element(By.ID, "input-login-password")
    password_input_element.send_keys(password)

    submit_button_element = form_element.find_element(By.ID, "submit-button-login")
    submit_button_element.click()

    wait.until(lambda driver: driver.find_element(By.ID, "page-index"))

def get_current_state(session_toggle_text):
    if session_toggle_text == "Start":
        return 0
    if session_toggle_text == "Stop":
        return 1
    raise Exception(f"session_toggle.text is {session_toggle_text}, expected 'Start' or 'Stop'")