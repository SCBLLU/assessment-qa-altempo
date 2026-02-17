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

    // Enviar y Validar con Intercepción de Red
    await test.step('Enviar Formulario y Validar Respuesta', async () => {
        console.log('Intentando crear usuario...');

        // Escuchar la respuesta de la red antes de hacer clic
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('/api/') && response.request().method() === 'POST'
            , { timeout: 10000 }).catch(() => null); // No fallar si no hay respuesta de red, seguimos con UI

        await page.getByRole('button', { name: /crear|sign up|create/i }).last().click();

        // 1. Verificación Técnica (Código de estado HTTP)
        const response = await responsePromise;
        if (response && response.status() >= 500) {
            throw new Error(`BLOCKER DETECTADO: El servidor respondió con Error ${response.status()} al crear la cuenta.`);
        }

        // 2. Verificación Visual (Lo que ve el usuario)
        const exito = page.getByText(/bienvenido|welcome/i);
        // Buscamos cualquier indicador de error genérico o de servidor
        const falloServer = page.locator('text=/error.*servidor|500|failed|internal server error|unexpected error/i');
        const falloValidacion = page.getByText(/obligator|required|debes tener|must be/i).first();

        // Esperamos a que aparezca cualquiera de los tres estados
        await expect(exito.or(falloServer).or(falloValidacion)).toBeVisible({ timeout: 20000 });

        if (await falloServer.isVisible()) {
            const msg = await falloServer.innerText();
            // Este mensaje es el que saldrá en el encabezado del Dashboard
            throw new Error(`ERROR CRÍTICO EN PANTALLA: El sistema muestra mensaje de error: "${msg}"`);
        }

        if (await falloValidacion.isVisible()) {
            const texto = await falloValidacion.innerText();
            throw new Error(`Error de validación en formulario: "${texto}"`);
        }

        // Si llegamos aquí y no hay éxito visible, algo raro pasó
        await expect(exito).toBeVisible({ message: 'No se vio mensaje de éxito ni de error conocido.' });
    });

    console.log('Prueba finalizada.');
});