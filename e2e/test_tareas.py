import os
import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC


class PruebasCRUD(unittest.TestCase):

    def setUp(self):
        # Ejecutar Chrome sin abrir una ventana visible.
        opciones = webdriver.ChromeOptions()
        opciones.add_argument("--headless")
        opciones.add_argument("--no-sandbox")
        opciones.add_argument("--disable-dev-shm-usage")
        opciones.add_argument("--window-size=1365,900")

        self.driver = webdriver.Chrome(options=opciones)
        self.espera = WebDriverWait(self.driver, 15)

        # En CI se usa la aplicación ejecutada dentro de Docker.
        self.url = os.getenv("APP_URL", "http://localhost:8080")

    def tearDown(self):
        # Cerrar el navegador al terminar cada prueba.
        self.driver.quit()

    def test_login_y_crud_completo(self):
        driver = self.driver

        # 1. Abrir directamente la ruta de login de la aplicación
        url_app = self.url + "/login"
        for intento in range(5):
            try:
                driver.get(url_app)
                break
            except Exception:
                if intento == 4:
                    raise
                time.sleep(3)

        # Dar tiempo a que Spring Boot y la SPA carguen por completo
        time.sleep(5)

        print("URL actual:", driver.current_url)
        driver.save_screenshot("error_login.png")
        
        # Imprimir parte del HTML que está cargando el navegador para depurar
        print("--- INICIO HTML CARGADO ---")
        print(driver.page_source[:500]) # Muestra los primeros 500 caracteres
        print("--- FIN HTML CARGADO ---")

        # 2. Iniciar sesión con el usuario de prueba
        self.espera.until(
            EC.visibility_of_element_located((By.ID, "usuario"))
        ).send_keys(
            os.getenv("E2E_USER", "jimena.navarro")
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)