import { test, expect } from '@playwright/test';

test('Registro de Musico - Flujo End-to-End', async ({ page }) => {

    // Configuracion de datos de prueba
    const timestamp = Date.now();
    const testData = {
        usuario: `TesterQA${timestamp}`,
        email: `test+id${timestamp}@gmail.com`,
        password: 'PruebaQA123!',
        nombre: 'Rafael Canales',
        telefono: '77015982'
    };

    console.log(`Iniciando prueba para: ${testData.usuario}`);

    // Navegar a la pagina de registro
    await test.step('Navegar y Rol', async () => {
        await page.goto('https://altempo.dev/signin');
        await page.getByRole('button', { name: /registrarse|sign up/i }).first().click();
        await page.getByRole('button', { name: /músico|musician/i }).first().click();
        await page.locator('.card-hunter').first().click();
        await page.getByRole('button', { name: /continuar|continue/i }).click();
    });

    // Llenar datos personales
    await test.step('Llenar Datos Personales', async () => {
        // FIX: Asegurar que el nombre se registre haciendo click fuera
        await page.locator('#name').fill(testData.nombre);
        await page.locator('#username').click(); // Forzar blur del nombre haciendo clic en el siguiente

        await page.locator('#username').fill(testData.usuario);
        await page.locator('input[name="email"]').click(); // Forzar blur del usuario

        await page.locator('input[name="email"]').fill(testData.email);
        await page.locator('#password1').click(); // Forzar blur del email

        await page.locator('#password1').fill(testData.password);
        await page.locator('#password2').fill(testData.password);
        // Clic fuera para asegurar que el último password también se guarde
        await page.locator('body').click();
    });

    // Seleccionar campos de los dropdowns
    await test.step('Seleccionar Dropdowns', async () => {

        // Pais
        console.log("Seleccionando Pais...");
        // nth(1) para evitar el label
        await page.locator('div').filter({ hasText: /^País|^Country/i }).nth(1).click();
        await page.waitForTimeout(500);

        // Escribimos para filtrar y clickeamos el texto
        await page.keyboard.type('El Salvador');
        await page.waitForTimeout(500);
        await page.getByText('El Salvador').first().click();

        // Click fuera para cerrar dropdown
        await page.locator('body').click({ position: { x: 0, y: 0 } });

        // Genero
        console.log("Seleccionando Genero...");
        await page.locator('div').filter({ hasText: /^Género|^Gender/i }).nth(1).click();
        await page.waitForTimeout(500);
        await page.getByText(/Masculino|Male/i).first().click();

        await page.locator('body').click({ position: { x: 0, y: 0 } });

        // Como nos conociste
        console.log("Seleccionando Origen...");
        await page.locator('div').filter({ hasText: /^¿Cómo nos|^How did/i }).nth(2).click();
        await page.waitForTimeout(500);
        await page.getByText(/Otro|Other/i).first().click();

        await page.locator('body').click({ position: { x: 0, y: 0 } });
    });

    // Fecha de nacimiento
    await test.step('Seleccionar Fecha', async () => {
        console.log("Seleccionando fecha...");
        await page.locator('.datepicker-input').last().click({ force: true });

        const currentYear = new Date().getFullYear().toString();
        await page.getByText(currentYear).first().click();

        const year = page.getByText('2005', { exact: true }).first();
        await year.scrollIntoViewIfNeeded();
        await year.click();

        await page.getByText('16', { exact: true }).first().click();

        await page.locator('body').click({ position: { x: 0, y: 0 } });
    });

    // Telefono
    await test.step('Teléfono', async () => {
        await page.locator('#phone_number').fill(testData.telefono);
        await page.locator('#phone_number').press('Tab');
    });

    // Paso final: Enviar y Validar
    await test.step('Enviar Formulario y Validar Respuesta', async () => {

        // 1. Activar el mensaje de error crítico si el servidor responde con un 500
        let errorCritico = null;
        page.on('response', response => {
            if (response.status() >= 500) {
                errorCritico = `ALERTA BLOCKER: El servidor falló con código ${response.status()} en ${response.url()}`;
            }
        });

        // 2. Hacer Clic en Crear Cuenta
        console.log('Haciendo clic en crear cuenta...');
        await page.getByRole('button', { name: /crear|sign up|create/i }).last().click();

        // 3. Esperar un momento breve (3 segundos) para dar tiempo a que el servidor responda
        await page.waitForTimeout(3000);

        if (errorCritico) {
            throw new Error(errorCritico);
        }

        // 5. Si no hubo 500, buscamos mensajes visuales de error
        const mensajeError = page.locator('text=/error|failed|500|servidor/i');
        if (await mensajeError.isVisible()) {
            const texto = await mensajeError.innerText();
            throw new Error(`ERROR VISUAL DETECTADO: "${texto}"`);
        }

        // 6. Validación final de éxito
        await expect(page.getByText(/bienvenido|welcome/i)).toBeVisible({ timeout: 5000 });
    });

    console.log('Prueba finalizada.');
});