# Sistema de Monitoreo QA - Altempo (Módulo Músico)

**Responsable:** Rafael Ernesto | **Rol:** QA Automation Engineer

Este repositorio centraliza la estrategia de aseguramiento de calidad y monitoreo sintético para la plataforma Altempo. El sistema está diseñado para validar la disponibilidad de los flujos de ingreso (Revenue) sin intervención manual.

## Dashboard de Estado (Tiempo Real)

Consulte el estado actual de la plataforma en el siguiente enlace:

**https://ac2vnxek.checkly-dashboards.com/**

### Interpretación del Dashboard
* **Passing (Verde):** El flujo de registro opera correctamente.
* **Failing (Rojo):** Se ha detectado una incidencia crítica que impide el uso de la plataforma.

---

## Estado Actual: Falla Crítica Detectada

El sistema de monitoreo reporta actualmente un estado de **FALLO**.

* **Incidencia:** Error 500 (Internal Server Error) al finalizar el registro de un músico.
* **Impacto de Negocio:** Bloqueo total. La tasa de conversión de nuevos músicos es 0% mientras persista el error.
* **Acción Requerida:** Revisión prioritaria del endpoint de creación de usuarios por parte del equipo de Backend.

---

## Documentación del Proyecto

Se adjuntan los documentos de soporte para la toma de decisiones y planificación:

| Documento | Descripción |
| :--- | :--- |
| **[Reporte de Hallazgos]()** | Listado de bugs técnicos y mejoras de UX priorizados por riesgo. |
| **[Plan de Automatización](./docs/PLAN_GANTT.md)** | Roadmap de ejecución para cubrir Perfil, Portafolio y Buscador. |
| **[Estrategia de Seguridad](./docs/ESTRATEGIA_SEGURA.md)** | Protocolo de aislamiento de datos para pruebas en Producción. |

---

## Evidencia de Alertas y Notificaciones

El sistema cuenta con un protocolo de notificación inmediata vía correo electrónico ante caídas del servicio.

**1. Configuración del Canal de Alerta**
El monitor está vinculado al correo del equipo de QA/Producto.

<img width="600" height="360" alt="image" src="https://github.com/user-attachments/assets/fbf4849d-ff72-4ca6-87ad-e98df99be102" />




---

## Ficha Técnica

* **Cobertura:** Flujo End-to-End de Registro de Músico.
* **Frecuencia:** Ejecución automática cada 10 minutos.
* **Seguridad de Datos:** Los usuarios generados utilizan el prefijo "TesterQA" y correos únicos para no contaminar las métricas de negocio.
* **Tecnología:** Playwright + Checkly.
