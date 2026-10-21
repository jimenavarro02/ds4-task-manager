"""Pruebas E2E del Task Manager (Selenium + Chrome headless).

Se ejecutan contra la aplicación corriendo (por defecto http://localhost:8080,
configurable con la variable BASE_URL).
"""
import time

import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

from conftest import BASE_URL, E2E_PASS, E2E_USER


# ---------- helpers ----------
def escribir(elemento, texto):
    """Borra y escribe. Se usa Ctrl+A porque clear() no dispara el evento 'input' de Angular."""
    elemento.click()
    elemento.send_keys(Keys.CONTROL, "a")
    elemento.send_keys(Keys.DELETE)
    elemento.send_keys(texto)


def hacer_login(driver, wait, usuario=E2E_USER, password=E2E_PASS):
    driver.get(f"{BASE_URL}/login")
    escribir(wait.until(EC.visibility_of_element_located((By.ID, "usuario"))), usuario)
    escribir(driver.find_element(By.ID, "password"), password)
    driver.find_element(By.ID, "btn-login").click()


def xpath_tarea(titulo):
    return f"//li[contains(@class,'tarea')][.//strong[contains(@class,'tarea-titulo')][normalize-space()='{titulo}']]"


# ---------- pruebas ----------
def test_login_incorrecto_muestra_error(driver, wait):
    hacer_login(driver, wait, E2E_USER, "clave-incorrecta")
    error = wait.until(EC.visibility_of_element_located((By.ID, "login-error")))
    assert "incorrectos" in error.text
    assert "/login" in driver.current_url


def test_ruta_protegida_redirige_al_login(driver, wait):
    driver.get(f"{BASE_URL}/tareas")
    wait.until(EC.url_contains("/login"))
    assert driver.find_element(By.ID, "form-login").is_displayed()


def test_login_correcto_y_logout(driver, wait):
    hacer_login(driver, wait)
    wait.until(EC.url_contains("/tareas"))
    usuario = wait.until(EC.visibility_of_element_located((By.ID, "usuario-actual")))
    assert usuario.text == E2E_USER

    driver.find_element(By.ID, "btn-logout").click()
    wait.until(EC.url_contains("/login"))


def test_crud_completo_de_tareas(driver, wait):
    sufijo = str(int(time.time()))
    titulo = f"Tarea E2E {sufijo}"
    titulo_editado = f"Tarea E2E editada {sufijo}"

    # 1) LOGIN
    hacer_login(driver, wait)
    wait.until(EC.url_contains("/tareas"))
    wait.until(EC.presence_of_element_located((By.ID, "lista-tareas")))

    # 2) CREATE
    escribir(wait.until(EC.visibility_of_element_located((By.ID, "titulo"))), titulo)
    escribir(driver.find_element(By.ID, "descripcion"), "Creada por Selenium")
    Select(driver.find_element(By.ID, "estado")).select_by_visible_text("Pendiente")
    driver.find_element(By.ID, "btn-guardar").click()

    fila = wait.until(EC.visibility_of_element_located((By.XPATH, xpath_tarea(titulo))))
    assert fila.get_attribute("data-estado") == "Pendiente"
    assert "Creada por Selenium" in fila.text

    # 3) READ: la tarea aparece en la lista y el contador es > 0
    assert int(driver.find_element(By.ID, "contador").text) >= 1

    # 4) UPDATE
    fila.find_element(By.CSS_SELECTOR, ".btn-editar").click()
    wait.until(EC.visibility_of_element_located((By.ID, "btn-cancelar")))  # solo existe en modo edición
    escribir(driver.find_element(By.ID, "titulo"), titulo_editado)
    Select(driver.find_element(By.ID, "estado")).select_by_visible_text("Completada")
    driver.find_element(By.ID, "btn-guardar").click()

    fila_editada = wait.until(EC.visibility_of_element_located((By.XPATH, xpath_tarea(titulo_editado))))
    assert fila_editada.get_attribute("data-estado") == "Completada"
    wait.until(EC.invisibility_of_element_located((By.XPATH, xpath_tarea(titulo))))

    # 5) DELETE
    fila_editada.find_element(By.CSS_SELECTOR, ".btn-eliminar").click()
    wait.until(EC.invisibility_of_element_located((By.XPATH, xpath_tarea(titulo_editado))))
    assert not driver.find_elements(By.XPATH, xpath_tarea(titulo_editado))
