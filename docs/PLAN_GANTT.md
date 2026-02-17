# Roadmap Estratégico de QA Automation

Este documento delinea la estrategia de expansión para la cobertura de pruebas automatizadas en **Altempo**. El plan está diseñado para mitigar riesgos en los flujos de ingreso (Revenue) y asegurar la estabilidad de la plataforma 24/7.

## Cronograma de Ejecución (Gantt)

```mermaid
gantt
    title Plan de Automatizacion QA - Altempo
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Fase 1 Registro
    Registro Musico y Bug 500       :done,    r1, 2026-02-15, 2d

    section Fase 2 Perfil
    Edicion Bio y Redes             :active,  p1, 2026-02-18, 2d
    Carga Foto Perfil               :         p2, after p1, 1d

    section Fase 3 Portafolio
    Modulo Audio Reproductor        :crit,    m1, after p2, 2d
    Modulo Video Links              :         m2, after m1, 1d

    section Fase 4 Buscador
    Filtros Genero y Pais           :         h1, 2026-02-25, 2d
    Buscador Presupuesto            :         h2, after h1, 1d

    section Fase 5 Optimizacion
    Alertas Slack y WhatsApp        :         o1, after h2, 2d
