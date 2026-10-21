import os
import pathlib

import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.getenv("BASE_URL", "http://localhost:8080").rstrip("/")
E2E_USER = os.getenv("E2E_USER", "jimena.navarro")
E2E_PASS = os.getenv("E2E_PASS", "111111")
SCREENSHOTS = pathlib.Path(__file__).parent / "screenshots"


@pytest.fixture
def driver(request):
    opts = Options()
    if os.getenv("HEADLESS", "1") == "1":
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1366,900")
    drv = webdriver.Chrome(options=opts)
    drv.implicitly_wait(0)  # solo esperas explícitas
    yield drv
    # Captura de pantalla si la prueba falló (se sube como artefacto en el pipeline)
    rep = getattr(request.node, "rep_call", None)
    if rep is not None and rep.failed:
        SCREENSHOTS.mkdir(exist_ok=True)
        drv.save_screenshot(str(SCREENSHOTS / f"{request.node.name}.png"))
    drv.quit()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, 15)


@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    setattr(item, f"rep_{rep.when}", rep)
