import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import NoSuchElementException

from settings import hub_url, app_base_url, chrome_options
from utils import create_account, login, generate_random_string

class RecordingServiceTest(unittest.TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_recording(self):
        email = f'{generate_random_string(10)}@integrationtests.com'
        password = generate_random_string(20)

        with webdriver.Remote(command_executor=hub_url, options=chrome_options) as baby_station_driver, webdriver.Remote(command_executor=hub_url, options=chrome_options) as parent_station_driver:
            baby_station_driver.get(f"{app_base_url}")
            create_account(baby_station_driver, email, password)
            baby_station_driver.find_element(By.ID, "nav-link-baby").click()
            baby_station_driver_wait = WebDriverWait(baby_station_driver, 1)
            select_video_device = baby_station_driver_wait.until(lambda driver: Select(driver.find_element(By.ID, "select-video-device")))
            select_video_device.options[1].click()
            session_toggle = baby_station_driver_wait.until(lambda driver: driver.find_element(By.ID, "session-toggle"))
            session_toggle.click()

            parent_station_driver.get(f"{app_base_url}")
            login(parent_station_driver, email, password)
            parent_station_driver.find_element(By.ID, "nav-link-parent").click()

            parent_station_driver_wait = WebDriverWait(parent_station_driver, 1)
            session_dropdown = parent_station_driver_wait.until(lambda driver: Select(driver.find_element(By.ID, "session-dropdown")))
            session_dropdown.options[1].click()

            start_recording_button = parent_station_driver_wait.until(lambda driver: driver.find_element(By.ID, "button-start-recording"))
            self.assertTrue(start_recording_button.is_displayed())
            start_recording_button.click()

            stop_recording_button = parent_station_driver_wait.until(lambda driver: driver.find_element(By.ID, "button-stop-recording"))
            self.assertTrue(stop_recording_button.is_displayed())
            stop_recording_button.click()

            start_recording_button = parent_station_driver_wait.until(lambda driver: driver.find_element(By.ID, "button-start-recording"))
            self.assertTrue(start_recording_button.is_displayed())

            # TODO: Check that the recording is saved

            